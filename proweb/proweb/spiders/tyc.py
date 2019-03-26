# -*- coding: utf-8 -*-
import scrapy
import redis
from scrapy.utils.project import get_project_settings
settings = get_project_settings()

from proweb.items import ProwebItem
class TycSpider(scrapy.Spider):
    name = 'tyc'
    allowed_domains = ['tianyancha.com']
    start_urls = ['https://www.tianyancha.com/']

    def parse(self, response):#
        all_industrys = response.css("div.search-industry table tr td a.search-detail::attr(href)").extract()
        single = ["https://www.tianyancha.com/search?base=bj","https://www.tianyancha.com/search?base=tj","https://www.tianyancha.com/search?base=sh","https://www.tianyancha.com/search?base=cq"]
        citys = response.css("div.js-industry-container:nth-of-type(2) div.col-11 a::attr(href)").extract()
        all_citys = single + citys
        for city_url in all_citys:
            yield scrapy.Request(city_url,callback=self.parse_areas,meta={'industrys' : all_industrys})
    #获取地区
    def parse_areas(self,response):
        all_areas = response.css(".-max-area:nth-child(3)").css("div.content a.false::attr(href)").extract()
        for area in all_areas:
            for industry in response.meta['industrys']:
                href = industry + area.split("search")[1]
                yield scrapy.Request(href,callback=self.parse_company_list)

    def parse_company_list(self,response):
        redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)
        result_list = response.css("div.result-list div.search-result-single  ")
        if result_list:
            for result in result_list:
                company_dict = {}
                content = result.css("div.content")
                company_dict['company_id'] = content.css("div.header a.name::attr(href)").extract_first().split("/")[-1]
                if not redis_pool.sismember("company_id",company_dict['company_id']):
                    company_dict['company_name'] = content.css("div.header a.name::text").extract_first()
                    company_dict['company_url'] = content.css("div.header a.name::attr(href)").extract_first()
                    company_dict['company_status'] = content.css("div.header div.tag::text").extract_first()
                    company_dict['company_legal'] = content.css("div.info a.legalPersonName::text").extract_first()
                    company_dict['company_reg_money'] = content.css("div.info div:nth-child(2) span::text").extract_first()
                    company_dict['company_reg_date'] = content.css("div.info div:nth-child(3) span::text").extract_first()

                    phone_script = content.css("div.contact div:nth-child(1) script::text").extract_first()
                    phone_span = content.css("div.contact div:nth-child(1) span:nth-child(2)::text").extract_first()
                    email_script = content.css("div.contact div:nth-child(2) script::text").extract_first()
                    email_span = content.css("div.contact div:nth-child(2) span:nth-child(2)::text").extract_first()

                    if phone_script:
                        company_dict['company_phone'] = phone_script.replace('"','')[1:-1]
                    elif phone_span:
                        company_dict['company_phone'] = phone_span
                    else:
                        company_dict['company_phone'] = "-"

                    if email_script:
                        company_dict['company_email'] = email_script.replace('"','')[1:-1]
                    elif email_span:
                        company_dict['company_email'] = email_span
                    else:
                        company_dict['company_email'] = "-"

                    yield scrapy.Request(company_dict['company_url'],callback=self.parse_company_info,meta={'company_dict':company_dict})

            next = response.css("ul.pagination li a.-next::attr(href)").extract_first()
            if next:
                page_num = int(next.split("/p")[1].split("?")[0])
                if page_num != 6:
                    yield scrapy.Request(next,callback=self.parse_company_list)


    def parse_company_info(self,response):
        item = ProwebItem()
        #公司id
        item['company_id'] = response.meta['company_dict']['company_id']
        #公司名称
        item['company_name'] = response.meta['company_dict']['company_name']
        #公司当前状态
        item['com_status'] = response.meta['company_dict']['company_status']
        #公司法人
        item['gsfr'] = response.meta['company_dict']['company_legal']
        #注册资本
        item['zczb'] = response.meta['company_dict']['company_reg_money']
        #注册日期
        item['zcrq'] = response.meta['company_dict']['company_reg_date']
        #公司联系方式
        item['phone'] = response.meta['company_dict']['company_phone']
        #公司邮箱
        item['email'] = response.meta['company_dict']['company_email']
        #曾用名
        item['history_name'] = response.css("div.history-content::text").extract_first() if response.css("div.history-content::text").extract() else "-"
        #公司网址
        item['gswz'] = response.css("a.company-link::text").extract_first() if response.css("a.company-link::text").extract() else "-"
        #公司地址
        item['gsdz'] = response.css("span.address::attr(title)").extract_first() if response.css("span.address::attr(title)").extract() else "-"
        #公司简介
        item['gsjj'] = response.css("div.summary script::text").extract_first().replace(" ","").replace("\n","") if response.css("div.summary script::text").extract() else "-"
        #更新时间
        item['gxsj'] = response.css("span.updatetimeComBox::text").extract_first() if response.css("span.updatetimeComBox::text").extract() else "-"
        #工商注册号
        item['gszch'] = response.css("table.-border-top-none tbody tr:nth-child(1) td:nth-child(2)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(1) td:nth-child(2)::text").extract() else "-"
        #组织机构代码
        item['zzjgdm'] = response.css("table.-border-top-none tbody tr:nth-child(1) td:nth-child(4)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(1) td:nth-child(4)::text").extract() else "-"
        #社会信用代码
        item['shxydm'] = response.css("table.-border-top-none tbody tr:nth-child(2) td:nth-child(2)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(2) td:nth-child(2)::text").extract() else "-"
        #公司类型
        item['gslx'] = response.css("table.-border-top-none tbody tr:nth-child(2) td:nth-child(4)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(2) td:nth-child(4)::text").extract() else "-"
        #纳税人识别码
        item['nsrsbm'] = response.css("table.-border-top-none tbody tr:nth-child(3) td:nth-child(2)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(3) td:nth-child(2)::text").extract() else "-"
        #行业
        item['hangye'] = response.css("table.-border-top-none tbody tr:nth-child(3) td:nth-child(4)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(3) td:nth-child(4)::text").extract() else "-"
        #营业期限
        item['yyqx'] = response.css("table.-border-top-none tbody tr:nth-child(4) td:nth-child(2) span::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(4) td:nth-child(2) span::text").extract() else "-"
        #纳税人资质
        item['nsrzz'] = response.css("table.-border-top-none tbody tr:nth-child(5) td:nth-child(2)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(5) td:nth-child(2)::text").extract() else "-"
        #人员规模
        item['rygm'] = response.css("table.-border-top-none tbody tr:nth-child(5) td:nth-child(4)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(5) td:nth-child(4)::text").extract() else "-"
        #实缴资本
        item['sjzb'] = response.css("table.-border-top-none tbody tr:nth-child(6) td:nth-child(2)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(6) td:nth-child(2)::text").extract() else "-"
        #登记机构
        item['djjg'] = response.css("table.-border-top-none tbody tr:nth-child(6) td:nth-child(4)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(6) td:nth-child(4)::text").extract() else "-"
        #参保人数
        item['cbrs'] = response.css("table.-border-top-none tbody tr:nth-child(7) td:nth-child(2)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(7) td:nth-child(2)::text").extract() else "-"
        #英文名称
        item['ywmc'] = response.css("table.-border-top-none tbody tr:nth-child(7) td:nth-child(4)::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(7) td:nth-child(4)::text").extract() else "-"
        #经营范围
        item['jyfw'] = response.css("table.-border-top-none tbody tr:nth-child(9) td:nth-child(2) span.js-full-container::text").extract_first() if response.css("table.-border-top-none tbody tr:nth-child(9) td:nth-child(2) span.js-full-container::text").extract() else "-"
        #公司年报
        item['gsnb'] = ','.join(response.css("div.report-item-list a::attr(href)").extract()) if response.css("div.report-item-list a::attr(href)").extract() else "-"
        # print(item)
        yield item



