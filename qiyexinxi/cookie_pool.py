import random
import redis

class RedisClient(object):
    def __init__(self,type,website):
        """
        初始化Redis连接
        :param host: 地址
        :param port: 端口
        :param password: 密码
        """
        # Redis数据库地址
        self.REDIS_HOST = 'localhost'
        # Redis端口
        self.REDIS_PORT = 6379
        # Redis密码，如无填None
        self.REDIS_PASSWORD = ''
        # 选择库默认0
        self.REDIS_DB = 0
        self.type = type
        #站点名称,默认None
        self.website = website
        self.db = redis.StrictRedis(host=self.REDIS_HOST, port=self.REDIS_PORT, password=self.REDIS_PASSWORD,db=self.REDIS_DB, decode_responses=True)

    def name(self):
        """
        获取Hash的名称
        :return: Hash名称
        """
        return "{type}:{website}".format(type=self.type, website=self.website)

    def set(self, username, value):
        """
        设置键值对
        :param username: 用户名
        :param value: 密码或Cookies
        :return:
        """
        return self.db.hset(self.name(), username, value)

    def get(self, username):
        """
        根据键名获取键值
        :param username: 用户名
        :return:
        """
        return self.db.hget(self.name(), username)

    def delete(self, username):
        """
        根据键名删除键值对
        :param username: 用户名
        :return: 删除结果
        """
        return self.db.hdel(self.name(), username)

    def count(self):
        """
        获取数目
        :return: 数目
        """
        return self.db.hlen(self.name())

    def random(self):
        """
        随机得到键值，用于随机Cookies获取
        :return: 随机Cookies
        """
        return random.choice(self.db.hvals(self.name()))

    def usernames(self):
        """
        获取所有账户信息
        :return: 所有用户名
        """
        return self.db.hkeys(self.name())

    def all(self):
        """
        获取所有键值对
        :return: 用户名和密码或Cookies的映射表
        """
        return self.db.hgetall(self.name())
if __name__ == '__main__':
    conn = RedisClient('accounts','tyc')
    user_list =[
        13636127094,18272140954,13704353405,13689660614,15282852214,15282853847,15754489731,15948474905,15700428967,15715318960,
        13126764065,13261394749,13261824964,13261879474,13269088341,18331377002,19831344680,19831354133,18771581707,17192070438,
        15297369342,18303136141,15708947511,15700427050,17087353017,17088594603,15284825470,15124444170,13126710124,13126769924,
        13261374825,13261826453,13261895614,18771634199,18272457264,15143507684,15073876104,15115840041,15948427184,13689637480,
        13689654247,15883448987,18331342529,13400314638,15597783007,17097161241,17002937693,17122565408,13463880130,18478205258,
        17127035643,18408299223,13730454228,15043554864,18843507914,15948422934,15981132154,13463982622,13483420267,13467380458,
        15073866564,15273895540,18780141971,17138731745,15731342402,18281045421,13657460140,13843539524,15844505714,17087883460,
        17162733441,17124273370,17136624642,15700415107,17161352843,15706593114,17847554140,13024304410,15981136694,13521407973,
        13261872454,18560851907,15754489910,15886287684,18428330047,13483118976,13890829143,17137567241,13843539924,13843585648,
        13943407465,15636506925,17150802361,17130349496,15708976429,17128704674,17129120974,17129268496,17165220854,17165221429
    ]
    for user in user_list:
        result = conn.set(user, 'hyc644691334')
