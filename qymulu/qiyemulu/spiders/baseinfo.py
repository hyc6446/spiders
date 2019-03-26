# -*- coding: utf-8 -*-
import scrapy
import json
import redis
import urllib.parse
from w3lib.html import remove_tags
from urllib.parse import quote_plus,unquote
from scrapy.conf import settings
from qiyemulu.items import QiyemuluItem
from copy import deepcopy

class BaseinfoSpider(scrapy.Spider):
    name = 'baseinfo'
    allowed_domains = ['tianyancha.com']
    # start_urls = ['http://api2.tianyancha.com']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        while True:
            allkeys = self.redis_pool.sscan_iter(settings['NAME'],settings['PATTERN'],settings['COUNT'])
            for key in allkeys:
                if not self.redis_pool.sismember("hasbaseinfo",key):
                    # url = "https://api2.tianyancha.com/services/v3/t/details/appComIcV2/%s?pageSize=1000"%2349015448
                    # url = "https://api2.tianyancha.com/services/v3/t/common/baseinfoV4/%s"%2349015448
                    url = "https://api2.tianyancha.com/services/v3/t/common/baseinfoV5/%s"%key
                    yield scrapy.Request(url,callback=self.parse,dont_filter=True)
                # break
            # break


    def parse(self,response):
        # print(response.text)
        try:
            dataJson= json.loads(response.text)
            alldata = dataJson.get("data","")
            if alldata:
                item = QiyemuluItem()
                #公司Id
                item['companyId'] =  alldata.get("id","")#response.meta['id']
                #公司名称
                item['companyName'] =  alldata.get("name","")#response.meta['name']
                #别名
                item['alias'] = alldata.get("alias","")
                #曾用名
                item['historyNames'] = alldata.get("historyNames","")
                #法定代表人
                item['legalPersonName'] = alldata.get("legalPersonName","")
                #联系方式列表
                item['phoneList'] = ""
                #邮箱列表
                item['emailList'] = ""
                #网址
                item['websiteList'] = str(alldata.get("websiteList",""))
                #成立日期
                item['estiblishTime'] = alldata.get("estiblishTime","")
                #工商注册号
                item['regNumber'] = alldata.get("regNumber","")
                #注册资本
                item['regCapital'] = alldata.get("regCapital","")
                #实缴资本
                item['actualCapital'] = alldata.get("actualCapital","")
                #统一信用代码
                item['creditCode'] = alldata.get("creditCode","")
                #纳税人识别号
                item['taxNumber'] = alldata.get("taxNumber","")
                #组织机构代码
                item['orgNumber'] = alldata.get("orgNumber","")
                #纳税人资质
                item['taxQualification'] = alldata.get("taxQualification","")
                #英文名称
                item['englishName'] = alldata.get("property3","")
                #经营状态
                item['regStatus'] = alldata.get("regStatus","")
                #人员规模
                item['staffNumRange'] = alldata.get("staffNumRange","")
                #参保人数
                item['socialStaffNum'] = alldata.get("socialStaffNum","")
                #公司类型
                item['companyOrgType'] = alldata.get("companyOrgType","")
                #行业
                item['industry'] = alldata.get("industry","")
                #营业期限
                fromTime = alldata.get("fromTime","")
                toTime = alldata.get("toTime","")
                item['operatingPeriod'] = "%s/%s"%(fromTime,toTime)
                #注册地址
                item['regLocation'] = alldata.get("regLocation","")
                #核准日期
                item['approvedTime'] = alldata.get("approvedTime","")
                #登记机关
                item['regInstitute'] = alldata.get("regInstitute","")
                #公司logo地址
                item['logo'] = alldata.get("logo","")
                #股权结构图
                # item['equityUrl'] = baseInfo.get("equityUrl","")
                #最新更新时间
                item['updatetime'] = alldata.get("updatetime","")
                #经营范围
                item['businessScope'] = alldata.get("businessScope","")
                #简介
                item['intro'] = alldata.get("baseInfo","")
                #所属地区简称
                item['base'] = alldata.get("base","")
                #所述区域简称
                item['district'] = ""
                yield item
                # print(item)
        except Exception as e:
            print(e.args)



