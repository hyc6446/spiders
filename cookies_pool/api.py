from flask import Flask,g
from config import *
from db import *


__all__ = ['app']
app = Flask(__name__)

@app.route("/")

def index():

    return "Cookies池,首页面"

def get_conn():
    '''
    :return:
    '''
    for website in GENERATOR_MAP:
        # print(website)
        if not hasattr(g,website):# RedisClient('accounts', 'weibo')
            setattr(g,website + "_cookies",eval("RedisClient('cookies','" + website + "')"))
            setattr(g,website + "_accounts",eval("RedisClient('accounts','" + website + "')"))

    return g

# @app.route()

@app.route("/<website>/random")
def random(website):
    '''

    :param website: Cookie的所属站点
    :return: 返回随机的Cookie
    '''

    g = get_conn()
    cookies = getattr(g,website + "_cookies").random()
    return cookies

@app.route("/<website>/count")
def count(website):
    '''

    :param website:
    :return: Cookies的数量
    '''
    g = get_conn()
    count = getattr(g,website + "_cookies").count()
    return str(count)


if __name__ == "__main__":
    app.run(host="0.0.0.0")
