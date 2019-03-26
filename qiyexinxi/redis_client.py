import requests
import math
import re
import time
import json
import pymysql
import random
import useragent
from cookie_pool import *
from hashlib import sha1
from lxml import etree
from redis import Redis
from requests.packages.urllib3.exceptions import InsecureRequestWarning # 禁用安全请求警告
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
redis_db = Redis(host='127.0.0.1', port=6379, db=1) #连接redis
class SelectMysql(object):
    def __init__(self):
        self.db = pymysql.connect(host='localhost',user='root',password='123456',port=3306,db='tianyancha_datas',charset='utf8')
        self.cursor = self.db.cursor()
    #每次开始爬取的数量
    def select_sql(self,id=0):
        if redis_db.zcard ("sign_id"):
            id = redis_db.zscore("sign_id","id")
        sql = "select id,href from fenlei where id >%s and status=0 order by id limit 100"%id
        self.cursor.execute(sql)
        result = self.cursor.fetchall()
        return result
    #插入数据
    def insert_sql(self,**kw):
        # sql = "insert into tyc_aaa_company() values ('%s','%s','%s','%s')"%(kw['company_name'],kw['company_id'],kw['company_phone'],kw['company_email'])
        sql = "insert into tyc_base_info(com_name,history_name,company_id,phone,email,com_status,gswz,gsdz,gsjj,gxsj,gsfr,zczb,zcrq,gszch,zzjgdm,shxydm,gslx,nsrsbm,hangye,yyqx,nsrzz,rygm,sjzb,djjg,cbrs,ywmc,jyfw,nums) " \
              'values("{com_name}","{history_name}","{company_id}","{phone}","{email}","{com_status}","{gswz}","{gsdz}","{gsjj}","{gxsj}","{gsfr}","{zczb}","{zcrq}","{gszch}","{zzjgdm}","{shxydm}","{gslx}","{nsrsbm}","{hangye}","{yyqx}","{nsrzz}","{rygm}","{sjzb}","{djjg}","{cbrs}","{ywmc}","{jyfw}","{nums}")'.format(**kw)
        try:
            self.cursor.execute(sql)
            self.db.commit()
            print("添加成功")
            return True
        except:
            self.db.rollback()
            return False
    #更新标志位
    def update_sql(self,id):
        sql="update fenlei set status = 1 where id=%s"%id
        self.cursor.execute(sql)
        self.db.commit()
    def __del__(self):
        self.db.close()
s = SelectMysql()
class Getinfo(object):
    sha1 = sha1()
    cookies_db = RedisClient('cookies','tyc')
    headers={
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Host": "www.tianyancha.com",
        "Referer" : "https://www.tianyancha.com/search",
    }
    def get_html(self):
        urls = s.select_sql()
        for url in urls:
            try:
                self.headers["User-Agent"] = useragent.get_useragent()
                self.headers["Cookie"] = self.cookies_db.random()
                response= requests.get(url[1],headers=self.headers,timeout=10, verify=False)
                time.sleep(2)
                sign_id = url[0]
                print(response.url)
                if ("我们只是确认一下你不是机器人" or "404")in response.text or "antirobot" in response.url or "login" in response.url:
                    print("获取列表页面,出现验证码")
                    proxy = self.getproxy()
                    # print(proxy)
                    self.get_html()
                else:
                    res_html = etree.HTML(response.text)
                    total = res_html.xpath("//span[@class='tips-num']//text()")[0].strip("+") if res_html.xpath("//span[@class='tips-num']//text()") else "0"
                    if total:
                        if int(total) > 100:
                            self.set_href(url[1],6,sign_id)
                        elif 20 < int(total) < 100:
                            num = math.ceil(int(total) / 20) + 1
                            self.set_href(url[1],num,sign_id)
                        elif 0< int(total) <= 20:
                            self.set_href(url[1], 2,sign_id)
                        else:
                            s.update_sql(sign_id)
                    else:
                        s.update_sql(sign_id)
                        print("没有匹配的内容")
            except Exception as e:
                print(e)
    #拼接url页码(非vip会员只能浏览最多5页)
    def set_href(self,href,num,sign_id):
        root = href.split("?")
        for i in range(1,num):
            page_href = root[0] + "/p%s?" % i + root[1]
            self.get_company_info(page_href,sign_id)
    #获取代理
    def getproxy(self):
        url = "http://www.xiongmaodaili.com/xiongmao-web/api/glip?secret=84a3bf510ff537a9e3a0479dba73b8a6&orderNo=GL20180901182010xb09B4Qs&count=1&isTxt=1&proxyType=1"
        proxy_txt = requests.get(url).text.replace("\r\n","")
        proxy = {
            "https":proxy_txt
        }
        return proxy
    #获取每页的公司id
    def get_company_info(self,url,sign_id=1,proxy=None):
        self.headers["User-Agent"] = useragent.get_useragent()
        self.headers["Cookie"] = self.cookies_db.random()
        time.sleep(2)
        response = requests.get(url,headers=self.headers,timeout=10, verify=False)
        if ("我们只是确认一下你不是机器人" or "404") in response.text or "antirobot" in response.url:
            print("获取公司id信息出现验证码，更换账号")
            self.get_company_info(url,sign_id=1)
        else:
            res_html = etree.HTML(response.text)
            com_list = res_html.xpath("//div[@class='result-list']/div[@class='search-item']")
            for com in com_list:
                com_dict = {}
                href = com_dict['company_id'] = com.xpath("./div/div[2]/div[1]/a/@href")[0]
                com_dict['company_name'] = com.xpath("./div/div[2]/div[1]/a/text()")[0]
                com_dict['company_id'] = com.xpath("./div/div[2]/div[1]/a/@href")[0].split("/")[-1]
                com_dict['company_phone'] = com.xpath("./div/div[2]/div[3]/div[@class='col'][1]/script/text()")[0][1:-1].replace('"',"") if com.xpath("./div/div[2]/div[3]/div[@class='col'][1]/script/text()") else ""
                com_dict['company_email'] = com.xpath("./div/div[2]/div[3]/div[@class='col'][2]/span[2]//text()")[0] if com.xpath("./div/div[2]/div[3]/div[@class='col'][2]/span[2]//text()") else ""
                com_dict['zcrq'] = com.xpath("./div/div[2]/div[2]/div[contains(@class,title)][3]/span//text()")[0] if com.xpath("./div/div[2]/div[2]/div[contains(@class,title)][3]/span//text()") else ""
                self.sha1.update(com_dict['company_id'].encode("utf-8"))
                sha_company_id = self.sha1.hexdigest()
                if not redis_db.sismember("hascompany_id",sha_company_id):
                    self.company_content(href,kw=com_dict)
                else:
                    print("已储存")
            s.update_sql(sign_id)
            redis_db.zadd("sign_id","id",sign_id)
    #获取每个公司的基本信息
    def company_content(self,url,kw):
        self.headers["User-Agent"] = useragent.get_useragent()
        self.headers["Cookie"] = self.cookies_db.random()
        time.sleep(2)
        response = requests.get(url,headers=self.headers,timeout=10, verify=False)
        if ("我们只是确认一下你不是机器人" or "404") in response.text or "antirobot" in response.url:
            print("获取公司详情信息出现验证码，更换账号")
            self.company_content(url,kw)
        else:
            item = {}
            num_dict = {}
            response = etree.HTML(response.text)
            item['com_name'] = kw.get('company_name',"")
            item['company_id'] =kw.get('company_id',"")
            item['phone'] = kw.get('company_phone',"")
            item['email'] = kw.get('company_email',"")
            #注册日期
            item['zcrq'] = kw.get("zcrq","")
            item['history_name'] = response.xpath("//div[@class='history-content']/div/text()")[0] if response.xpath("//div[@class='history-content']/div/text()") else ""
            #公司网址
            item['gswz'] = response.xpath("//div[@id='company_web_top']/div[2]/div[2]/div[5]/div[@class='f0'][2]/div[1]/a[@class='company-link']/text()")[0] if response.xpath("//div[@id='company_web_top']/div[2]/div[2]/div[5]/div[@class='f0'][2]/div[1]/a[@class='company-link']/text()") else ""
            #公司简介
            item['gsjj'] = response.xpath("//div[@class='summary']/script//text()")[0].strip("\n ") if response.xpath("//div[@class='summary']/script//text()") else ""
            #更新时间
            item['gxsj'] = response.xpath("//span[@class='updatetimeComBox']/text()")[0] if response.xpath("//span[@class='updatetimeComBox']/text()") else ""
            #公司法人
            item['gsfr'] = response.xpath("//div[@class='humancompany']/div[@class='name']/a/text()")[0] if response.xpath("//div[@class='humancompany']/div[@class='name']/a/text()") else ""
            #当前状态
            item['com_status'] = response.xpath("//div[@id='_container_baseInfo']/table[@class='table']/tbody/tr[3]/td/div[2]/text()")[0] if response.xpath("//div[@id='_container_baseInfo']/table[@class='table']/tbody/tr[3]/td/div[2]/text()") else ""
            #注册资本
            item['zczb'] = response.xpath("//div[@id='_container_baseInfo']/table[1]/tbody/tr[1]/td[2]/div[2]/@title")[0] if response.xpath("//div[@id='_container_baseInfo']/table[1]/tbody/tr[1]/td[2]/div[2]/@title") else ""
            #工商注册号
            item['gszch'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[1]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[1]/td[2]/text()") else ""
            #组织机构代码
            item['zzjgdm'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[1]/td[4]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[1]/td[4]/text()") else ""
            #社会信用代码
            item['shxydm'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[2]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[2]/td[2]/text()") else ""
            #公司类型
            item['gslx'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[2]/td[4]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[2]/td[4]/text()") else ""
            #纳税人识别码
            item['nsrsbm'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[3]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[3]/td[2]/text()") else ""
            #行业
            item['hangye'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[3]/td[4]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[3]/td[4]/text()") else ""
            #营业期限
            item['yyqx'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[4]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[4]/td[2]/text()") else ""
            #纳税人资质
            item['nsrzz'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[5]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[5]/td[2]/text()") else ""
            #人员规模
            item['rygm'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[5]/td[4]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[5]/td[4]/text()") else ""
            #实缴资本
            item['sjzb'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[6]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[6]/td[2]/text()") else ""
            #登记机构
            item['djjg'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[6]/td[4]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[6]/td[4]/text()") else ""
            #参保人数
            item['cbrs'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[7]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[7]/td[2]/text()") else ""
            #英文名称
            item['ywmc'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[7]/td[4]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[7]/td[4]/text()") else ""
            #公司地址
            item['gsdz'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[8]/td[2]/text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[8]/td[2]/text()") else ""
            #经营范围
            item['jyfw'] = response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[9]/td[2]/span/span/span[2]//text()")[0] if response.xpath("//table[@class='table -striped-col -border-top-none']/tbody/tr[9]/td[2]/span/span/span[2]//text()") else ""
            num_dict['company_id'] = kw.get('company_id',"")
            num_dict['company_name'] = kw.get('company_name',"")
            num_dict['zyry_num'] = response.xpath("//div[@id='nav-main-staffCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-staffCount']/span[@class='data-count']/text()") else "0"
            num_dict['gdxx_num'] = response.xpath("//div[@id='nav-main-holderCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-holderCount']/span[@class='data-count']/text()") else "0"
            num_dict['dwtz_num'] = response.xpath("//div[@id='nav-main-inverstCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-inverstCount']/span[@class='data-count']/text()") else "0"
            num_dict['gsnb_year'] = response.xpath("//div[@class='report_item']/span[2]/text()") if response.xpath("//div[@class='report_item']/span[2]/text()") else "0"
            num_dict['bgjl_num'] = response.xpath("//div[@id='nav-main-changeCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-changeCount']/span[@class='data-count']/text()") else "0"
            num_dict['fzjg_num'] = response.xpath("//div[@id='nav-main-branchCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-branchCount']/span[@class='data-count']/text()") else "0"
            num_dict['ktgg_num'] = response.xpath("//div[@id='nav-main-announcementCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-announcementCount']/span[@class='data-count']/text()") else "0"
            num_dict['flss_num'] = response.xpath("//div[@id='nav-main-lawsuitCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-lawsuitCount']/span[@class='data-count']/text()") else "0"
            num_dict['fygg_num'] = response.xpath("//div[@id='nav-main-courtCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-courtCount']/span[@class='data-count']/text()") else "0"
            num_dict['jyyc_num'] = response.xpath("//div[@id='nav-main-abnormalCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-abnormalCount']/span[@class='data-count']/text()") else "0"
            num_dict['cqcz_num'] = response.xpath("//div[@id='nav-main-intellectualProperty']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-intellectualProperty']/span[@class='data-count']/text()") else "0"
            num_dict['rzls_num'] = response.xpath("//div[@id='nav-main-companyRongzi']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-companyRongzi']/span[@class='data-count']/text()") else "0"
            num_dict['hxtd_num'] = response.xpath("//div[@id='nav-main-companyTeammember']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-companyTeammember']/span[@class='data-count']/text()") else "0"
            num_dict['qyyw_num'] = response.xpath("//div[@id='nav-main-companyProduct']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-companyProduct']/span[@class='data-count']/text()") else "0"
            num_dict['tzsj_num'] = response.xpath("//div[@id='nav-main-jigouTzanli']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-jigouTzanli']/span[@class='data-count']/text()") else "0"
            num_dict['jpxx_num'] = response.xpath("//div[@id='nav-main-companyJingpin']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-companyJingpin']/span[@class='data-count']/text()") else "0"
            num_dict['swpj_num'] = response.xpath("//div[@id='nav-main-taxCreditCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-taxCreditCount']/span[@class='data-count']/text()") else "0"
            num_dict['ccjc_num'] = response.xpath("//div[@id='nav-main-checkCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-checkCount']/span[@class='data-count']/text()") else "0"
            num_dict['zzzs_num'] = response.xpath("//div[@id='nav-main-certificateCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-certificateCount']/span[@class='data-count']/text()") else "0"
            num_dict['ztbxx_num'] = response.xpath("//div[@id='nav-main-bidCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-bidCount']/span[@class='data-count']/text()") else "0"
            num_dict['cpxx_num'] = response.xpath("//div[@id='nav-main-productinfo']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-productinfo']/span[@class='data-count']/text()") else "0"
            num_dict['jckxx_num'] = response.xpath("//div[@id='nav-main-importAndExportCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-importAndExportCount']/span[@class='data-count']/text()") else "0"
            num_dict['zqxx_num'] = response.xpath("//div[@id='nav-main-bondCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-bondCount']/span[@class='data-count']/text()") else "0"
            num_dict['sbxx_num'] = response.xpath("//div[@id='nav-main-tmCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-tmCount']/span[@class='data-count']/text()") else "0"
            num_dict['zlxx_num'] = response.xpath("//div[@id='nav-main-patentCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-patentCount']/span[@class='data-count']/text()") else "0"
            num_dict['rjzzq_num'] = response.xpath("//div[@id='nav-main-cpoyRCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-cpoyRCount']/span[@class='data-count']/text()") else "0"
            num_dict['zpzzq_num'] = response.xpath("//div[@id='nav-main-copyrightWorks']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-copyrightWorks']/span[@class='data-count']/text()") else "0"
            num_dict['wzba_num'] = response.xpath("//div[@id='nav-main-icpCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-icpCount']/span[@class='data-count']/text()") else "0"
            #失信人员
            sxry_num = response.xpath("//div[@id='nav-main-dishonest']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-dishonest']/span[@class='data-count']/text()") else "0"
            sxry_html = response.xpath("//div[@id='nav-main-dishonest']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-dishonest']/span[@class='tips-count']/text()") else "0"
            hissxry_num = ''.join(re.findall(r"(\d*)", sxry_html)).strip("")
            #被执行人员
            zxry_num = response.xpath("//div[@id='nav-main-zhixing']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-zhixing']/span[@class='data-count']/text()") else "0"
            zxry_html = response.xpath("//div[@id='nav-main-zhixing']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-zhixing']/span[@class='tips-count']/text()") else "0"
            hiszxry_num = ''.join(re.findall(r"(\d*)", zxry_html)).strip("")
            #行政处罚(工商局)
            xzcf_gsj_num = response.xpath("//div[@id='nav-main-punishment']/div[1]/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-punishment']/div[1]/span[@class='data-count']/text()") else "0"
            xzcf_gsj_html = response.xpath("//div[@id='nav-main-punishment']/div[1]/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-punishment']/div[1]/span[@class='tips-count']/text()") else "0"
            hisxzcf_gsj_num = ''.join(re.findall(r"(\d*)", xzcf_gsj_html)).strip("")
            #行政处罚(信用中国)
            xzcf_xyzg_num = response.xpath("//div[@id='nav-main-punishment']/div[3]/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-punishment']/div[3]/span[@class='data-count']/text()") else "0"
            xzcf_xyzg_html = response.xpath("//div[@id='nav-main-punishment']/div[3]/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-punishment']/div[3]/span[@class='tips-count']/text()") else "0"
            hisxzcf_xyzg_num = ''.join(re.findall(r"(\d*)", xzcf_xyzg_html)).strip("")
            #股权出质
            gqcz_num = response.xpath("//div[@id='nav-main-equityCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-equityCount']/span[@class='data-count']/text()") else "0"
            gqcz_html = response.xpath("//div[@id='nav-main-equityCount']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-equityCount']/span[@class='tips-count']/text()") else "0"
            hisgqcz_num = ''.join(re.findall(r"(\d*)", gqcz_html)).strip("")
            #动产抵押
            dcdy_num = response.xpath("//div[@id='nav-main-mortgageCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-mortgageCount']/span[@class='data-count']/text()") else "0"
            dcdy_html = response.xpath("//div[@id='nav-main-mortgageCount']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-mortgageCount']/span[@class='tips-count']/text()") else "0"
            hisdcdy_num = ''.join(re.findall(r"(\d*)", dcdy_html)).strip("")
            #欠税公告
            qsgg_num = response.xpath("//div[@id='nav-main-ownTaxCount']/div[1]/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-ownTaxCount']/div[1]/span[@class='data-count']/text()") else "0"
            qsgg_html = response.xpath("//div[@id='nav-main-ownTaxCount']/div[1]/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-ownTaxCount']/div[1]/span[@class='tips-count']/text()") else "0"
            hisqsgg_num = ''.join(re.findall(r"(\d*)", qsgg_html)).strip("")
            #司法拍卖
            sfpm_num = response.xpath("//div[@id='nav-main-judicialSaleCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-judicialSaleCount']/span[@class='data-count']/text()") else "0"
            sfpm_html = response.xpath("//div[@id='nav-main-judicialSaleCount']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-judicialSaleCount']/span[@class='tips-count']/text()") else "0"
            hissfpm_num = ''.join(re.findall(r"(\d*)", sfpm_html)).strip("")
            #行政许可(工商局)
            xzxk_gsj_num = response.xpath("//div[@id='nav-main-licenseAllCount']/div[@class='block-data']/div[@class='data-header']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-licenseAllCount']/div[@class='block-data']/div[contains(@class,data-header)][1]/span[@class='data-count']/text()") else "0"
            xzxk_gsj_html = response.xpath("//div[@id='nav-main-licenseAllCount']/div[@class='block-data']/div[@class='data-header']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-licenseAllCount']/div[@class='block-data']/div[contains(@class,data-header)][1]/span[@class='tips-count']/text()") else "0"
            hisxzxk_gsj_num = ''.join(re.findall(r"(\d*)", xzxk_gsj_html)).strip("")
            #行政许可(信用中国)
            xzxk_xyzg_num = response.xpath("//div[@id='nav-main-licensingCount']/span[@class='data-count']/text()")[0] if response.xpath("//div[@id='nav-main-licensingCount']/span[@class='data-count']/text()") else "0"
            xzxk_xyzg_html = response.xpath("//div[@id='nav-main-licensingCount']/span[@class='tips-count']/text()")[0] if response.xpath("//div[@id='nav-main-licensingCount']/span[@class='tips-count']/text()") else "0"
            hisxzxk_xyzg_num = ''.join(re.findall(r"(\d*)", xzxk_xyzg_html)).strip("")
            num_dict['sxry_num'] = int(sxry_num) - int(hissxry_num)
            num_dict['zxry_num'] = int(zxry_num) - int(hiszxry_num)
            num_dict['gqcz_num'] = int(gqcz_num) - int(hisgqcz_num)
            num_dict['dcdy_num'] = int(dcdy_num) - int(hisdcdy_num)
            num_dict['qsgg_num'] = int(qsgg_num) - int(hisqsgg_num)
            num_dict['sfpm_num'] = int(sfpm_num) - int(hissfpm_num)
            num_dict['xzcf_gsj_num'] = int(xzcf_gsj_num) - int(hisxzcf_gsj_num)
            num_dict['xzcf_xyzg_num'] = int(xzcf_xyzg_num) - int(hisxzcf_xyzg_num)
            num_dict['xzxk_gsj_num'] = int(xzxk_gsj_num) - int(hisxzxk_gsj_num)
            num_dict['xzxk_xyzg_num'] = int(xzxk_xyzg_num) - int(hisxzxk_xyzg_num)
            item['nums'] = str(num_dict)
            result = s.insert_sql(**item)

            self.sha1.update(str(kw['company_id']).encode("utf-8"))
            sha_company_id = self.sha1.hexdigest()
            if result:
                redis_db.hset("nums",kw['company_id'],num_dict)
                redis_db.sadd("hascompany_id", sha_company_id)

if __name__ == "__main__":
    g = Getinfo()
    g.get_html()
