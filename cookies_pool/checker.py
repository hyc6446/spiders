import json
import time
import random
import requests
from requests.exceptions import ConnectionError
from db import *
from useragent import agents
from requests.packages.urllib3.exceptions import InsecureRequestWarning # 禁用安全请求警告
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
#检测cookie是否可用的父类
class ValidChecker(object):

    def __init__(self,website='default'):
        '''
        :param website:
        '''
        self.website = website
        self.accounts_db = RedisClient('accounts',self.website)
        self.cookies_db = RedisClient('cookies',self.website)
        self.invalid_db = RedisClient("invalid",self.website)     
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Host": "www.tianyancha.com",
            "Referer": "https://www.tianyancha.com",
            "User-Agent": random.choice(agents),
        }


    def test(self,username,cookies):
        '''
        检测cookie可用性
        :return:
        '''
        raise NotImplementedError

    def run(self):
        '''
        运行主程序
        :return:
        '''
        cookies_groups = self.cookies_db.all()
        for username,cookies in cookies_groups.items():
            self.test(username,cookies)
        print("当前可用Cookies %s 个" % self.cookies_db.count())

class TycValidChecker(ValidChecker):

    def __init__(self,website='tyc'):
        '''
        初始化父类对象
        :param website:
        '''
        ValidChecker.__init__(self,website)

    def test(self,username,cookies):
        '''
        项目的检测接口
        :param username:
        :param cookies:
        :return:
        '''
        check_url = CHECKER_URL_MAP[self.website]
        
        try:
            self.headers['Cookie'] = cookies
            proxy_list = ['183.129.207.70:16230', '183.129.207.70:16428', '183.129.207.70:15507', '183.129.207.70:15992', '183.129.207.70:15323', '183.129.207.70:15377', '183.129.207.70:16850', '183.129.207.70:19705', '183.129.207.70:19444', '183.129.207.70:16660']
            proxies = {"https":random.choice(proxy_list)}
            response = requests.get(url=check_url,headers=self.headers,timeout=15, allow_redirects=False,verify=False)
            if "天眼查为你找到" in response.text:
                 print('%s Cookies可用'%username)
            else:
                self.cookies_db.delete(username)
                print('%s Cookies失效！已从Cookies池删除' % username)               
        except Exception as e:
            print('发生异常%s' % e.args)


if __name__ == "__main__":
    validchecker = TycValidChecker(website='tyc')
    try:
        result = validchecker.run()
    except Exception as e:
        print(e.args)