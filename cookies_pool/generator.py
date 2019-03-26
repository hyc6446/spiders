import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from config import *
from db import *


class CookieGenerator(object):

    def __init__(self,website):
        '''
        初始化对象
        :param website:
        '''
        self.website = website
        self.cookies_db = RedisClient("cookies",self.website)
        self.accounts_db = RedisClient("accounts",self.website)
        self.invalid_db = RedisClient("invalid",self.website)
        self.check_browser()


    def __del__(self):
        self.close()

    def check_browser(self):
        if BROWSER_TYPE == "Chrome":
            # chrome_options = Options()
            # chrome_options.add_argument('--headless')
            # self.browser = webdriver.Chrome(chrome_options=chrome_options, executable_path='C:\python3.6.6\chromedriver.exe')
            self.browser = webdriver.Chrome()
            # self.browser = webdriver.Firefox()
            # self.browser.maximize_window()

    def new_cookies(self,username,password):
        '''
        :param username:
        :param password:
        :return:
        '''

        raise NotImplementedError

    def process_cookies(self,cookies):
        '''
        处理cookies，获得正确格式
        :param cookies:
        :return:
        '''
        cookie_txt = ""
        for cookie in cookies:
            cookie_txt += "%s=%s; " % (cookie['name'], cookie['value'])
        # print(cookie_txt)
        return cookie_txt

    def run(self):
        '''
        获取到所有用户和密码，然后模拟登录
        :return:
        '''
        accounts_username = self.accounts_db.all_username()
        cookies_username = self.cookies_db.all_username()
        for username in accounts_username:
            if not username in cookies_username:
                self.user = username
                password = self.accounts_db.get(username)
                result = self.new_cookies(username,password)
                if result.get('status') == 1:
                    get_cookie = result.get('cookies')
                    if self.cookies_db.set(self.user, get_cookie):
                        # self.invalid_db.delete(username)
                        print("%s 获取成功" % self.user)
                else:
                    print("%s =========获取失败=======" % self.user)
                    # self.invalid_db.set(self.user,"已失效")

        else:
            print("所有账号都完成获取cookies！")


    def close(self):
        '''
        关闭浏览器
        :return:
        '''
        try:
            print('Closing Browser')
            self.browser.close()
            del self.browser
        except TypeError:
            print('Browser not opened')

    def find_element(self,locator, timeout=10):
        try:
            WebDriverWait(self.browser, timeout).until(EC.visibility_of_element_located((By.XPATH, locator)))
            return True
        except TimeoutException as e:
            print(e)

class TycCookieGenerator(CookieGenerator):

    def __init__(self,website="tyc"):
        '''
        初始化父类对象
        '''
        CookieGenerator.__init__(self,website)
        self.website = website

    def new_cookies(self,username,password='hyc644691334'):
        '''
        :param username:
        :param password:
        :return:
        '''
        login_url = GENERATOR_URL_MAP[self.website]
        self.browser.delete_all_cookies()
        self.browser.get(login_url)
        self.browser.implicitly_wait(10)
        if self.find_element("//div[contains(@class,'text-center')]/div[2]"):
            time.sleep(1)
            self.browser.find_element_by_xpath("//div[contains(@class,'text-center')]/div[2]").click()
            time.sleep(1)
            self.browser.find_element_by_css_selector("div.mobile_box div.position-rel>input.contactphone").send_keys(username)
            time.sleep(1)
            self.browser.find_element_by_css_selector("div.mobile_box div.input-warp>input.contactword").send_keys(password)
            time.sleep(1)
            self.browser.find_element_by_css_selector("div.mobile_box div.btn-primary").click()
            time.sleep(2)
        else:
            print("获取元素失败")

        if "https://www.tianyancha.com/search" == self.browser.current_url:
            cookies = self.browser.get_cookies()
            get_cookie = self.process_cookies(cookies)
            return {"status": 1, "cookies": get_cookie}
        else:
            return {"status": 2}
    



if __name__ == "__main__":
    generator = TycCookieGenerator(website='tyc')
    generator.run()