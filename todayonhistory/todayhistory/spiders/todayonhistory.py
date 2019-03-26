# -*- coding: utf-8 -*-
import scrapy
import re
import redis
from w3lib.html import remove_tags
from scrapy.conf import settings
from todayhistory.items import TodayhistoryItem
class TodayonhistorySpider(scrapy.Spider):
    name = 'todayonhistory'
    allowed_domains = ['todayonhistory.com']
    # start_urls = ['http://todayonhistory.com/']

    def start_requests(self):
        date = {
            "1": "31", "2": "29", "3": "31", "4": "30", "5": "31", "6": "30",
            "7": "31", "8": "31", "9": "30", "10": "31",
            "11": "30", "12": "31"
        }
        # for key, val in date.items():
        #     for day in range(1, int(val) + 1):
        #         url = "http://www.todayonhistory.com/%s/%s" % (key, day)
        #         yield scrapy.Request(url,callback=self.parse,dont_filter=True,meta={'month':key,'day':day})
                # break
            # break
        url = "http://www.todayonhistory.com/%s/%s" % (2, 29)
        yield scrapy.Request(url, callback=self.parse, dont_filter=True, meta={'month': '2', 'day': '29'})

    def parse(self, response):
        redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        li_xpaths = response.css("ul#container li[class*='typeid']")
        for item in li_xpaths:
            month = response.meta['month']
            day = response.meta['day']
            year = item.css("p.time span.poh b::text").extract_first()
            url = ""
            #获取详情路径
            if 'class="pic"' in ''.join(item.extract()):
                url = item.css("div.pic a::attr(href)").extract_first()
            elif 'class="text pr"'in ''.join(item.extract()):
                url = item.css("div.text a::attr(href)").extract_first()
            if not redis_pool.sismember("todayhistory",url):
                yield scrapy.Request(url,callback=self.parse_content,dont_filter=True,meta={'year':year,'month':month,"day":day})
    def parse_content(self,response):
        #声明数据容器
        item = TodayhistoryItem()
        #获取数据
        info_dict = {}
        month = response.meta['month']
        res_html = ''.join(response.xpath("//div[@class='content']/div[@class='body']/*").extract()).replace("\t","")
        if "img" in res_html:
            txt = res_html.replace("\r","").replace("\n","").replace('<div class="poh tc mgg" id="51"></div>',"")
            pattern = re.compile(r'<div class="page">.*</div>')
            result = re.sub(pattern," ",txt)
        else:
            html_txt = ''.join(response.xpath("//div[@class='content']/div[@class='body']//text()").extract()).replace("\t","")
            txt = html_txt.replace("\r","").replace("\n","").replace('<div class="poh tc mgg" id="51"></div>',"")
            pattern = re.compile(r'关键词: .*')
            result = re.sub(pattern, " ", txt)
        info_dict['year'] = response.meta['year']
        info_dict['day'] = response.meta['day']
        info_dict['title'] = ''.join(response.css("div.content h1::text").extract()).replace(" ","")
        info_dict['content'] = result
        #拼装数据
        item['url'] = response.url
        item['month'] = month
        item['infos'] = str(info_dict)
        # print(item)
        yield item

