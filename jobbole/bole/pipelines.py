# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymysql

class BolePipeline(object):
    def process_item(self, item, spider):
        return item


# class OperateSql(object):
#
#     def __init__(self):
#         self.db = pymysql.connect(host="localhost",port=3306,user='root',password='123456',db='bj_lianjia',charset='utf8')
#         self.cursor= self.db.cursor()
#
#     def execute_sql(self,sql,data):
#         try:
#             self.cursor.execute(sql,data)
#             self.db.commit()
#             print('添加成功')
#         except:
#             self.db.rollback()
#
#     def __del__(self):
#         self.db.close()

# o = OperateSql()

class AddDataPipeline(object):
    def process_item(self,item,spider):
        print(item)
        # sql,data =item.execute_data_sql()
        #
        # o.execute_sql(sql,data)