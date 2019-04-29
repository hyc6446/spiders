# -*- coding: utf-8 -*-
import scrapy
import json
import redis
import urllib.parse
from w3lib.html import remove_tags
from urllib.parse import quote_plus,unquote
from scrapy.conf import settings
from qiyemulu.items import QiyemuluItem

class BaseinfoSpider(scrapy.Spider):
    name = 'report'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://api2.tianyancha.com']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        # while True:
        allkeys = self.redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
        for key in allkeys:
            id=key[0]
            val = key[1].replace("'",'"')
            datajson = json.loads(val,encoding='utf-8')
            if datajson.get("reportCount",""):
                url = "https://api2.tianyancha.com/services/v3/expanse/annu?pageNum=1&id=%s&pageSize=100"%id
                yield scrapy.Request(url,callback=self.parse,dont_filter=True,meta={'id':id})


    def parse(self,response):
        # print(response.text)
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                yearCount = len(alldata)
                infoList = []
                for item in alldata:
                    url = "https://api2.tianyancha.com/services/v3/ar/anre/%s"%item['id']
                    yield scrapy.Request(url,callback=self.parse_content,meta={'id':response.meta['id'],'infoList':infoList,'yearCount':yearCount})
                    # break
        except Exception as e:
            print(e.args)

    def parse_content(self,response):
        # print(response.text)
        item = QiyemuluItem()
        try:
            htmldata = json.loads(response.text)
            data = htmldata.get("data","")
            if data:
                infoList = response.meta['infoList']
                infoList.append(data)
                if len(infoList)==int(response.meta['yearCount']):
                    item['companyId'] = response.meta['id']
                    item['allInfo'] = str(infoList)
                    yield item
        except Exception as e:
            print(e.args)




