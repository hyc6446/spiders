# -*- coding: utf-8 -*-
import scrapy
import re
from scrapy_redis.spiders import RedisSpider
from scrapyRedis.items import ScrapyredisItem

class JiaSpider(RedisSpider):
    name = 'jia'
    allowed_domains = ['jia12.com']
    # start_urls = ['http://www.jia12.com/XingmingKu']
    redis_key = "jia:strat_urls"

    def parse(self, response):
        # redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'],password=settings['REDIS_PASSWORD'], db=settings['REDIS_DB'], decode_responses=True)
        item = ScrapyredisItem()
        res_text = response.css("div.pd").extract_first()
        pattern = r'<span class="ph">更多：</span>(.*?)</div>'
        result = re.search(pattern,res_text,re.S)
        href_text = result.group(1)
        pattern1 = r'<a href="(.*?)"><span.*?</a>'
        firstNames = re.findall(pattern1,href_text,re.S)
        for name in firstNames:
            for i in range(1,51):
                url = "http://www.jia12.com/XingmingKu/%s-%s.html"%(name.split("-")[0],i)
                item['url'] = url
                yield item

