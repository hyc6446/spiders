# -*- coding: utf-8 -*-
import scrapy
import json
import redis
from w3lib.html import remove_tags
from scrapy.conf import settings
from gushiwen.items import GushiwenItem
class GswappSpider(scrapy.Spider):
    name = 'gswapp'
    allowed_domains = ['app.gushiwen.org']
    # start_urls = ['https://app.gushiwen.org/api/author/Default.aspx']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        # for i in range(1,1001):
        #     url = "https://app.gushiwen.org/api/author/Default.aspx?p=%s"%i
        #     formdata = {"c": "", "id": '0', "page": str(i), "pwd": "", "token": "gswapi"}
        #     yield scrapy.FormRequest(url = url,callback = self.parse,dont_filter=True,formdata=formdata,meta={'i':i})
        data = self.redis_pool.hvals("gswAuthors")
        for key in data:
            sumPage = eval(key)['sumPage']
            if sumPage:
                if sumPage >10:
                    sumPage = 10
                url = "https://app.gushiwen.org/api/author/authorsw2.aspx"
                idnew = eval((key))['idnew']
                print(eval((key))['name'],"开始执行")
                for i in range(1,int(sumPage)+1):
                    formdata = {'id':str(idnew),'page':str(i),'token':'gswapi'}
                    yield scrapy.FormRequest(url,callback=self.parse_list,dont_filter=True,formdata=formdata)
                    # break
            # break

    def parse(self, response):
        print(response.meta['i'],response.text)
        data =json.loads(response.text)
        for author in data['authors']:
            id = author.get("id","")
            if not self.redis_pool.hexists("gswAuthors",id):
                print(id)
                idnew = author.get("idnew", "")
                url = "https://app.gushiwen.org/api/author/authorsw2.aspx/?p=%s"%response.meta['i']
                formdata = {'id':str(idnew),'page':'1','token':'gswapi'}
                yield scrapy.FormRequest(url,callback=self.parse_list,dont_filter=True,formdata=formdata)
            else:
                print(id,"已存在")

    def parse_list(self,response):
        data = json.loads(response.text)
        url = "https://app.gushiwen.org/api/shiwen/shiwenv.aspx"
        for d in data['tb_gushiwens']:
            idnew = d['idnew']
            if not self.redis_pool.hexists("gswDatas1", idnew):
                formdata = {'id': str(idnew), 'token': 'gswapi'}
                yield scrapy.FormRequest(url, callback=self.parse_content,dont_filter=True, formdata=formdata)

    def parse_content(self,response):
        json_data = json.loads(response.text)
        item = GushiwenItem()
        #古诗标题
        author = json_data.get("tb_author", '')
        tb_gushiwen = json_data.get('tb_gushiwen',"")
        tb_fanyis = json_data.get('tb_fanyis',"")
        tb_shangxis = json_data.get('tb_shangxis',"")
        zhushi, fanyi,shangxi = "暂无", "暂无", "暂无"
        if tb_gushiwen:
            item['idnew'] = tb_gushiwen.get("idnew", "")
            item['id'] = author.get("id", "")
            item['title'] =tb_gushiwen.get('nameStr',"暂无")
            #古诗作者
            item['name'] =tb_gushiwen.get('author',"暂无")
            #古诗内容
            item['content'] = remove_tags(tb_gushiwen.get('cont',"暂无")).replace("\u3000","").replace("\r","").replace("\n","")
            #古诗标签
            item['category'] =tb_gushiwen.get('tag') if tb_gushiwen.get('tag') else "暂无"
        if tb_fanyis:
            fanyis = tb_fanyis.get("fanyis","")
            if fanyis:
                nameStr = fanyis[0].get("nameStr","")
                cont = fanyis[0].get("cont","")
                if nameStr == "注释":
                    zhushi = remove_tags(cont).replace("注释", "")
                elif nameStr == "译文":
                    fanyi = remove_tags(cont).replace("注释", "")
                elif nameStr == "译文及注释":
                    for txt in cont.split("\n"):
                        if "译文" in txt:
                            fanyi = remove_tags(txt).replace("译文", "")
                        elif "注释" in txt:
                            zhushi = remove_tags(txt).replace("注释", "")
                else:
                    fanyi, zhushi = "暂无", "暂无"

        if tb_shangxis:
            shangxidata = json_data.get('tb_shangxis',"")
            if shangxidata:
                shangxis = shangxidata.get("shangxis","")
                if shangxis:
                    shangxi = remove_tags(shangxis[0].get("cont","暂无")).replace("\u3000","").replace("\r","").replace("\n","")
        #古诗注释
        item['notes'] = zhushi.replace("\r","").replace("\n","")
        #古诗翻译
        item['explanation'] = fanyi.replace("\r","").replace("\n","")
        #古诗赏析
        item['appreciation'] = shangxi.replace("\r","").replace("\n","")
        yield item

