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
    name = 'lawsuit'
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
            if int(datajson.get("lawsuitCount",""))>0:
                url = "https://api2.tianyancha.com/services/v3/t/lawsuitscr"
                formdata={
                    "pn":1,
                    "keyWords":datajson.get('name',''),
                    "ps":100
                }
                yield scrapy.http.FormRequest(url,callback=self.parse,body=json.dumps(formdata),method='POST',dont_filter=True,meta={'id': id})


    def parse(self,response):
        # print(response.text)
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                result = alldata.get("items", "")
                if result:
                    infoDict = {}
                    for info in result:
                        infoDict['caseno'] = info.get("caseno", '')
                        infoDict['casereason'] = info.get("casereason", '')
                        infoDict['casetype'] = info.get("casetype", '')
                        infoDict['title'] = info.get("title", '')
                        infoDict['court'] = info.get("court", '')
                        infoDict['plaintiffs'] = remove_tags(info.get("plaintiffs", ''))
                        infoDict['defendants'] = remove_tags(info.get("defendants", ''))
                        infoDict['lawsuitUrl'] = info.get("lawsuitUrl", '')
                        infoDict['url'] = info.get("url", '')
                        infoDict['uuid'] = info.get("uuid", '')
                        infoDict['docid'] = info.get("docid", '')
                        infoDict['connList'] = remove_tags(','.join(info.get("connList", '')))
                        infoDict['doctype'] = info.get("doctype", '')
                        infoDict['submittime'] = info.get("submittime", '')

                        yield scrapy.Request(infoDict['lawsuitUrl'],callback=self.content_parse,dont_filter=True,meta={'infoDict':infoDict,'id':response.meta['id']})
                        # break
        except Exception as e:
            print(e.args)
        #
    def content_parse(self,response):
        item = QiyemuluItem()
        infoDict = response.meta['infoDict']
        content = response.css("div.container ::text").extract()
        infoDict['container'] = ''.join(content).replace(" ","")

        item['companyId'] = response.meta['id']
        item['allInfo'] = str(infoDict)
        yield item
