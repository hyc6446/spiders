#REDIS配置项
#地址
REDIS_HOST = "127.0.0.1"

#端口
REDIS_PORT = 6379

#密码
REDIS_PASSWORD = ""

#数据库
REDIS_DB = 0

#API配置项

#api地址
API_HOST = "0.0.0.0"

#api端口
API_PORT = 5000

#生成器配置项
#生成器类
GENERATOR_MAP = {
    'tyc' : "TycCookieGenerator"
}
#生成Cookies测试地址
GENERATOR_URL_MAP = {
    "tyc" : "https://www.tianyancha.com/login?from=https://www.tianyancha.com/search"
}


#测试类配置项
#测试类
CHECKER_MAP = {
    'tyc' : "TycValidChecker"
}

#测试Cookies可用性地址
CHECKER_URL_MAP = {
    "tyc" : "https://www.tianyancha.com/search?key=%E7%99%BE%E5%BA%A6"
}

#生成COOKIE的浏览器
BROWSER_TYPE = "Chrome"

#验证时间
CYCLE = 300


GENERATOR_CYCLE = 1800
#调度器配置项
#生成器开关
GENERATOR_PROCESS = False
#验证器开关
CHECKER_PROCESS = True
#api接口开关
API_PROCESS = True


