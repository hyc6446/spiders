# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/spider-middleware.html
import json ##处理json的包
import random #随机选择
import requests
import logging
import redis
import time
from .useragent import agents #导入前面的
from .proxys import GetProxy #导入前面的
from scrapy import signals

#获取随机cookies类
class CookiesMiddleware(object):
    def __init__(self,get_cookies_url):
        self.logger = logging.getLogger(__name__)
        self.get_cookies_url = get_cookies_url
    def get_cookies(self):
        try:
            response = requests.get(self.get_cookies_url)
            if response.status_code == 200:
                cookies = response.text
                return cookies
        except requests.ConnectionError:
            return False
    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(
            get_cookies_url = settings.get('GET_COOKIES_URL')
        )
    def process_request(self, request, spider):
        cookies = self.get_cookies()
        useragent = random.choice(agents)
        request.headers['User-Agent'] = useragent
        if cookies:
            request.headers['Cookie'] = cookies
            # request.meta['proxy'] = GetProxy().getproxy()%request.meta['proxy']
            self.logger.debug("IP:,更换cookies!")
        return None


    # def process_response(self, request, response, spider):
    #     if response.status != 200:
    #         self.lock.acquire()
    #         self.status = True
    #         self.lock.release()
    #         return request
    #     return response


class ProwebSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.
    # @classmethod
    def __init__(self,redis_host,redis_port,redis_password,redis_db):
        self.redis_host = redis_host
        self.redis_port = redis_port
        self.redis_password = redis_password
        self.redis_db = redis_db

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        settings = crawler.settings
        s = cls(
            redis_host = settings.get("REDIS_HOST",'127.0.0.1'),
            redis_port = settings.get("REDIS_PORT",6379),
            redis_password = settings.get("REDIS_PASSWORD",''),
            redis_db = settings.get("REDIS_DB",1),
        )
        # crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Response, dict
        # or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        # self.redis_pool = redis.StrictRedis(host=self.redis_host, port=self.redis_port, password=self.redis_password,db=self.redis_db, decode_responses=True)
        # if self.redis_pool.hlen("company_info"):
        #     for id in self.redis_pool.hkeys("company_info"):
        #         start_requests = "https://api2.tianyancha.com/services/v3/expanse/allCountV3?id=%s" % id
        #         print(start_requests)
        # # for r in start_requests:
        #         yield start_requests
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)

class ProwebDownloaderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):

        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)
