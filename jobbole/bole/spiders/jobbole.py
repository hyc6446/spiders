# -*- coding: utf-8 -*-
import scrapy

from scrapy_redis.spiders import RedisSpider

from bole.items import JobboleItem


class JobboleSpider(RedisSpider):
    name = 'jobbole'
    allowed_domains = ['jobbole.com']
    #start_urls = ['http://python.jobbole.com/all-posts/']
    redis_key = 'bole:rediskey'


    def parse(self, response):
        href = response.xpath('//a[@class="archive-title"]/@href').extract()
        for url in href:
            yield scrapy.Request(url,callback=self.parse_detail)

        next_url = response.xpath('//a[@class="next page-numbers"]/@href').extract_first()
        yield scrapy.Request(next_url,callback=self.parse)

    def parse_detail(self,response):
        item =JobboleItem()
        title =response.xpath('//div[@class="entry-header"]/h1/text()').extract_first()

        item['title'] = title
        print(title)
        yield  item