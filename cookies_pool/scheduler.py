import time
from db import  *
from api import  *
from generator import *
from checker import *
from multiprocessing import Process


#Cookies池调度器
class Scheduler(object):
    @staticmethod
    def valid_cookies(cycle=CYCLE):
        while True:
            try:
                for website ,cls in CHECKER_MAP.items():
                    tester = eval(cls + "(website='"+website+"')")
                    tester.run()
                    print('检测完毕，删除当前对象')
                    del tester
                    time.sleep(cycle)
            except Exception as e:
                print("发生异常 %s" % e.args)

    @staticmethod
    def generator(cycle=GENERATOR_CYCLE):
        while True:
            try:
                for website,cls in GENERATOR_MAP.items():
                    gener = eval(cls + "(website='"+website+"')")
                    gener.run()
                    # gener.close()
                    del gener
                    time.sleep(cycle)
            except Exception as e:
                print("发生异常 %s" % e.args)

    @staticmethod
    def api(cycle=CYCLE):
        app.run(host=API_HOST,port=API_PORT)


    def run(self):
        # if self.cookies_db.count() < 30:
        #     GENERATOR_PROCESS = True
        #     CHECKER_PROCESS = False

        if API_PROCESS:
            api_process = Process(target=Scheduler.api)
            api_process.start()

        if CHECKER_PROCESS:
            checker_process = Process(target=Scheduler.valid_cookies)
            checker_process.start()

        if GENERATOR_PROCESS:
            generator_process = Process(target=Scheduler.generator)
            generator_process.start()


if __name__ == '__main__':
    scheduler = Scheduler()
    scheduler.run()


