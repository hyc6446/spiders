# -*- coding: utf-8 -*-
import redis
import pymysql
from pymysql import escape_string

class RedisDataToMysql():
    def __init__(self,name,match="*",count=10,filename=""):
        self.mysql_pool = pymysql.connect(host='localhost',user='root',password='123456',port=3306,db='tianyancha_datas',charset='utf8')
        self.redis_pool = redis.StrictRedis(host="127.0.0.1", port=6379, password="",db=3, decode_responses=True)
        self.cursor = self.mysql_pool.cursor()
        self.name = name
        self.match = match
        self.count = count
        self.filename = filename

    def __del__(self):
        self.mysql_pool.close()

    def get(self,filed):
        numbers = self.redis_pool.scard(filed)
        print("总数："+str(numbers))

    # def executeRedis(self):
    #     alldatas = self.redis_pool.sscan_iter(self.name,self.match,self.count)
    #     for data in alldatas:
    #         try:
    #             if self.redis_pool.smove(self.name, 'allnames', data):
    #                 insert_sql = "insert into names(name) values ('%s')" % data
    #                 self.cursor.execute(insert_sql)
    #                 self.mysql_pool.commit()
    #                 print(data, "执行成功")
    #         except:
    #             self.mysql_pool.rollback()
    #             print("执行失败")

    def executeTxt(self):
        n=0
        alldatas = self.redis_pool.hscan_iter(self.name, self.match, self.count)
        with open(filename,"a+",encoding='utf-8') as f:
            # result = f.read()
            # set_result = result.split(",")
            # for i in set_result:
            #     if not self.redis_pool.sismember("allnames", i):
            #         self.redis_pool.sadd("allnames", i)
            #         print(i, "执行成功")

            for i in alldatas:
                n = n+1
                sql_txt = 'INSERT INTO `companys`(`id`, `company_id`, `company_name`) VALUES (%s,%s,"%s");'%(n,int(i[0]),escape_string(i[1]))
                print(sql_txt)
                f.write(sql_txt)
                f.write("\n")
                # break
                    # if not self.redis_pool.sismember("allnames",i):
                    #     insert_sql = "insert into allnames(name) values ('%s')" % i
                    #     try:
                    #         self.cursor.execute(insert_sql)
                    #         self.mysql_pool.commit()
                    #         self.redis_pool.sadd("allnames",i)
                    #         print(i, "执行成功")
                    #     except Exception as e:
                    #         print(e.args)

    def run(self):
        self.executeTxt()

if __name__ == "__main__":
    name="companyInfo"
    match = "*"
    count = 10000
    filename = "E:\DataPractice\companySQL\companys.sql"
    r = RedisDataToMysql(name,match,count,filename)
    r.run()