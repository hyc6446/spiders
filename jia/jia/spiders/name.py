# -*- coding: utf-8 -*-
import scrapy
import redis
import json
from scrapy_redis.spiders import RedisSpider
from jia.items import JiaItem
from w3lib.html import remove_tags
from scrapy.conf import settings
from urllib.parse import quote_plus,unquote,quote



class NameSpider(RedisSpider):
    name = 'name'
    redis_key = "names:key"


    def __init__(self, *args, **kwargs):
        # 修改这里的类名为当前类名
        super(NameSpider, self).__init__(*args, **kwargs)
        #connect redis
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'],password=settings['REDIS_PASSWORD'], db=settings['REDIS_DB'],decode_responses=True)

    def make_request_from_data(self,data):
        url = "https://api2.tianyancha.com/services/v3/search/sNorV2/%s?pageSize=100&pageNum=1&sortType=0"%quote(str(data,encoding='utf-8'))
        # return self.make_requests_from_url(url)
        return scrapy.Request(url=url,callback=self.parse,dont_filter=True)


    def parse(self, response):
        item = JiaItem()
        if response.status == 200:
            json_data = json.loads(response.text)
            state = json_data.get("state", '')
            try:
                if state == "ok":
                    data = json_data.get('data', '')
                    if data:
                        for info in data[:-1]:
                            if not self.redis_pool.sismember("hasid", info['id']):
                                item['cid'] = info['id']
                                item['name'] = remove_tags(info['name'])
                                yield item
                else:
                    print(state)
            except Exception as e:
                print(e.args)
        elif response.status == 403:
            print("无法获取数据")


