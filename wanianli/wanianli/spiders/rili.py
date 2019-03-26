# -*- coding: utf-8 -*-
import scrapy
import json
import redis
from scrapy.conf import settings

class RiliSpider(scrapy.Spider):
    name = 'rili'
    allowed_domains = ['wannianrili.51240.com']
    # start_urls = ['http://wannianrili.51240.com/']

    def start_requests(self):
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'], password=settings['REDIS_PASSWORD'],db=settings['REDIS_DB'], decode_responses=True)

        for year in range(1900,2101):
            for month in range(1,13):
                if not self.redis_pool.sismember("hasdate","%s%s"%(year,month)):
                    url = "https://wannianrili.51240.com/ajax/?q=%s-%02d&v=19021203"%(year,month)
                    yield scrapy.Request(url,callback=self.parse,meta={'year':year,'month':month})
                # break
            # break

    def parse(self, response):
        alldays = response.css("span.wnrl_td_gl::text").extract()[-1]
        rili_list = []
        for day in range(int(alldays)):
            rili_day_dict = {}
            rili_info_dict ={}
            base_info = response.css("div#wnrl_k_you_id_"+str(day))
            detail_info = response.css("div#wnrl_k_xia_id_%s div.wnrl_k_xia_nr span.wnrl_k_xia_nr_wnrl_beizhu_neirong::text"%day).extract()
            rili_info_dict["biaoti"] =  base_info.css("div.wnrl_k_you_id_biaoti::text").extract_first()
            rili_info_dict["riqi"] =  base_info.css("div.wnrl_k_you_id_wnrl_riqi::text").extract_first()
            rili_info_dict["nongli"] =  base_info.css("div.wnrl_k_you_id_wnrl_nongli::text").extract_first()
            rili_info_dict["ganzhi"] =  base_info.css("div.wnrl_k_you_id_wnrl_nongli_ganzhi::text").extract_first()
            rili_info_dict["jieri"] =  "" if base_info.css("div.wnrl_k_you_id_wnrl_jieri span.wnrl_k_you_id_wnrl_jieri_neirong::text").extract_first()==None else base_info.css("div.wnrl_k_you_id_wnrl_jieri span.wnrl_k_you_id_wnrl_jieri_neirong::text").extract_first()
            rili_info_dict["yi"] =  ','.join(base_info.css("div.wnrl_k_you_id_wnrl_yi span.wnrl_k_you_id_wnrl_yi_neirong a::text").extract())
            rili_info_dict["ji"] =  ','.join(base_info.css("div.wnrl_k_you_id_wnrl_ji span.wnrl_k_you_id_wnrl_ji_neirong a::text").extract())
            rili_info_dict["shengxiao"] =  detail_info[0]
            rili_info_dict["xingzuo"] =  detail_info[1]
            rili_info_dict["pengzubaiji"] = detail_info[2]
            rili_info_dict["taishenzhanfang"] =  detail_info[3]
            rili_info_dict["nianwuxing"] =  detail_info[4]
            rili_info_dict["jijie"] =  detail_info[5]
            rili_info_dict["yuewuxing"] =  detail_info[6]
            rili_info_dict["xinsu"] =  detail_info[7]
            rili_info_dict["riwuxing"] =  detail_info[8]
            rili_info_dict["jieqi"] =  detail_info[9]
            rili_info_dict["nunveri"] =  detail_info[10]
            rili_info_dict["yisilanli"] =  detail_info[11]
            rili_info_dict["chong"] =  detail_info[12]
            rili_info_dict["sha"] =  detail_info[13]
            rili_info_dict["liuyao"] =  detail_info[14]
            rili_info_dict["shiershen"] =  detail_info[15]
            key = "%s%02d%s"%(response.meta['year'],response.meta['month'],rili_info_dict["riqi"])
            rili_day_dict[key] = rili_info_dict
            rili_list.append(rili_day_dict)
        filename = "E:\DataPractice\\rili\\%s%02d.json"%(response.meta['year'],response.meta['month'])
        with open(filename,"a",encoding='utf-8') as f:
            b = json.dump(rili_list, f, ensure_ascii=False)
            self.redis_pool.sadd("hasdate","%s%s"%(response.meta['year'],response.meta['month']))
            print('%s年%s月 数据写入完毕！'%(response.meta['year'],response.meta['month']))
            # break




