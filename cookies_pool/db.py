import random
import redis
from config import  *


class RedisClient(object):

    def __init__(self,type,website,host=REDIS_HOST,port=REDIS_PORT,password=REDIS_PASSWORD,db=REDIS_DB):
        '''

        :param type: 储存redis的数据所属类型
        :param website: 所要获取cookie的站点名
        :param host: redis链接地址 默认为127.0.0.1
        :param port: redis端口 默认为6379
        :param password: 链接redis密码，默认为空
        '''
        self.db = redis.StrictRedis(host=host,port=port,password=password,db=db,decode_responses=True)
        self.type = type
        self.website = website

    def name(self):
        '''
        :return: redis 储存的数据键名
        '''

        return "{type}:{website}".format(type=self.type,website=self.website)

    def set(self,username,value):
        '''
        :param username: 用户名
        :param value: 用户密码或者cookie值
        :return: 设置成功与否结果
        '''
        return self.db.hset(self.name(),username,value)

    def get(self,username):
        '''
        :param username: 用户名
        :return:
        '''
        return self.db.hget(self.name(),username)

    def delete(self,username):
        '''
        :param username: 用户名
        :return:
        '''
        return self.db.hdel(self.name(),username)

    def count(self):
        '''
        :return:
        '''
        return self.db.hlen(self.name())

    def random(self):
        '''
        :return:
        '''
        return random.choice(self.db.hvals(self.name()))

    def all_username(self):
        '''
        :return:
        '''
        return self.db.hkeys(self.name())

    def all(self):
        '''
        :return:
        '''
        return self.db.hgetall(self.name())


if __name__ == "__main__":
    conn = RedisClient("cookies","tyc")
    result =  conn.all_username()
    print(result)