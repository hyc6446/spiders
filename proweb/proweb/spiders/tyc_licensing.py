# -*- coding: utf-8 -*-
import scrapy
import re
import json
import redis
from urllib.parse import quote_plus,unquote
from scrapy.utils.project import get_project_settings
from proweb.items import ProwebLicensingItem
settings = get_project_settings()

class TycLicensingSpider(scrapy.Spider):
    '''
        行政许可(工商局)
    '''
    name = 'tyc_licensing'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://tianyancha.com/']

    def start_requests(self):
        redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for item in allkeys:
                key = item[0]
                val = json.loads(item[1].replace("'",'"'))
                if not redis_pool.sismember("hasLicenseSign","haslicense:"+key):
                    url = "https://www.tianyancha.com/pagination/licensing.xhtml?ps=30&pn=1&id=%s&name=%s"%(key,quote_plus(val['name']))
                    yield scrapy.Request(url,callback=self.parse,meta={'id':key,'name':quote_plus(val['name'])})
                else:
                    print("数据已存在")
            break
        else:
            print("没有数据")


    def parse(self, response):
        item = ProwebLicensingItem()
        info_list = []
        sign = None
        meta = response.meta
        table_trs = response.css("table.table>tbody>tr")
        if table_trs:
            for tr in table_trs:
                table_dict = {}#
                #许可书文编号
                table_dict["permission_No"] = tr.xpath("./td[2]//text()").extract_first() if tr.xpath("./td[2]//text()") else "-"
                #许可文件名称
                table_dict['permission_name'] = tr.xpath("./td[3]//text()").extract_first() if tr.xpath("./td[3]//text()") else "-"
                #有效期自
                table_dict['start_date'] = tr.xpath("./td[4]//text()").extract_first() if tr.xpath("./td[4]//text()") else "-"
                #有效期至
                table_dict['expiry_date'] = tr.xpath("./td[5]//text()").extract_first() if tr.xpath("./td[5]//text()") else "-"
                #许可机关
                table_dict['permission_office'] = tr.xpath("./td[6]//text()").extract_first() if tr.xpath("./td[6]//text()") else "-"
                #许可内容
                table_dict['permission_content'] = tr.xpath("./td[7]//text()").extract_first() if tr.xpath("./td[7]//text()") else "-"
                info_list.append(table_dict)
            item["info"] = info_list

            next_ul = response.css("ul.pagination")
            next_num = ""
            if next_ul:
                if next_ul.css("li a.-next"):
                    next_num = next_ul.css("li a.-next::attr(onclick)").extract_first().split("(")[1].split(",")[0]
                    sign = False
                elif next_ul.css("li a.-current"):
                    next_num = next_ul.css("li a.-current::text").extract_first()
                    sign = True
                url = "https://www.tianyancha.com/pagination/licensing.xhtml?ps=30&pn=%s&id=%s&name=%s"%(next_num,meta['id'],meta['name'])
                yield scrapy.Request(url,callback=self.parse,meta=meta)
            else:
                sign = True
        else:
            item["info"] = "-"
            sign = True
        item["id"] = meta['id']
        item["name"] = meta['name']
        item["sign"] = sign
        # print(item)
        yield item

