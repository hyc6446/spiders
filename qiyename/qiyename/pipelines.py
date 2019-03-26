# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymysql

class Execute_mysql(object):
    def __init__(self):
        self.db = pymysql.connect(host='localhost',user='root',password='123456',port=3306,db='qy_names',charset='utf8')
        self.cursor = self.db.cursor()

    def execute_sql(self,sql,data):
        try:
            self.cursor.execute(sql,data)
            self.db.commit()
            print('添加成功')
        except:
            print(22222)
            self.db.rollback()

    def __del__(self):
        self.db.close()


class QiyenamePipeline(object):
    def process_item(self, item, spider):
        e = Execute_mysql()

        sql,data= item.submit_sql()
        print(sql,data)
        e.execute_sql(sql,data)
