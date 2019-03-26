import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from cookie_pool import RedisClient

class CookiesGenerator(object):
    def __init__(self, website='default'):
        """
        父类, 初始化一些对象
        :param website: 名称
        :param browser: 浏览器, 若不使用浏览器则可设置为 None
        """
        self.website = website
        self.cookies_db = RedisClient('cookies',self.website)
        self.accounts_db = RedisClient('accounts',self.website)
        self.login_url="https://www.tianyancha.com/login?from=https://www.tianyancha.com/search?key="
        self.init_browser()

    def __del__(self):
        self.close()

    def init_browser(self):
        """
        通过browser参数初始化全局浏览器供模拟登录使用
        :return:
        """
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        self.browser = webdriver.Chrome(chrome_options=chrome_options, executable_path='C:\python3.6.6\chromedriver.exe')
        # self.browser = webdriver.Chrome()
    def process_cookies(self, cookies):
        """
        处理Cookies
        :param cookies:
        :return:
        """
        cookie_txt = ""
        for cookie in cookies:
            cookie_txt += "%s=%s; " % (cookie['name'],cookie['value'])
        return cookie_txt

    def run(self):
        """
        运行, 得到所有账户, 然后顺次模拟登录
        :return:
        """
        accounts_usernames = self.accounts_db.usernames()
        cookies_usernames = self.cookies_db.usernames()
        for username in accounts_usernames:
            if not username in cookies_usernames:
                self.user = username
                password = self.accounts_db.get(username)
                # print('正在生成Cookies', '账号', username)
                self.browser.get(self.login_url)
                self.browser.implicitly_wait(4)
                username = self.browser.find_elements_by_class_name("contactphone")[1].send_keys(username)
                time.sleep(1)
                password = self.browser.find_elements_by_class_name("contactword")[1].send_keys(password)
                time.sleep(1)
                button = self.browser.find_elements_by_class_name("login_btn")[1].click()
                time.sleep(1)
                cookies = self.browser.get_cookies()
                # 成功获取
                if "https://www.tianyancha.com/search" == self.browser.current_url:
                    get_cookie = self.process_cookies(cookies)
                    # print('成功获取到Cookies')
                    if self.cookies_db.set(self.user,get_cookie):
                        print('%s Cookies获取成功' % self.user)
                # 没有获取到cookie
                else:
                    print("=========== %s 用户,没有获取到cookies" % self.user)
        else:
            print('所有账号都已经成功获取Cookies')

    def close(self):
        """
        关闭
        :return:
        """
        try:
            print('Closing Browser')
            self.browser.close()
            del self.browser
        except TypeError:
            print('Browser not opened')


class WeiboCookiesGenerator(CookiesGenerator):
    def __init__(self, website='tyc'):
        """
        初始化操作
        :param website: 站点名称
        :param browser: 使用的浏览器
        """
        CookiesGenerator.__init__(self, website)
        self.website = website

    def new_cookies(self, username, password):
        """
        生成Cookies
        :param username: 用户名
        :param password: 密码
        :return: 用户名和Cookies
        """
        return WeiboCookies(username, password, self.browser).main()


if __name__ == '__main__':
    generator = WeiboCookiesGenerator()
    generator.run()
    # cookies=[{'domain': 'www.tianyancha.com', 'httpOnly': True, 'name': 'aliyungf_tc', 'path': '/', 'secure': False, 'value': 'AQAAAEvo1HzJXwkAojfsc+02Rk+CfOkT'}, {'domain': '.tianyancha.com', 'expiry': 1542351938, 'httpOnly': False, 'name': '_gid', 'path': '/', 'secure': False, 'value': 'GA1.2.1619079770.1542265538'}, {'domain': '.tianyancha.com', 'expiry': 1605337538, 'httpOnly': False, 'name': '_ga', 'path': '/', 'secure': False, 'value': 'GA1.2.51400837.1542265538'}, {'domain': 'www.tianyancha.com', 'httpOnly': False, 'name': 'csrfToken', 'path': '/', 'secure': True, 'value': 'l6Zw86hiZbiUEkYFMKq1wcXT'}, {'domain': '.tianyancha.com', 'expiry': 1605337536.692803, 'httpOnly': True, 'name': 'TYCID', 'path': '/', 'secure': False, 'value': '0e8f99a0e8a511e8b4402db6476da592'}, {'domain': '.tianyancha.com', 'expiry': 1542265598, 'httpOnly': False, 'name': '_gat_gtag_UA_123487620_1', 'path': '/', 'secure': False, 'value': '1'}, {'domain': '.tianyancha.com', 'httpOnly': False, 'name': 'Hm_lpvt_e92c8d65d92d534b0fc290df538b4758', 'path': '/', 'secure': False, 'value': '1542265538'}, {'domain': '.tianyancha.com', 'expiry': 1605337536.69283, 'httpOnly': True, 'name': 'undefined', 'path': '/', 'secure': False, 'value': '0e8f99a0e8a511e8b4402db6476da592'}, {'domain': '.tianyancha.com', 'expiry': 1573801537, 'httpOnly': False, 'name': 'Hm_lvt_e92c8d65d92d534b0fc290df538b4758', 'path': '/', 'secure': False, 'value': '1542265538'}, {'domain': '.tianyancha.com', 'expiry': 2145942338, 'httpOnly': False, 'name': 'ssuid', 'path': '/', 'secure': False, 'value': '8223323546'}, {'domain': '.tianyancha.com', 'expiry': 1542870340, 'httpOnly': False, 'name': 'tyc-user-info', 'path': '/', 'secure': False, 'value': '%257B%2522myQuestionCount%2522%253A%25220%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522monitorUnreadCount%2522%253A%25225%2522%252C%2522discussCommendCount%2522%253A%25220%2522%252C%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzYzNjEyNzA5NCIsImlhdCI6MTU0MjI2NTYyNywiZXhwIjoxNTU3ODE3NjI3fQ.eQRwEKmroiIWgEu0XWqyDKDUNlvvycWtRwD3HuKQDIp071EJUWJYPdc1DnQWyh6rXk9u5EjE9qVTy-_Maf_L8A%2522%252C%2522redPoint%2522%253A%25220%2522%252C%2522pleaseAnswerCount%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522bizCardUnread%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213636127094%2522%257D'}, {'domain': '.tianyancha.com', 'expiry': 1542870340, 'httpOnly': False, 'name': 'auth_token', 'path': '/', 'secure': False, 'value': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzYzNjEyNzA5NCIsImlhdCI6MTU0MjI2NTYyNywiZXhwIjoxNTU3ODE3NjI3fQ.eQRwEKmroiIWgEu0XWqyDKDUNlvvycWtRwD3HuKQDIp071EJUWJYPdc1DnQWyh6rXk9u5EjE9qVTy-_Maf_L8A'}]
    # generator.process_cookies(cookies=cookies)