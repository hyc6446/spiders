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
    name = 'change'
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
            '''变更信息'''
            if datajson.get("changeCount",""):

                url="https://api2.tianyancha.com/services/v3/expanse/changeinfoEm3?pageNum=1&id=%s&pageSize=100"%id
                yield scrapy.Request(url,callback=self.parse,dont_filter=True,meta={'id':id})


    def parse(self,response):
        # print(response.text)
        item = QiyemuluItem()
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                result = alldata.get("result", "")
                if result:
                    infoList = []
                    for info in result:
                        infoDict = {}
                        infoDict['changeItem'] = info.get("changeItem", '')
                        infoDict['changeTime'] = info.get("changeTime", '')
                        infoDict['createTime'] = info.get("createTime", '')
                        infoDict['contentBefore'] = remove_tags(info.get("contentBefore", ''))
                        infoDict['contentAfter'] = remove_tags(info.get("contentAfter", ''))
                        infoList.append(infoDict)
                    item['companyId'] = response.meta['id']
                    item["allInfo"] = str(infoList)
                    yield item
                    # print(infoList)
        except Exception as e:
            print(e.args)



