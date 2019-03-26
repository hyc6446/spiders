# -*- coding: utf-8 -*-
import scrapy
import re
import json
import time
import redis
import random
import math
from urllib.parse import quote_plus,unquote
from scrapy.conf import settings

cursor = random.randint(0,100000)
# cursor = 0
class FindidSpider(scrapy.Spider):
    name = 'findid'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://tianyancha.com/']

    def start_requests(self):
        global cursor
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = self.redis_pool.sscan(settings['NAME'],cursor,settings['PATTERN'],settings['COUNT'])
            cursor = allkeys[0]
            # print(cursor)
            for item in allkeys[1]:
                for i in range(1,6):
                    url = "https://www.tianyancha.com/search/p%s?key=%s"%(i,quote_plus(item))
                    yield scrapy.Request(url,callback=self.parse,meta={'name':item},dont_filter=True)
                    # time.sleep(1)
                    # break
                # break
            # break

    def parse(self,response):
        if "天眼查为你找到" in response.text:
            list = response.css("div.content div.header")
            for item in list:
                id = item.css("a.name::attr(href)").extract_first().split("/")[-1]
                name = ''.join(item.css("a.name::text").extract())
                if not self.redis_pool.hexists("companyInfo",id):
                    self.redis_pool.hset("companyInfo",id,name)
                    print(response.meta['name'],name,"执行成功")
                # else:
                #     print(id,name,"存在")
