# -*- coding: utf-8 -*-
import scrapy
import re
import json
import redis
from urllib.parse import quote_plus,unquote
from scrapy.utils.project import get_project_settings
from proweb.items import ProwebReportItem
settings = get_project_settings()

class TycReportinfoSpider(scrapy.Spider):
    '''
        公司年报
    '''
    name = 'tyc_reportinfo'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://yianyancha.com/']

    def start_requests(self):
        redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for item in allkeys:
                key = item[0]
                val = json.loads(item[1].replace("'",'"'))
                if not redis_pool.sismember("hasReportSign","hasreport:"+key):
                    if val['gsnb'] != "-":
                        for i in range(len(val['gsnb'].split(","))):
                            url = val['gsnb'].split(",")[i]
                            sign = None
                            if i + 1 == len(val['gsnb'].split(",")):
                                sign = True
                            else:
                                sign = False
                            yield scrapy.Request(url, callback=self.parse,meta={'id': key, 'name': quote_plus(val['name']), 'sign': sign})
                    else:
                        url = "https://www.tianyancha.com/reportContent/%s/2017" % (key)
                        yield scrapy.Request(url, callback=self.parse,meta={'id': key, 'name': quote_plus(val['name']), 'sign': True})
                else:
                    print("数据已存在")
            break
        else:
            print("没有数据")

    def parse(self, response):
        item = ProwebReportItem()
        info_list = []
        report_dict = {}
        meta = response.meta
        if "年度报告" in response.text:
            info_list = []
            div_block = response.css("div.block-data")
            for block in div_block:
                info_dict = {}
                info_dict['title'] =block.css("div.data-header::text").extract_first()
                tableinfo = ''.join(block.css("div.data-content table tr").extract())
                pattern = r'(<div class="data-describe">.*?)</td>'
                tableinfo = re.sub(pattern,'</td>',tableinfo)
                tableinfo = re.sub(r'<!--(.*?)-->','',tableinfo)
                info_dict['infos'] = "".join(tableinfo)
                info_list.append(info_dict)
            report_dict['year'] = response.url.split("/")[-1]
            report_dict['info'] = info_list
            item["info"] = report_dict
        elif "年度报告" not in response.text:
            item["info"] = "-"
        item["id"] = meta['id']
        item["name"] = meta['name']
        item["sign"] = response.meta['sign']
        yield item


