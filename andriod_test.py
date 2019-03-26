# -*- coding:utf-8 -*-
import os, time, unittest
import selenium
from appium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
PATH = lambda p:os.path.abspath(os.path.join(os.path.dirname(__file__),p))

class AppiumGetInfo(object):
    def __init__(self):
        self.desired_caps = {}

        #天眼查
        self.desired_caps['platformName'] = 'Android'  # 设备系统
        self.desired_caps['deviceName'] = '54960edf'  # 设备名称
        self.desired_caps['platformVersion'] = '5.1.1'
        self.desired_caps['newCommandTimeout'] = 300
        self.desired_caps['app'] = PATH(r"D:\appium\base.apk")
        self.desired_caps['appPackage'] = 'com.tianyancha.skyeyequery'
        self.desired_caps['appActivity'] = 'com.tianyancha.skyeyequery.SplashPage'
        # #抖音
        # self.desired_caps['platformName'] = 'Android'  # 设备系统
        # self.desired_caps['deviceName'] = '127.0.0.1:7555'  # 设备名称
        # self.desired_caps['platformVersion'] = '6.0.1'
        # self.desired_caps['newCommandTimeout'] = 300
        # self.desired_caps['app'] = PATH(r"D:\appium\douyin.apk")
        # self.desired_caps['appPackage'] = 'com.ss.android.ugc.aweme'
        # self.desired_caps['appActivity'] = 'com.ss.android.ugc.aweme.app.AdsAppActivity'
        # #快手
        # self.desired_caps['platformName'] = 'Android'  # 设备系统
        # self.desired_caps['deviceName'] = '127.0.0.1:7555'  # 设备名称
        # self.desired_caps['platformVersion'] = '6.0.1'
        # self.desired_caps['newCommandTimeout'] = 300
        # self.desired_caps['app'] = PATH(r"D:\appium\kuaishou.apk")
        # self.desired_caps['appPackage'] = 'com.smile.gifmaker'
        # self.desired_caps['appActivity'] = 'com.yxcorp.gifshow.HomeActivity'
        # #快手
        # self.desired_caps['platformName'] = 'Android'  # 设备系统
        # self.desired_caps['deviceName'] = '127.0.0.1:7555'  # 设备名称
        # self.desired_caps['platformVersion'] = '6.0.1'
        # self.desired_caps['newCommandTimeout'] = 300
        # self.desired_caps['app'] = PATH(r"D:\appium\kuaishou.apk")
        # self.desired_caps['appPackage'] = 'com.smile.gifmaker'
        # self.desired_caps['appActivity'] = 'com.yxcorp.gifshow.HomeActivity'

        self.desired_caps['noReset'] = 'True'
        self.desired_caps['noSign'] = 'True'
        self.desired_caps['unicodeKeyboard'] = 'True'
        self.desired_caps['resetKeyboard'] = 'True'
        self.driver = webdriver.Remote("http://localhost:4723/wd/hub", self.desired_caps)
    #登录模块

    #android:id/button1
    #com.tianyancha.skyeyequery:id/sv_hotcase
    #com.tianyancha.skyeyequery:id/nonet_view
    def run(self):
        driver = self.driver
        if self.check_element(driver,"android:id/button1"):
            driver.find_element_by_id("android:id/button1").click()
            print("点击过了")
        if self.check_element(driver,"com.tianyancha.skyeyequery:id/sv_hotcase"):
            time.sleep(60)
            self.swipeUp(1000)
            if self.driver.find_element_by_android_uiautomator('new UiSelector().text("查看更多")'):
                self.driver.find_element_by_android_uiautomator('new UiSelector().text("查看更多")').click()
                time.sleep(2)
                while True:
                    print("点击了获取授权码")
                    self.tap(sleeptime=200)
    def swipe(self,t,sleepTime):
        while True:
            self.swipeUp(t)
            print("滑动ing...")
            time.sleep(sleepTime)

    #判断页面元素是否存在
    def check_element(self,driver,id):
        try:
            WebDriverWait(driver,30).until(lambda driver: driver.find_element_by_id(id).is_displayed())
            return True
        except selenium.common.exceptions.TimeoutException:
            print("超时")
            return False
        except Exception as e:
            return False

    #判断页面元素是否存在滑动
    def findLocal(self,ele):
        x =False
        while not x:
            if not self.fact(ele):
                self.swipeUp(500)
                time.sleep(0.5)
                self.fact(ele)
            else:
                print("找到元素")
                x = True
                return True
    #递归查找元素
    def fact(self,ele):
        try:
            self.driver.find_element_by_android_uiautomator(ele)
            return True
        except Exception as e:
            return False

    #获取窗口大小
    def getWindowSize(self):
        x = self.driver.get_window_size()['width']
        y = self.driver.get_window_size()['height']
        return (x,y)

    #向上滑动窗口
    def swipeUp(self,t,n=3):
        l = self.getWindowSize()
        x1 = int(l[0] * 0.5)
        y1 = int(l[1] * 0.9)
        y2 = int(l[1] * 0.25)
        for i in range(n):
            self.driver.swipe(x1,y1,x1,y2,t)
            time.sleep(2)
    #向下滑动窗口
    def swipeDown(self,t):
        l = self.getWindowSize()
        x1 = int(l[0] * 0.5)
        y1 = int(l[1] * 0.6)
        y2 = int(l[1] * 0.9)
        # y1 = 700
        # y2 = 1000
        self.driver.swipe(x1,y1,x1,y2,t)

    #点击
    def tap(self,sleeptime):
        self.driver.tap([(234, 324), (438, 561)], 500)
        time.sleep(sleeptime)

if __name__ == "__main__":
    a=AppiumGetInfo()
    a.run()
# cookies = driver.get_cookies()
# print(cookies)


