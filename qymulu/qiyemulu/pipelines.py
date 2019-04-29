# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
from pymysql import cursors
import copy
import redis
from pymysql import escape_string

from twisted.enterprise import adbapi


class QiyemuluPipeline(object):

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
        #企业基本信息
        # VALUES = (item['companyId'],item['companyName'])
        # insert_sql = "INSERT IGNORE INTO tyc_baseinfo(companyId,companyName,alias,historyNames,legalPersonName,phoneList,emailList,websiteList,estiblishTime,regNumber,regCapital,actualCapital,creditCode,taxNumber,orgNumber,taxQualification,englishName,regStatus,staffNumRange,socialStaffNum,companyOrgType,industry,operatingPeriod,regLocation,approvedTime,regInstitute,logo,portray,updatetime,businessScope,intro,base,district) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        # VALUES = (item['companyId'],item['companyName'],item['alias'],item['historyNames'],item['legalPersonName'],item['phoneList'],item['emailList'],item['websiteList'],item['estiblishTime'],item['regNumber'],item['regCapital'],item['actualCapital'],item['creditCode'],item['taxNumber'],item['orgNumber'],item['taxQualification'],item['englishName'],item['regStatus'],item['staffNumRange'],item['socialStaffNum'],item['companyOrgType'],item['industry'],item['operatingPeriod'],item['regLocation'],item['approvedTime'],item['regInstitute'],item['logo'],item['portray'],item['updatetime'],item['businessScope'],item['intro'],item['base'],item['district'])
        '''股东信息  tyc1_holderinfo'''
        '''高管信息  tyc2_staffinfo'''
        '''变更信息  tyc3_changeinfo'''
        '''投资信息  tyc4_inverstinfo'''
        '''年报信息  tyc5_reportinfo'''
        '''开庭公告  tyc6_announcementinfo'''
        '''开庭公告  tyc7_lawsuitinfo'''
        # if not self.redis_pool.sismember("lawsuit", item['companyId']):
        VALUES = (item['companyId'],item['allInfo'])
        insert_sql = "INSERT INTO tyc7_lawsuitinfo(companyId,info) VALUES(%s,%s)"
        if cursor.execute(insert_sql, VALUES):
            # self.redis_pool.hset("companyInfo",item['companyId'],item['companyName'])
            self.redis_pool.sadd("lawsuit",item['companyId'])
            print(item['companyId'],"信息执行成功")
        # else:
        #     VALUES = (item['allInfo'],item['companyId'])
        #     insert_sql = "UPDATE tyc7_lawsuitinfo SET info=concat(info,',',%s) WHERE companyId=%s"
        #     if cursor.execute(insert_sql, VALUES):
        #         print(item['companyId'],"信息更新成功")



    def handle_error(self,failue,item,spider):
        print('插入数据失败，原因：{}，错误对象：{}'.format(failue, item))
