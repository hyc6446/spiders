# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/spider-middleware.html
import logging
import random #随机选择
import redis
# import requests
from .useragent import useragent
from scrapy import signals
from twisted.internet.defer import DeferredLock

#获取随机cookies类
# class CookiesMiddleware(object):
#     def __init__(self,get_cookies_url):
#         self.logger = logging.getLogger(__name__)
#         self.get_cookies_url = get_cookies_url
#     def get_cookies(self):
#         try:
#             # response = requests.get(self.get_cookies_url)
#             if response.status_code == 200:
#                 cookies = response.text
#                 return cookies
#         except requests.ConnectionError:
#             return False
#
#     @classmethod
#     def from_crawler(cls, crawler):
#         settings = crawler.settings
#         return cls(
#             get_cookies_url = settings.get('GET_COOKIES_URL')
#         )
#     def process_request(self, request, spider):
#         cookies = self.get_cookies()
#         request.headers['User-Agent'] = random.choice(useragent)
#         if cookies:
#             self.logger.debug("更换cookies...")
#             request.headers['Cookie'] = cookies
#             # print(1111,request.headers)
#         return None

#获取Authorization类
class AuthorizationMiddleware(object):
    def __init__(self,REDIS_HOST,REDIS_PORT,REDIS_PASSWORD,REDIS_DB):
        self.logger = logging.getLogger(__name__)
        self.REDIS_HOST = REDIS_HOST
        self.REDIS_PORT = REDIS_PORT
        self.REDIS_PASSWORD = REDIS_PASSWORD
        self.REDIS_DB = REDIS_DB
        self.redis_pool = redis.StrictRedis(host=self.REDIS_HOST, port=self.REDIS_PORT, password=self.REDIS_PASSWORD,db=self.REDIS_DB, decode_responses=True)
    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(
            REDIS_HOST = settings.get("REDIS_HOST",'10.10.17.141'),
            REDIS_PORT = settings.get("REDIS_PORT",6379),
            REDIS_PASSWORD = settings.get("REDIS_PASSWORD",''),
            REDIS_DB = settings.get("REDIS_DB",2),
        )
    def process_request(self, request, spider):
        Authorization = self.redis_pool.hget("Authorization","Authorization")
        if Authorization:
            self.logger.debug("更换授权码...")
            request.headers['Content-Type'] = "application/json",
            request.headers['version'] = "Android 8.5.1",
            request.headers['deviceID'] = "865773029228405",
            request.headers['channelID'] = "YingYongBaoCPD",
            request.headers['User-Agent'] = "com.tianyancha.skyeye/Dalvik/1.6.0 (Linux; U; Android 4.4.4; N918St Build/KTU84P; appDevice/ZTE_QAQ_N918St)",
            request.headers['Authorization'] = Authorization
        # request.meta['proxy'] = proxytxt()
        # print(request.headers)

        return None
    def process_response(self, request, response, spider):
        return response

class QiyemuluSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
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
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)

class QiyemuluDownloaderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.
    def __init__(self):
        self.status = False
        self.proxy = None
        self.lock =DeferredLock()
    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):

        return None

    def process_response(self, request, response, spider):

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
