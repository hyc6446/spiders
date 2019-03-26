# -*- coding: utf-8 -*-
import scrapy
import re
import json
import redis
from scrapy.conf import settings
from urllib import parse
from todayhistory.items import TodayhistoryItem
class TodayhistoryJsonSpider(scrapy.Spider):
    name = 'todayhistory_json'
    allowed_domains = ['todayonhistory.com']
    # start_urls = ['http://todayonhistory.com/']

    def start_requests(self):
        date = {
            "1": "31", "2": "29", "3": "31", "4": "30", "5": "31", "6": "30",
            "7": "31", "8": "31", "9": "30", "10": "31",
            "11": "30", "12": "31"
        }
        for key, val in date.items():
            for day in range(1, int(val) + 1):
                url = "http://www.todayonhistory.com/index.php?m=content&c=index&a=json_event&page=1&pagesize=40&month=%s&day=%s"%(key,day)
                yield scrapy.Request(url,callback=self.parse,dont_filter=True,meta={'month': key, 'day': day})
                # break
            # break
    def parse(self, response):
        redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        if response.text !="0" :
            json_data = json.loads(response.text)
            month = response.meta['month']
            day = response.meta['day']
            for data in json_data:
                title = data['title']
                url = data['url']
                year = data['solaryear']
                if not redis_pool.sismember("todayhistory",url):
                    yield scrapy.Request(url,callback=self.parse_content,dont_filter=True,meta={'year':year,'month':month,"day":day,'title':title})
                # break
            if len(json_data) == 40:
                href = response.url.split("?")[1]
                res = dict(parse.parse_qsl(href))
                res['page'] = int(res['page']) + 1
                month=res['month']
                day=res['day']
                nexturl =  "http://www.todayonhistory.com/index.php?"+parse.urlencode(res)
                yield scrapy.Request(nexturl,callback=self.parse,meta={'month': month, 'day': day})

    def parse_content(self,response):
        #声明数据容器
        item = TodayhistoryItem()
        #获取数据
        info_dict = {}
        res_html = ''.join(response.xpath("//div[@class='content']/div[@class='body']/*").extract()).replace("\t","")
        if "img" in res_html:
            txt = res_html.replace("\r","").replace("\n","").replace('<div class="poh tc mgg" id="51"></div>',"")
            pattern = re.compile(r'<div class="page">.*</div>')
            pattern1 = re.compile(r'<script>.*?</script>')
            result = re.sub(pattern," ",txt)
            result = re.sub(pattern1," ",result)
        else:
            html_txt = ''.join(response.xpath("//div[@class='content']/div[@class='body']//text()").extract()).replace("\t","")
            txt = html_txt.replace("\r","").replace("\n","").replace('<div class="poh tc mgg" id="51"></div>',"")
            pattern = re.compile(r'关键词: .*')
            pattern1 = re.compile(r'<script>.*?</script>')
            result = re.sub(pattern, " ", txt)
            result = re.sub(pattern1, " ", result)
        #拼装数据
        item['url'] = response.url
        item['month'] = response.meta['month']
        item['year'] = response.meta['year']
        item['day'] = response.meta['day']
        item['title'] = response.meta['title']
        item['content'] = result
        # print(item)
        yield item





