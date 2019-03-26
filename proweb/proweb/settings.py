# -*- coding: utf-8 -*-

# Scrapy settings for proweb project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://doc.scrapy.org/en/latest/topics/settings.html
#     https://doc.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://doc.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = 'proweb'

SPIDER_MODULES = ['proweb.spiders']
NEWSPIDER_MODULE = 'proweb.spiders'


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'proweb (+http://www.yourdomain.com)'

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
CONCURRENT_REQUESTS = 32

# Configure a delay for requests for the same website (default: 0)
# See https://doc.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
# CONCURRENT_REQUESTS_PER_IP = 40

# Disable cookies (enabled by default)
COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
DEFAULT_REQUEST_HEADERS = {
   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
   "Accept-Language": "zh-CN,zh;q=0.9",
   "Host": "www.tianyancha.com",
   "Referer": "https://www.tianyancha.com",

}

# Enable or disable spider middlewares
# See https://doc.scrapy.org/en/latest/topics/spider-middleware.html
# SPIDER_MIDDLEWARES = {
#    'proweb.middlewares.ProwebSpiderMiddleware': 543,
# }

# Enable or disable downloader middlewares
# See https://doc.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
   # 'proweb.middlewares.UserAgentmiddleware': 200,
   'proweb.middlewares.CookiesMiddleware': 300,
}

# Enable or disable extensions
# See https://doc.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    'scrapy.extensions.telnet.TelnetConsole': None,
#}

# Configure item pipelines
# See https://doc.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
   'proweb.pipelines.ProwebPipeline': 300,
   # 'scrapy_redis.pipelines.RedisPipeline': 400
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://doc.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://doc.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = 'httpcache'
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'

# # 启用Redis调度存储请求队列
# SCHEDULER = "scrapy_redis.scheduler.Scheduler"
# #确保所有的爬虫通过Redis去重
# DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"
# # 在redis中保持scrapy-redis用到的队列，不会清理redis中的队列，从而可以实现暂停和恢复的功能。
# SCHEDULER_PERSIST = True
#
# #指定连接到redis时使用的端口和地址（可选）
# REDIS_HOST = '127.0.0.1'
# REDIS_PORT = 6379
# REDIS_PASSWORD = ""

#允许通过的错误状态码
HTTPERROR_ALLOWED_CODES = [301,302,400,403,404,503]
#重试状态码
RETRY_HTTP_CODES = [401, 408, 414, 500, 502, 504]

#获取随机cookies的路径
GET_COOKIES_URL = "http://127.0.0.1:5000/tyc/random"

#MySQL配置项
#地址
MYSQL_HOST = '127.0.0.1'
#端口
MYSQL_PORT = 3306
#链接的用户名
MYSQL_USER = 'root'
#链接的密码
MYSQL_PASSWORD = '123456'
#选择的数据库
MYSQL_DB = 'tianyancha_datas'


#REDIS配置项
#地址
REDIS_HOST = '127.0.0.1'
#端口
REDIS_PORT = 6379
#密码
REDIS_PASSWORD=''
#选择数据库
REDIS_DB = 3
#REDIS遍历数据设置
NAME = "allnames"
#匹配规则
PATTERN = None
#每次获取的数量
COUNT = 20

#同时运行配置
COMMANDS_MODULE = 'proweb.commands'