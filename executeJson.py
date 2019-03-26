# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import redis
import json
import re
import pymysql
import os
from urllib.parse import quote_plus, unquote
import html

class ExecuteJson(object):

    def __init__(self):
        self.REDIS_HOST = "127.0.0.1"
        self.REDIS_PORT = "6379"
        self.REDIS_PASSWORD = ""
        self.REDIS_DB = "1"
        self.db = pymysql.connect(host='localhost',user='root',password='123456',port=3306,db='qy_names',charset='utf8')
        self.redis_pool = redis.StrictRedis(host=self.REDIS_HOST, port=self.REDIS_PORT, password=self.REDIS_PASSWORD,db=self.REDIS_DB, decode_responses=True)
        self.cursor = self.db.cursor()

    #关闭连接池
    def __del__(self):
        self.db.close()

    #数据处理方法
    # def process_item(self):
    #     # asynItem = copy.deepcopy(item)
    #     query = self.db_pool.runInteraction(self.do_select)
    #     # query.addErrback(self.handle_error, item, spider)  # 调用异常处理方法
    #     # return item

    #执行数据插入方法
    def do_insert(self,item):
        VALUES = (item['month'],item['day'],item['year'],item['title'],item['content'])
        insert_sql = "insert into todayhistorys(month,day,year,title,content) VALUES(%s,%s,%s,%s,%s)"
        # if not self.redis_pool.sismember("todayhistory", item['url']):
        try:
            self.cursor.execute(insert_sql,VALUES)
            self.db.commit()
            self.redis_pool.sadd('todayhistory_id',item['id'])
            print("执行成功")
        except:
            self.db.rollback()
            print("未执行")

    #查询方法
    # def getmonth(self,month):
    #     select_year_sql = "select id,month,day,year,title from todayhistorys where month=%s order by month,day,year limit 38,4"%month
    #     try:
    #         self.cursor.execute(select_year_sql)
    #         year_result = self.cursor.fetchall()
    #         return year_result
    #     except:
    #         print("错误")
    # def getday(self,day):
    #     select_sql = "select day from todayhistorys where day=%s order by month,day,year limit 2"%day
    #     try:
    #         self.cursor.execute(select_sql)
    #         year_result = self.cursor.fetchall()
    #         return year_result
    #     except:
    #         print("错误")


    def getall(self,month,day):
        select_sql = "select * from todayhistorys where month=%s and day=%s order by month,day,year"%(month,day)
        try:
            self.cursor.execute(select_sql)
            year_result = self.cursor.fetchall()
            return year_result
        except:
            print("错误")


    def writeJson(self,month,day,data):
        path = "E:/todayhistory/datas"
        filename = "/data_%s_%s.json"%(str(month),str(day))
        print("数据整理完成!开始写入%s月%s日文件..."%(month,day))
        if os.path.exists(path):
            with open(path+filename, "w+", encoding="utf-8") as f:
                f.write(data)
            print("写入完成")
        else:
            os.makedirs(path)
            with open(path+filename, "w+", encoding="utf-8") as f:
                f.write(data)
            print("写入完成")

    def data_style(self,month,day):
        text =""
        # text += "["
        # text += '{'
        # text += '"month":%s,'%str(month)
        # text += '"data":['
        # for j in range(1,32):
        # text += '{'
        # text += '"day":"%s",' % j
        # text += '"data":['
        # text += self.day_detail(month,j)
        # text += ']'
        # text += '},'
        # text = text[0:-1]
        # text += ']'
        # text += '},'
        # text = text[0:-1]
        # text += ']'
        return text


    def run(self):
        for i in range(1,13):
            for j in range(1, 32):
                data = self.day_detail(i,j)
                self.writeJson(i,j,data)

    def day_detail(self,month,day):
        arealist = self.getall(month, day)
        print("执行 %s月 %s日数据"%(month,day))
        text = ""
        text += "["
        for a in arealist:
            text += "{"
            text += '"year":"%s",' % a[3]
            text += '"title":"%s",' % a[4]
            pattern = re.compile(r"<script.*?/script>")
            info = re.sub(pattern,"",a[5])
            text += '"info":%s' % json.dumps(info)
            text += "},"
        text = text[0:-1]
        text += "]"
        # print(text)
        return text

    #查询数据
    # def do_execute(self):
    #     with open("E:/todayhistory.json", 'r',encoding='utf-8') as f:
    #         temp = json.loads(f.read())
    #         for item in temp['RECORDS']:
    #             id = item['id']
    #             # if not self.redis_pool.sismember("todayhistory_id",id):
    #             dict_data = {}
    #             info = eval(item['info'])
    #             dict_data['id'] = id
    #             dict_data['month'] = int(item['monthT'])
    #             dict_data['day'] = int(info['day'])
    #             dict_data['year'] = int(info['year'])
    #             dict_data['title'] = info['title']
    #             # dict_data['content'] = info['content']
    #             # self.do_insert(dict_data)
    #
    #             print(dict_data)
    #             break


    #查询数据
    #处理错误异常方法
    # def handle_error(self,failue,item,spider):
    #     print('插入数据失败，原因：{}，错误对象：{}'.format(failue, item))

e = ExecuteJson()
e.run()