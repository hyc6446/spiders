# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class QiyemuluItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    # pass
    #搜索人员名称
    cname = scrapy.Field()
    #公司ID
    companyId = scrapy.Field()
    #公司名称
    companyName = scrapy.Field()
    #公司别名
    alias = scrapy.Field()
    #曾用名
    historyNames = scrapy.Field()
    #公司法人
    legalPersonName = scrapy.Field()
    #联系方式
    phoneList = scrapy.Field()
    #公司邮箱
    emailList = scrapy.Field()
    #公司网站
    websiteList = scrapy.Field()
    #成立日期
    estiblishTime = scrapy.Field()
    #工商注册号
    regNumber = scrapy.Field()
    #注册资本
    regCapital = scrapy.Field()
    #实缴资本
    actualCapital = scrapy.Field()
    #统一信用代码
    creditCode = scrapy.Field()
    #纳税人识别号
    taxNumber = scrapy.Field()
    #组织机构代码
    orgNumber = scrapy.Field()
    #纳税人资质
    taxQualification = scrapy.Field()
    #英文名称
    englishName = scrapy.Field()
    #经营状态
    regStatus = scrapy.Field()
    #人员规模
    staffNumRange = scrapy.Field()
    #参保人数
    socialStaffNum = scrapy.Field()
    #公司类型
    companyOrgType = scrapy.Field()
    #行业
    industry = scrapy.Field()
    #营业期限
    operatingPeriod = scrapy.Field()
    #注册地址
    regLocation = scrapy.Field()
    #核准日期
    approvedTime = scrapy.Field()
    #登记机关
    regInstitute = scrapy.Field()
    #公司logo地址
    logo = scrapy.Field()
    #最新更新时间
    updatetime = scrapy.Field()
    #经营范围
    businessScope = scrapy.Field()
    #简介
    intro = scrapy.Field()
    #所属地区简称
    base = scrapy.Field()
    #所属区域简称
    district = scrapy.Field()

