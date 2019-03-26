import json
import requests
from requests.exceptions import ConnectionError
from cookie_pool import *
from generator import *
import useragent
import getproxy
from multiprocessing import Process, Queue
from requests.packages.urllib3.exceptions import InsecureRequestWarning # 禁用安全请求警告
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

class ValidTester(object):
    def __init__(self, website='default'):
        self.website = website
        self.cookies_db = RedisClient('cookies', self.website)
        self.accounts_db = RedisClient('accounts', self.website)
        self.headers={
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Host": "www.tianyancha.com",
            "Referer" : "https://www.tianyancha.com",
            "User-Agent" : useragent.get_useragent(),
        }
    def test(self, username, cookies):
        raise NotImplementedError
    def run(self):
        cookies_groups = self.cookies_db.all()
        gener = WeiboCookiesGenerator()
        gener.run()
        # self.proxy = getproxy.get_proxy()
        for username, cookies in cookies_groups.items():
            self.test(username, cookies)
class WeiboValidTester(ValidTester):
    def __init__(self, website='tyc'):
        ValidTester.__init__(self, website)

    def test(self, username, cookies):
        print('正在测试Cookies', '用户名', username)
        try:
            test_url = "https://www.tianyancha.com/search"
            self.headers['Cookie'] = cookies
            response = requests.get(url=test_url, headers=self.headers, timeout=15, verify=False)
            if response.url == test_url:
                # print('Cookies有效', username)
                pass
            else:
                print('Cookies失效,删除 %s Cookies' % username)
                self.cookies_db.delete(username)
        except ConnectionError as e:
            print('发生异常', e.args)


if __name__ == '__main__':
    WeiboValidTester().run()