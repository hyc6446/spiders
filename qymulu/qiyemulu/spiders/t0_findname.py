# -*- coding: utf-8 -*-
import scrapy
import json
import redis
from w3lib.html import remove_tags
from urllib.parse import quote_plus,unquote
from scrapy.conf import settings
from qiyemulu.items import QiyemuluItem

# cursor = random.randint(0,999999)
# cursor = 0
class FindnameSpider(scrapy.Spider):
    name = 'findname'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://tianyancha.com/']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = self.redis_pool.sscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for key in allkeys:
                url="https://api2.tianyancha.com/services/v3/search/sNorV2/%s?sortType=0&pageSize=100&pageNum=1"%quote_plus(key)
                yield scrapy.Request(url,callback=self.parse,meta={'name':key},dont_filter=True)
                break
            break
    def parse(self, response):

        item = QiyemuluItem()
        if response.status == 200:
            json_data = json.loads(response.text)
            state = json_data.get("state",'')
            try:
                if state == "ok":
                    data = json_data.get('data','')
                    if data:
                        for info in data[:-1]:
                            item['cname'] = response.meta['name']
                            item['companyId'] = info.get('id',"")
                            item['companyName'] = remove_tags(info.get('name',""))
                            item['alias'] = info.get('alias',"")
                            item['legalPersonName'] = info.get('legalPersonName',"")
                            item['phoneList'] = info.get('phone',"")
                            item['emailList'] = info.get('emails',"")
                            item['websiteList'] = info.get('websites',"")
                            item['estiblishTime'] = info.get('estiblishTime',"")
                            item['regCapital'] = info.get('regCapital',"")
                            item['creditCode'] = info.get('creditCode',"")
                            item['taxNumber'] = info.get('creditCode',"")
                            item['orgNumber'] = info.get('creditCode',"")[9:18]
                            item['regStatus'] = info.get('regStatus',"")
                            item['companyOrgType'] = info.get('companyOrgType',"")
                            item['industry'] = info.get('categoryStr',"")
                            item['regLocation'] = info.get('regLocation',"")
                            item['logo'] = info.get('logo',"")
                            item['businessScope'] = info.get('businessScope',"")
                            item['base'] = info.get('base',"")
                            item['district'] = info.get('district',"")
                            item['historyNames'] = info.get('historyNames',"")
                            #后期补充数据
                            item['intro'] = info.get('intro',"")
                            item['regNumber'] = info.get('regNumber',"")
                            item['actualCapital'] = info.get('actualCapital',"")
                            item['taxQualification'] = info.get('taxQualification',"")
                            item['englishName'] = info.get('property3',"")
                            item['staffNumRange'] = info.get('staffNumRange',"")
                            item['socialStaffNum'] = info.get('socialStaffNum',"")
                            item['operatingPeriod'] = info.get('operatingPeriod',"")
                            item['approvedTime'] = info.get('approvedTime',"")
                            item['regInstitute'] = info.get('regInstitute',"")
                            item['updatetime'] = info.get('updatetime',"")
                            yield item
                            # break
                else:
                    # self.redis_pool.srem("names:key",response.mata['name'])
                    print(response.mata['name'],"没有数据")
            except Exception as e:
                print(e.args)



