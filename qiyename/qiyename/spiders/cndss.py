# -*- coding: utf-8 -*-
import scrapy
import redis
import json
from scrapy_redis.spiders import RedisSpider
from w3lib.html import remove_tags
from scrapy.conf import settings
from urllib.parse import quote_plus,unquote,quote
from qiyename.items import QiyenameItem

class CndssSpider(scrapy.Spider):
    name = 'cndss'
    allowed_domains = ['jia12.com']
    start_urls = ['http://www.jia12.com/XingmingKu/?%C0%EE-1.html']

    def parse(self, response):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'],password=settings['REDIS_PASSWORD'], db=settings['REDIS_DB'],decode_responses=True)
        res_text = response.xpath("//div[@class='pd']//a[position()>50]/@href").extract()
        for num in range(1,len(res_text)):
            for i in range(1,51):
                url = "http://www.jia12.com/XingmingKu/?%s-%s.html"%(quote(res_text[num].split("-")[0][1:]),i)
                if not self.redis_pool.sismember("hasurl",url):
                    yield scrapy.Request(url,callback=self.parse_content,meta={'num':num})
                break
            break

    def parse_content(self,response):
        allnames = response.css("table#xingmingkuTableID a::text").extract()
        for name in allnames:
            num = response.meta['num']
            if not self.redis_pool.sismember("personnames:"+str(num),name):
                self.redis_pool.sadd("personnames:"+str(num), name)
                self.redis_pool.sadd("hasurl",response.url)
                print(num,name,"执行成功")
            else:
                print("去去去")
                # url = "https://api2.tianyancha.com/services/v3/search/sNorV2/%s?pageSize=100&pageNum=1&sortType=0"%quote(name)
                # yield scrapy.Request(url,callback=self.companyList,meta={'cname':name})
                # break
