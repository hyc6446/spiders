# -*- coding: utf-8 -*-
import scrapy
import re
import json
import redis
from urllib.parse import quote_plus,unquote
from scrapy.utils.project import get_project_settings
from proweb.items import ProwebLawsuitItem
settings = get_project_settings()

class LawsuitSpider(scrapy.Spider):
    '''
        法律诉讼
    '''
    name = 'tyc_lawsuit'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://tianyancha.com/']


    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = self.redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for item in allkeys:
                key = item[0]
                val = json.loads(item[1].replace("'",'"'))
                url = "https://www.tianyancha.com/pagination/lawsuit.xhtml?ps=30&pn=1&id=%s&name=%s"%(key,quote_plus(val['name']))
                yield scrapy.Request(url,callback=self.parse,meta={'id':key,'name':quote_plus(val['name'])})
            print("数据已存在")
            break
        else:
            print("没有数据")

    def parse(self, response):
        item = ProwebLawsuitItem()
        meta = response.meta
        table_trs = response.css("table.table>tbody>tr")
        if table_trs:
            for tr in table_trs:
                table_dict = {}#
                url = tr.xpath("./td[3]//a/@href").extract_first() if tr.xpath("./td[3]//a/@href") else "-"
                if not self.redis_pool.sismember("hasLawsuitSign", "haslawsuit:" + url):
                    #日期
                    table_dict["lawsuit_time"] = tr.xpath("./td[2]//text()").extract_first() if tr.xpath("./td[2]//text()") else "-"
                    #裁判文书名称
                    table_dict['lawsuit_name'] = tr.xpath("./td[3]//text()").extract_first() if tr.xpath("./td[3]//text()") else "-"
                    #案由
                    table_dict['lawsuit_cause'] = tr.xpath("./td[4]//text()").extract_first() if tr.xpath("./td[4]//text()") else "-"
                    #案件身份
                    table_dict['lawsuit_identity'] = ''.join(tr.xpath("./td[5]//text()").extract()) if tr.xpath("./td[5]//text()") else "-"
                    #案号
                    table_dict['lawsuit_No'] = tr.xpath("./td[6]//text()").extract_first () if tr.xpath("./td[6]//text()") else "-"
                    yield scrapy.Request(url,callback=self.parse_content,meta={"table_dict":table_dict,'meta':meta})

            next_ul = response.css("ul.pagination")
            next_num = ""
            if next_ul:
                if next_ul.css("li a.-next"):
                    next_num = next_ul.css("li a.-next::attr(onclick)").extract_first().split("(")[1].split(",")[0]
                elif next_ul.css("li a.-current"):
                    next_num = next_ul.css("li a.-current::text").extract_first()
                url = "https://www.tianyancha.com/pagination/lawsuit.xhtml?ps=30&pn=%s&id=%s&name=%s"%(next_num,meta['id'],meta['name'])
                yield scrapy.Request(url,callback=self.parse,meta=meta)
        else:
            item["info"] = "-"
            item["id"] = meta['id']
            item["name"] = meta['name']
            item["url"] = response.url
            yield item

    def parse_content(self,response):
        item = ProwebLawsuitItem()
        data = response.meta['table_dict']
        data['lawsuit_content'] = ''.join(response.xpath("//div[contains(@class,'lawsuitcontentnew')]/*").extract()).replace("\r","")
        item['id'] = response.meta['meta']['id']
        item['name'] = response.meta['meta']['name']
        item["url"] = response.url
        item["info"] = data
        # print(item)
        yield item


