# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
#基本信息
class ProwebItem(scrapy.Item):
    company_id = scrapy.Field()
    company_name = scrapy.Field()
    phone = scrapy.Field()
    email = scrapy.Field()
    com_status = scrapy.Field()
    history_name = scrapy.Field()
    gswz = scrapy.Field()
    gsdz = scrapy.Field()
    gsjj = scrapy.Field()
    gxsj = scrapy.Field()
    gsfr = scrapy.Field()
    zczb = scrapy.Field()
    zcrq = scrapy.Field()
    gszch = scrapy.Field()
    zzjgdm = scrapy.Field()
    shxydm = scrapy.Field()
    gslx = scrapy.Field()
    nsrsbm = scrapy.Field()
    hangye = scrapy.Field()
    yyqx = scrapy.Field()
    nsrzz = scrapy.Field()
    rygm = scrapy.Field()
    sjzb = scrapy.Field()
    djjg = scrapy.Field()
    cbrs = scrapy.Field()
    ywmc = scrapy.Field()
    jyfw = scrapy.Field()
    nums = scrapy.Field()
    gsnb = scrapy.Field()

#股东信息
class ProwebHolderItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#主要人员
class ProwebStaffItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#对外投资
class ProwebInvestItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#变更记录
class ProwebChangeItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#公司年报
class ProwebReportItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    year = scrapy.Field()
    sign = scrapy.Field()
#分支机构
class ProwebBranchItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#开庭公告
class ProwebAnnouncementItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#法律诉讼
class ProwebLawsuitItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    url = scrapy.Field()
#法院公告
class ProwebCourtItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#失信人员
class ProwebDishonestItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#被执行人员
class ProwebZhixingItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#司法协助
class ProwebJudicialAidItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#经营异常
class ProwebAbnormalItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()

#行政处罚(工商局)
class ProwebPunishmentItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#行政处罚(信用中国)
class ProwebPunishmentCreditchinaItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#股权出质
class ProwebEquityItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#动产抵押
class ProwebMortgageItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#欠税公告
class ProwebTowntaxItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#司法拍卖
class ProwebJudicialSaleItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#清算信息
# class ProwebMortgageItem(scrapy.Item):
#     id = scrapy.Field()
#     name = scrapy.Field()
#     info = scrapy.Field()
#     sign = scrapy.Field()
#知识产权出质
class ProwebIntelleItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#公告催告
class ProwebNoticeItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#融资历史
class ProwebRongziItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#核心团队
class ProwebTeammemberItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#企业业务
class ProwebFirmProductItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#投资事件
class ProwebTouziItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#竞品信息
class ProwebJingpinItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#行政许可(工商局)
class ProwebLicensingItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#行政许可(信用中国)
class ProwebLicensingXyzgItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#税务评级
class ProwebTaxcreditItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#抽查检查
class ProwebCheckItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#资质证书
class ProwebCertificateItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#招投标信息
class ProwebBidItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#产品信息
class ProwebProductItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#进出口信息
class ProwebImportAndExportItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#债券信息
class ProwebBondItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#购地信息
class ProwebPurchaselandItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#电信许可
class ProwebPermissionItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#商标信息
class ProwebTmInfoItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#专利信息
class ProwebPatentItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#软件著作权
class ProwebCopyrightItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#作品著作权
class ProwebCopyrightWorksItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
#网站备案
class ProwebIcpItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    info = scrapy.Field()
    sign = scrapy.Field()
