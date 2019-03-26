# -*- coding: utf-8 -*-
import scrapy
import json
import redis
import urllib.parse
from w3lib.html import remove_tags
from urllib.parse import quote_plus,unquote
from scrapy.conf import settings
from qiyemulu.items import QiyemuluItem
from copy import deepcopy

class NianbaoSpider(scrapy.Spider):
    name = 'nianbao'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://api2.tianyancha.com']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = self.redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for item in allkeys:
                # if not self.redis_pool.sismember("hasbaseinfo",item[0]):
                    #所有纬度数据数量
                    url="https://api2.tianyancha.com/services/v3/expanse/allCountV2?id=%s"%(item[0])
                    #基本信息(工商信息、分支机构、企业高管、变更记录)
                    # url = "https://api2.tianyancha.com/services/v3/t/details/appComIcV2/%s?pageSize=1000"%urllib.parse.quote(item[0])
                    #股东信息
                    # url="https://api2.tianyancha.com/services/v3/expanse/holder?pageNum=1&id=%s&pageSize=20"%urllib.parse.quote(item[0])
                    #企业高管
                    # url="https://api2.tianyancha.com/services/v3/expanse/holder?pageNum=1&id=%s&pageSize=20"%urllib.parse.quote(item[0])
                    yield scrapy.Request(url,callback=self.parse,dont_filter=True)
                    break
            break

    def parse(self,response):
        # response = deepcopy(response.text)
        # print(response.text)
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                #年报
                reportCount = alldata.get("reportCount","")
                if reportCount:
                    url="https://api2.tianyancha.com/services/v3/expanse/annu?pageNum=1&id=22236366&pageSize=20"
                    yield scrapy.Request(url,callback=self.parse_report,dont_filter=True)
        except Exception as e:
            print(e.args)

    def parse_report(self,response):
        # print(response.text)
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                #年报
                for year in alldata:
                    url="https://api2.tianyancha.com/services/v3/ar/anre/%s"%year['id']
                    yield scrapy.Request(url,callback=self.parse_content,dont_filter=True,meta={'allresport':""})
                    # break
        except Exception as e:
            print(e.args)


    def parse_content(self,response):
        # print(response.text)
        allresport = response.meta['allresport']
        allresport += response.text

        print(allresport)
