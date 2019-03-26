# -*- coding: utf-8 -*-
import scrapy
import re
import json
import redis
from urllib.parse import quote_plus,unquote
from scrapy.utils.project import get_project_settings
from proweb.items import ProwebInvestItem
settings = get_project_settings()


class InvestSpider(scrapy.Spider):
    '''
        对外投资
    '''
    name = 'tyc_invest'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://tianyancha.com/']

    def start_requests(self):
        redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = redis_pool.hscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for item in allkeys:
                key = item[0]
                val = json.loads(item[1].replace("'",'"'))
                if not redis_pool.sismember("hasInvestSign","hasinvest:"+key):
                    url = "https://www.tianyancha.com/pagination/invest.xhtml?ps=30&pn=1&id=%s&name=%s"%(key,quote_plus(val['name']))
                    yield scrapy.Request(url,callback=self.parse,meta={'id':key,'name':quote_plus(val['name'])})
                else:
                    print("数据已存在")
            break
        else:
            print("没有数据")

    def parse(self, response):
        item = ProwebInvestItem()
        info_list = []
        sign = None
        meta = response.meta
        table_trs = response.css("table.table>tbody>tr")
        if table_trs:
            for tr in table_trs:
                table_dict = {}
                #被投资公司名称
                table_dict["invested_name"] = tr.xpath("./td[2]//text()").extract_first() if tr.xpath("./td[2]//text()") else "-"
                #被投资法定代表人
                table_dict['invested_representative'] = tr.xpath("./td[3]//a[@class='link-click']/text()").extract_first() if tr.xpath("./td[3]//a[@class='link-click']/text()") else "-"
                #注册资本
                table_dict['register_capital'] = "".join(tr.xpath("./td[4]//text()").extract()) if tr.xpath("./td[4]//text()") else "-"
                #投资占比
                table_dict['invest_ratio'] = "".join(tr.xpath("./td[5]//text()").extract()) if tr.xpath("./td[5]//text()") else "-"
                #注册时间
                table_dict['register_time'] = "".join(tr.xpath("./td[6]//text()").extract()) if tr.xpath("./td[6]//text()") else "-"
                #当前状态
                table_dict['current_status'] = "".join(tr.xpath("./td[7]//text()").extract()) if tr.xpath("./td[7]//text()") else "-"
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
                url = "https://www.tianyancha.com/pagination/invest.xhtml?ps=30&pn=%s&id=%s&name=%s"%(next_num,meta['id'],meta['name'])
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

