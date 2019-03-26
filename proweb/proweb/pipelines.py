# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import copy
import json
from pymysql import cursors
from twisted.enterprise import adbapi
from urllib.parse import quote_plus,unquote
import redis
from hashlib import sha1
from proweb.items import ProwebItem,ProwebHolderItem,ProwebStaffItem,ProwebChangeItem,ProwebReportItem,\
    ProwebBranchItem,ProwebAnnouncementItem,ProwebCourtItem,ProwebDishonestItem,ProwebDishonestItem,\
    ProwebInvestItem,ProwebJudicialAidItem,ProwebLawsuitItem,ProwebPunishmentItem,ProwebPunishmentCreditchinaItem,\
    ProwebZhixingItem,ProwebEquityItem,ProwebAbnormalItem,ProwebMortgageItem,ProwebTowntaxItem,\
    ProwebJudicialSaleItem, ProwebNoticeItem,ProwebIntelleItem,ProwebRongziItem,ProwebTeammemberItem,\
    ProwebFirmProductItem,ProwebTouziItem,ProwebJingpinItem,ProwebLicensingItem,ProwebLicensingXyzgItem,\
    ProwebTaxcreditItem,ProwebCheckItem,ProwebCertificateItem,ProwebBidItem,ProwebProductItem,\
    ProwebImportAndExportItem,ProwebBondItem,ProwebPurchaselandItem,ProwebPermissionItem,ProwebTmInfoItem,\
    ProwebPatentItem,ProwebCopyrightItem,ProwebCopyrightWorksItem,ProwebIcpItem



class ProwebPipeline(object):
    '''
        MYSQL_HOST,MYSQL_PORT,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DB
        self.MYSQL_HOST = MYSQL_HOST
        self.MYSQL_PORT = MYSQL_PORT
        self.MYSQL_USER = MYSQL_USER
        self.MYSQL_PASSWORD = MYSQL_PASSWORD
        self.MYSQL_DB = MYSQL_DB
        self.CHARSET = 'utf8'
    '''
    def __init__(self):
        self.sha1 = sha1()

    @classmethod
    def from_crawler(cls,crawler):
        cls.MYSQL_HOST = crawler.settings.get('MYSQL_HOST', '127.0.0.1')
        cls.MYSQL_PORT = crawler.settings.get('MYSQL_PORT', 3306)
        cls.MYSQL_USER = crawler.settings.get('MYSQL_USER', 'root')
        cls.MYSQL_PASSWORD = crawler.settings.get('MYSQL_PASSWORD', '123456')
        cls.MYSQL_DB = crawler.settings.get('MYSQL_DB', '')

        cls.REDIS_HOST = crawler.settings.get('REDIS_HOST', '127.0.0.1')
        cls.REDIS_PORT = crawler.settings.get('REDIS_PORT', 6379)
        cls.REDIS_PASSWORD = crawler.settings.get('REDIS_PASSWORD', '')
        cls.REDIS_DB = crawler.settings.get('REDIS_DB', 0)
        return cls()
        # dbparams = dict(
        #                 host=crawler.settings.get('MYSQL_HOST','127.0.0.1'),
        #                 port=crawler.settings.get('MYSQL_PORT',3306),
        #                 user=crawler.settings.get('MYSQL_USER','root'),
        #                 passwd=crawler.settings.get('MYSQL_PASSWORD','123456'),
        #                 db=crawler.settings.get('MYSQL_DB',''),
        #                 charset='utf8',
        #                 cursorclass=cursors.DictCursor,
        #                 use_unicode=True,
        #             )
        # dbpool = adbapi.ConnectionPool('pymysql', **dbparams)
        # return cls
    def open_spider(self,spider):
        self.db_pool = adbapi.ConnectionPool('pymysql',host=self.MYSQL_HOST,port=self.MYSQL_PORT,user=self.MYSQL_USER,password=self.MYSQL_PASSWORD,db=self.MYSQL_DB,charset='utf8')
        self.redis_pool = redis.StrictRedis(host=self.REDIS_HOST, port=self.REDIS_PORT, password=self.REDIS_PASSWORD,db=self.REDIS_DB, decode_responses=True)
    def close_spider(self,spider):
        self.db_pool.close()
    def process_item(self, item, spider):
        asynItem = copy.deepcopy(item)
        query = self.db_pool.runInteraction(self.do_insert, asynItem)
        query.addErrback(self.handle_error, item, spider)  # 调用异常处理方法
        # return item

    def do_insert(self,cursor,item):
        if isinstance(item,ProwebItem):
            VALUES = (item['company_name'],item['company_id'],item['history_name'],item['phone'],item['email'],item['com_status'],item['gswz'],item['gsdz'],item['gsjj'],item['gxsj'],item['gsfr'],item['zczb'],item['zcrq'],item['gszch'],item['zzjgdm'],item['shxydm'],item['gslx'],item['nsrsbm'],item['hangye'],item['yyqx'],item['nsrzz'],item['rygm'],item['sjzb'],item['djjg'],item['cbrs'],item['ywmc'],item['jyfw'],item['gsnb'])
            insert_sql = "insert into tyc_base_info(company_name,company_id,history_name,phone,email,com_status,gswz,gsdz,gsjj,gxsj,gsfr,zczb,zcrq,gszch,zzjgdm,shxydm,gslx,nsrsbm,hangye,yyqx,nsrzz,rygm,sjzb,djjg,cbrs,ywmc,jyfw,gsnb) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            if not self.redis_pool.sismember("company_id",item['company_id']):
                if cursor.execute(insert_sql, VALUES):
                    other_info = {'name':item['company_name'],'gsnb':item['gsnb']}
                    self.redis_pool.hset("company_info",item['company_id'],other_info)
                    self.redis_pool.sadd("company_id", item['company_id'])
                    print("基本信息执行成功")
        elif isinstance(item,ProwebHolderItem):
            kw = {
                'redis_set_checked_name':"hasHolderSign",
                'redis_set_checked_filed':"hasholder:"+ str(item['id']),
                'redis_set_checking_name':"hasholderSign",
                'redis_set_checking_filed':"gudong:"+str(item['id']),
                'mysql_filed':"gdxx",
                'mysql_db':"tyc_base_gudong",
                'item':item,
                'cursor':cursor,
                'tiptxt':'股东信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebStaffItem):
            kw = {
                'redis_set_checked_name':"hasStaffSign",
                'redis_set_checked_filed':"hasstaff:"+ str(item['id']),
                'redis_set_checking_name':"hasstaffSign",
                'redis_set_checking_filed':"renyuan:"+str(item['id']),
                'mysql_filed':"zyry",
                'mysql_db':"tyc_base_lingdao",
                'item':item,
                'cursor':cursor,
                'tiptxt':'主要人员'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebInvestItem):
            kw = {
                'redis_set_checked_name':"hasInvestSign",
                'redis_set_checked_filed':"hasinvest:"+ str(item['id']),
                'redis_set_checking_name':"hasinvestSign",
                'redis_set_checking_filed':"dwtouzi:"+str(item['id']),
                'mysql_filed':"dwtz",
                'mysql_db':"tyc_base_duiwaitouzi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'对外投资'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebChangeItem):
            kw = {
                'redis_set_checked_name':"hasChangSign",
                'redis_set_checked_filed':"haschang:"+ str(item['id']),
                'redis_set_checking_name':"haschangSign",
                'redis_set_checking_filed':"change:"+str(item['id']),
                'mysql_filed':"bgjl",
                'mysql_db':"tyc_base_biangeng",
                'item':item,
                'cursor':cursor,
                'tiptxt':'变更记录'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebReportItem):
            kw = {
                'redis_set_checked_name':"hasReportSign",
                'redis_set_checked_filed':"hasreport:"+ str(item['id']),
                'redis_set_checking_name':"hasreportSign",
                'redis_set_checking_filed':"nianbao:"+str(item['id']),
                'mysql_filed':"gsnb",
                'mysql_db':"tyc_base_nianbao",
                'item':item,
                'cursor':cursor,
                'tiptxt':'企业年报'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebBranchItem):
            kw = {
                'redis_set_checked_name':"hasBranchSign",
                'redis_set_checked_filed':"hasbranch:"+ str(item['id']),
                'redis_set_checking_name':"hasbranchSign",
                'redis_set_checking_filed':"jigou:"+str(item['id']),
                'mysql_filed':"fzjg",
                'mysql_db':"tyc_base_jigou",
                'item':item,
                'cursor':cursor,
                'tiptxt':'分支机构'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebAnnouncementItem):
            kw = {
                'redis_set_checked_name':"hasAnnouncementSign",
                'redis_set_checked_filed':"hasannouncement:"+ str(item['id']),
                'redis_set_checking_name':"hasannouncementSign",
                'redis_set_checking_filed':"kaiting:"+str(item['id']),
                'mysql_filed':"ktgg",
                'mysql_db':"tyc_legal_kaiting",
                'item':item,
                'cursor':cursor,
                'tiptxt':'开庭公告'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebLawsuitItem):
            # 新数据进行添加操作
            insert_sql = "insert into tyc_legal_susong(company_id,com_name,flss) VALUES(%s,%s,%s)"
            VALUES = (item['id'], unquote(item['name']), str(item['info']))
            cursor.execute(insert_sql, VALUES)
            self.redis_pool.sadd("hasLawsuitSign", "haslawsuit:"+item['url'])
            print("法律文书 数据插入数据库成功")
        elif isinstance(item,ProwebCourtItem):
            kw = {
                'redis_set_checked_name':"hasCourtSign",
                'redis_set_checked_filed':"hascourt:"+ str(item['id']),
                'redis_set_checking_name':"hascourtSign",
                'redis_set_checking_filed':"fayuan:"+str(item['id']),
                'mysql_filed':"fygg",
                'mysql_db':"tyc_legal_fayuan",
                'item':item,
                'cursor':cursor,
                'tiptxt':'法院公告'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebDishonestItem):
            kw = {
                'redis_set_checked_name':"hasDishonestSign",
                'redis_set_checked_filed':"hasdishonest:"+ str(item['id']),
                'redis_set_checking_name':"hasdishonestSign",
                'redis_set_checking_filed':"shixin:"+str(item['id']),
                'mysql_filed':"sxry",
                'mysql_db':"tyc_legal_shixinren",
                'item':item,
                'cursor':cursor,
                'tiptxt':'失信人员'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebZhixingItem):
            kw = {
                'redis_set_checked_name':"hasZhixingSign",
                'redis_set_checked_filed':"haszhixing:"+ str(item['id']),
                'redis_set_checking_name':"haszhixingSign",
                'redis_set_checking_filed':"zhixing:"+str(item['id']),
                'mysql_filed':"zxry",
                'mysql_db':"tyc_legal_zhixingren",
                'item':item,
                'cursor':cursor,
                'tiptxt':'执行人员'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebJudicialAidItem):
            kw = {
                'redis_set_checked_name':"hasJudicialAidSign",
                'redis_set_checked_filed':"hasjudicialaid:"+ str(item['id']),
                'redis_set_checking_name':"hasjudicialaidSign",
                'redis_set_checking_filed':"xiezhu:"+str(item['id']),
                'mysql_filed':"sfxz",
                'mysql_db':"tyc_legal_xiezhu",
                'item':item,
                'cursor':cursor,
                'tiptxt':'司法协助'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebAbnormalItem):
            kw = {
                'redis_set_checked_name':"hasAbnormalSign",
                'redis_set_checked_filed':"hasabnormal:"+ str(item['id']),
                'redis_set_checking_name':"hasabnormalSign",
                'redis_set_checking_filed':"yichang:"+str(item['id']),
                'mysql_filed':"jyyc",
                'mysql_db':"tyc_operating_yichang",
                'item':item,
                'cursor':cursor,
                'tiptxt':'经营异常'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebPunishmentItem):
            kw = {
                'redis_set_checked_name':"hasPunishmentSign",
                'redis_set_checked_filed':"haspunishment:"+ str(item['id']),
                'redis_set_checking_name':"haspunishmentSign",
                'redis_set_checking_filed':"chufa_gsj:"+str(item['id']),
                'mysql_filed':"xzcf_gsj",
                'mysql_db':"tyc_operating_chufa_gsj",
                'item':item,
                'cursor':cursor,
                'tiptxt':'行政处罚(工商局)'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebPunishmentCreditchinaItem):
            kw = {
                'redis_set_checked_name':"hasPunishmentChinaSign",
                'redis_set_checked_filed':"haspunishmentchina:"+ str(item['id']),
                'redis_set_checking_name':"haspunishmentchinaSign",
                'redis_set_checking_filed':"chufa_xyzg:"+str(item['id']),
                'mysql_filed':"xzcf_xyzg",
                'mysql_db':"tyc_operating_chufa_xyzg",
                'item':item,
                'cursor':cursor,
                'tiptxt':'行政处罚(信用中国)'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebEquityItem):
            kw = {
                'redis_set_checked_name':"hasEquitySign",
                'redis_set_checked_filed':"hasequity:"+ str(item['id']),
                'redis_set_checking_name':"hasequitySign",
                'redis_set_checking_filed':"guquan:"+str(item['id']),
                'mysql_filed':"gqcz",
                'mysql_db':"tyc_operating_guquan",
                'item':item,
                'cursor':cursor,
                'tiptxt':'股权出质'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebMortgageItem):
            kw = {
                'redis_set_checked_name':"hasMortgageSign",
                'redis_set_checked_filed':"hasmortgage:"+ str(item['id']),
                'redis_set_checking_name':"hasmortgageSign",
                'redis_set_checking_filed':"diya:"+str(item['id']),
                'mysql_filed':"dcdy",
                'mysql_db':"tyc_operating_diya",
                'item':item,
                'cursor':cursor,
                'tiptxt':'动产抵押'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebTowntaxItem):
            kw = {
                'redis_set_checked_name':"hasTowntaxSign",
                'redis_set_checked_filed':"hastowntax:"+ str(item['id']),
                'redis_set_checking_name':"hastowntaxSign",
                'redis_set_checking_filed':"qianshui:"+str(item['id']),
                'mysql_filed':"qsgg",
                'mysql_db':"tyc_operating_qianshui",
                'item':item,
                'cursor':cursor,
                'tiptxt':'欠税公告'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebJudicialSaleItem):
            kw = {
                'redis_set_checked_name':"hasJudicialSaleSign",
                'redis_set_checked_filed':"hasjudicialsale:"+ str(item['id']),
                'redis_set_checking_name':"hasjudicialsaleSign",
                'redis_set_checking_filed':"paimai:"+str(item['id']),
                'mysql_filed':"sfpm",
                'mysql_db':"tyc_operating_paimai",
                'item':item,
                'cursor':cursor,
                'tiptxt':'司法拍卖'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebIntelleItem):
            kw = {
                'redis_set_checked_name':"hasIntelleSign",
                'redis_set_checked_filed':"hasintelle:"+ str(item['id']),
                'redis_set_checking_name':"hasintelleSign",
                'redis_set_checking_filed':"zhishi:"+str(item['id']),
                'mysql_filed':"zscq",
                'mysql_db':"tyc_operating_zhishi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'知识产权出质'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebNoticeItem):
            kw = {
                'redis_set_checked_name':"hasNoticeSign",
                'redis_set_checked_filed':"hasnotice:"+ str(item['id']),
                'redis_set_checking_name':"hasnoticeSign",
                'redis_set_checking_filed':"gongshi:"+str(item['id']),
                'mysql_filed':"gscg",
                'mysql_db':"tyc_operating_gongshi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'公示催告'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebRongziItem):
            kw = {
                'redis_set_checked_name':"hasRongziSign",
                'redis_set_checked_filed':"hasrongzi:"+ str(item['id']),
                'redis_set_checking_name':"hasrongziSign",
                'redis_set_checking_filed':"rongzi:"+str(item['id']),
                'mysql_filed':"rzls",
                'mysql_db':"tyc_company_rongzi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'融资历史'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebTeammemberItem):
            kw = {
                'redis_set_checked_name':"hasTeamSign",
                'redis_set_checked_filed':"hasteam:"+ str(item['id']),
                'redis_set_checking_name':"hasteamSign",
                'redis_set_checking_filed':"tuandui:"+str(item['id']),
                'mysql_filed':"hxtd",
                'mysql_db':"tyc_company_tuandui",
                'item':item,
                'cursor':cursor,
                'tiptxt':'核心团队'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebFirmProductItem):
            kw = {
                'redis_set_checked_name':"hasFirmSign",
                'redis_set_checked_filed':"hasfirm:"+ str(item['id']),
                'redis_set_checking_name':"hasfirmSign",
                'redis_set_checking_filed':"yewu:"+str(item['id']),
                'mysql_filed':"qyyw",
                'mysql_db':"tyc_company_yewu",
                'item':item,
                'cursor':cursor,
                'tiptxt':'企业业务'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebTouziItem):
            kw = {
                'redis_set_checked_name':"hasTouziSign",
                'redis_set_checked_filed':"hastouzi:"+ str(item['id']),
                'redis_set_checking_name':"hastouziSign",
                'redis_set_checking_filed':"touzi:"+str(item['id']),
                'mysql_filed':"tzsj",
                'mysql_db':"tyc_company_touzi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'投资事件'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebJingpinItem):
            kw = {
                'redis_set_checked_name':"hasJingpinSign",
                'redis_set_checked_filed':"hasjingpin:"+ str(item['id']),
                'redis_set_checking_name':"hasjingpinSign",
                'redis_set_checking_filed':"jingpin:"+str(item['id']),
                'mysql_filed':"jpxx",
                'mysql_db':"tyc_company_jingpin",
                'item':item,
                'cursor':cursor,
                'tiptxt':'竞品信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebLicensingItem):
            kw = {
                'redis_set_checked_name':"hasLicenseSign",
                'redis_set_checked_filed':"haslicense:"+ str(item['id']),
                'redis_set_checking_name':"haslicenseSign",
                'redis_set_checking_filed':"xukegsj:"+str(item['id']),
                'mysql_filed':"xzxk_gsj",
                'mysql_db':"tyc_business_status_xuke_gsj",
                'item':item,
                'cursor':cursor,
                'tiptxt':'行政许可(工商局)'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebLicensingXyzgItem):
            kw = {
                'redis_set_checked_name':"hasLicensingChinaSign",
                'redis_set_checked_filed':"haslicensingChina:"+ str(item['id']),
                'redis_set_checking_name':"haslicensingChinaSign",
                'redis_set_checking_filed':"xukexyzg:"+str(item['id']),
                'mysql_filed':"xzxk_xyzg",
                'mysql_db':"tyc_business_status_xuke_xyzg",
                'item':item,
                'cursor':cursor,
                'tiptxt':'行政许可(信用中国)'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebTaxcreditItem):
            kw = {
                'redis_set_checked_name':"hasTaxcreditSign",
                'redis_set_checked_filed':"hastaxcredit:"+ str(item['id']),
                'redis_set_checking_name':"hastaxcreditSign",
                'redis_set_checking_filed':"shuiwu:" + str(item['id']),
                'mysql_filed':"swpj",
                'mysql_db':"tyc_business_status_shuiwu",
                'item':item,
                'cursor':cursor,
                'tiptxt':'税务评级'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebCheckItem):
            kw = {
                'redis_set_checked_name':"hasCheckSign",
                'redis_set_checked_filed':"hascheck:"+ str(item['id']),
                'redis_set_checking_name':"hascheckSign",
                'redis_set_checking_filed':"jiancha:"+str(item['id']),
                'mysql_filed':"ccjc",
                'mysql_db':"tyc_business_status_jiancha",
                'item':item,
                'cursor':cursor,
                'tiptxt':'抽查检查'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebCertificateItem):
            kw = {
                'redis_set_checked_name':"hasCertificateSign",
                'redis_set_checked_filed':"hascertificate:"+ str(item['id']),
                'redis_set_checking_name':"hascertificateSign",
                'redis_set_checking_filed':"zizhi:"+str(item['id']),
                'mysql_filed':"zzzs",
                'mysql_db':"tyc_business_status_zizhi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'资质证书'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebBidItem):
            kw = {
                'redis_set_checked_name':"hasBidSign",
                'redis_set_checked_filed':"hasbid:"+ str(item['id']),
                'redis_set_checking_name':"hasbidSign",
                'redis_set_checking_filed':"biaodi:" + str(item['id']),
                'mysql_filed':"ztbxx",
                'mysql_db':"tyc_business_status_biaodi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'招投标信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebProductItem):
            kw = {
                'redis_set_checked_name':"hasProductSign",
                'redis_set_checked_filed':"hasproduct:"+ str(item['id']),
                'redis_set_checking_name':"hasproductSign",
                'redis_set_checking_filed':"chanpin:"+str(item['id']),
                'mysql_filed':"cpxx",
                'mysql_db':"tyc_business_status_chanpin",
                'item':item,
                'cursor':cursor,
                'tiptxt':'产品信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebImportAndExportItem):
            kw = {
                'redis_set_checked_name':"hasExportSign",
                'redis_set_checked_filed':"hasexport:"+ str(item['id']),
                'redis_set_checking_name':"hasexportSign",
                'redis_set_checking_filed':"jinchukou:"+str(item['id']),
                'mysql_filed':"jckxx",
                'mysql_db':"tyc_business_status_jinchukou",
                'item':item,
                'cursor':cursor,
                'tiptxt':'进出口信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebBondItem):
            kw = {
                'redis_set_checked_name':"hasBondSign",
                'redis_set_checked_filed':"hasbond:"+ str(item['id']),
                'redis_set_checking_name':"hasbondSign",
                'redis_set_checking_filed':"zaiquan:"+str(item['id']),
                'mysql_filed':"zqxx",
                'mysql_db':"tyc_business_status_zaiquan",
                'item':item,
                'cursor':cursor,
                'tiptxt':'债券信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebPurchaselandItem):
            kw = {
                'redis_set_checked_name':"hasLandSign",
                'redis_set_checked_filed':"hasland:"+ str(item['id']),
                'redis_set_checking_name':"haslandSign",
                'redis_set_checking_filed':"goudi:"+str(item['id']),
                'mysql_filed':"gdixx",
                'mysql_db':"tyc_business_status_goudi",
                'item':item,
                'cursor':cursor,
                'tiptxt':'购地信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebPermissionItem):
            kw = {
                'redis_set_checked_name':"hasPermissionSign",
                'redis_set_checked_filed':"haspermission:"+ str(item['id']),
                'redis_set_checking_name':"haspermissionSign",
                'redis_set_checking_filed':"dianxin:"+str(item['id']),
                'mysql_filed':"dxxk",
                'mysql_db':"tyc_business_status_dianxin",
                'item':item,
                'cursor':cursor,
                'tiptxt':'电信许可'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebTmInfoItem):
            kw = {
                'redis_set_checked_name':"hasTmInfoSign",
                'redis_set_checked_filed':"hastmInfo:"+ str(item['id']),
                'redis_set_checking_name':"hastmInfoSign",
                'redis_set_checking_filed':"shangbiao:"+str(item['id']),
                'mysql_filed':"sbxx",
                'mysql_db':"tyc_ip_shangbiao",
                'item':item,
                'cursor':cursor,
                'tiptxt':'商标信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebPatentItem):
            kw = {
                'redis_set_checked_name':"hasPatentSign",
                'redis_set_checked_filed':"haspatent:"+ str(item['id']),
                'redis_set_checking_name':"haspatentSign",
                'redis_set_checking_filed':"zhuanli:"+str(item['id']),
                'mysql_filed':"zlxx",
                'mysql_db':"tyc_ip_zhuanli",
                'item':item,
                'cursor':cursor,
                'tiptxt':'专利信息'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebCopyrightItem):
            kw = {
                'redis_set_checked_name':"hasCopyrightSign",
                'redis_set_checked_filed':"hascopyright:"+ str(item['id']),
                'redis_set_checking_name':"hascopyrightSign",
                'redis_set_checking_filed':"ruanjian:"+str(item['id']),
                'mysql_filed':"rjzzq",
                'mysql_db':"tyc_ip_ruanjian",
                'item':item,
                'cursor':cursor,
                'tiptxt':'软件著作权'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebCopyrightWorksItem):
            kw = {
                'redis_set_checked_name':"hasCopyrightWorksSign",
                'redis_set_checked_filed':"hascopyrightWorks:"+ str(item['id']),
                'redis_set_checking_name':"hascopyrightWorksSign",
                'redis_set_checking_filed':"zuopin:"+str(item['id']),
                'mysql_filed':"zpzzq",
                'mysql_db':"tyc_ip_zuopin",
                'item':item,
                'cursor':cursor,
                'tiptxt':'作品著作权'
            }
            self.execute_datas(**kw)
        elif isinstance(item,ProwebIcpItem):
            kw = {
                'redis_set_checked_name':"hasIcpSign",
                'redis_set_checked_filed':"hasicp:"+ str(item['id']),
                'redis_set_checking_name':"hasicpSign",
                'redis_set_checking_filed':"wangzhan:"+str(item['id']),
                'mysql_filed':"wzba",
                'mysql_db':"tyc_ip_wangzhan",
                'item':item,
                'cursor':cursor,
                'tiptxt':'网站备案'
            }
            self.execute_datas(**kw)

    def execute_datas(self, **kw):
        redis_set_checked_name = kw['redis_set_checked_name']
        redis_set_checked_filed = kw['redis_set_checked_filed']
        redis_set_checking_name = kw['redis_set_checking_name']
        redis_set_checking_filed = kw['redis_set_checking_filed']
        mysql_filed = kw['mysql_filed']
        mysql_db = kw['mysql_db']
        item = kw['item']
        cursor = kw['cursor']
        tiptxt = kw['tiptxt']
        if self.redis_pool.sismember(redis_set_checked_name, redis_set_checked_filed):
            print("该"+tiptxt+" 数据已存在！")
        else:
            # 多页的数据进行更新
            if self.redis_pool.sismember(redis_set_checking_name,redis_set_checking_filed):
                insert_sql = "update "+mysql_db+" set "+mysql_filed+"=CONCAT("+mysql_filed+",',',%s) where company_id =%s"
                VALUES = (str(item['info']), item['id'])
                cursor.execute(insert_sql, VALUES)
                print("数据已存在,更新成功")
            else:
                # 新数据进行添加操作
                insert_sql = "insert into "+mysql_db+"(company_id,com_name,"+mysql_filed+") VALUES(%s,%s,%s)"
                VALUES = (item['id'], unquote(item['name']), str(item['info']))
                cursor.execute(insert_sql, VALUES)
                self.redis_pool.sadd(redis_set_checking_name, redis_set_checking_filed)
                print(tiptxt+" 数据插入数据库成功")
            # 判断数据是否存在的标志位
            if item['sign']:
                self.redis_pool.sadd(redis_set_checked_name, redis_set_checked_filed)

    def handle_error(self,failue,item,spider):
        print('插入数据失败，原因：{}，错误对象：{}'.format(failue, item))