# -*- coding: utf-8 -*-
import scrapy
import json
import redis
import urllib.parse
from w3lib.html import remove_tags
from urllib.parse import quote_plus,unquote
from scrapy.conf import settings

class BaseinfoSpider(scrapy.Spider):
    name = 'allcount'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://api2.tianyancha.com']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        # while True:
        allkeys = self.redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
        for key in allkeys:
            id=key[0]
            name=key[1]
            url = "https://api2.tianyancha.com/services/v3/expanse/allCountV3?id=%s"%id
            yield scrapy.Request(url,callback=self.parse,dont_filter=True,meta={'id':id,"name":name})
        #         if not self.redis_pool.sismember("hasbaseinfo",key):
                    # url = "https://api2.tianyancha.com/services/v3/t/details/appComIcV2/%s?pageSize=1000"%2349015448
                    # url = "https://api2.tianyancha.com/services/v3/t/common/baseinfoV4/%s"%2349015448
                # break
            # break
        # url = "https://api2.tianyancha.com/services/v3/t/common/baseinfoV5/2320507625"



    def parse(self,response):
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                alldata['name'] = response.meta['name']
                self.redis_pool.hset("allcount",response.meta['id'],alldata)
                print(response.meta['id'],"执行完成")
        except Exception as e:
            print(e.args)



