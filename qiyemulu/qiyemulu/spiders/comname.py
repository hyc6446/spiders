# -*- coding: utf-8 -*-
import scrapy
import redis
import random
import json
import re
import urllib.parse
from w3lib.html import remove_tags
from scrapy.conf import settings
from scrapy import signals
from scrapy.exceptions import CloseSpider
from qiyemulu.items import QiyemuluItem

class ComnameSpider(scrapy.Spider):
    name = 'comname'
    allowed_domains = ['gate.lagou.com','api2.tianyancha.com']
    # start_urls = ['https://fe-api.zhaopin.com/c/i/sou?start=100&pageSize=100&cityId=489&workExperience=-1&education=-1&companyType=-1&employmentType=-1&jobWelfareTag=-1&kt=3&at=83a2243bc49449838d493681f2284638&rt=4121e0a8ebfc4aeaadddda51ff20532c&_v=0.17541697&userCode=133203858&x-zp-page-request-id=d3debe91c35a4229b0e297c05c077a35-1545206586615-949542']
    # start_urls = ['https://gate.lagou.com/v1/neirong/companyTab/queryCompanyList?industry=不限&fundsStage=&pageSize=10&city=上海&otherCondition=&pageNo=0&sortType=0&scale=']
    def start_requests(self):
        areas = ['北京', '上海', '天津', '重庆', '石家庄', '廊坊', '沧州', '承德', '张家口', '保定', '邢台', '邯郸', '秦皇岛', '唐山', '衡水', '太原', '临汾', '忻州', '运城', '晋中', '朔州', '晋城', '长治', '阳泉', '大同', '吕梁', '呼和浩特', '巴彦淖尔', '乌兰察布', '锡林郭勒盟', '兴安盟', '呼伦贝尔', '鄂尔多斯', '通辽', '赤峰', '乌海', '包头', '阿拉善盟', '沈阳', '朝阳', '铁岭', '盘锦', '辽阳', '阜新', '营口', '锦州', '丹东', '本溪', '抚顺', '鞍山', '大连', '葫芦岛', '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边', '哈尔滨', '绥化', '黑河', '牡丹江', '七台河', '佳木斯', '伊春', '大庆', '双鸭山', '鹤岗', '鸡西', '齐齐哈尔', '大兴安岭', '苏州', '南京', '泰州', '镇江', '扬州', '盐城', '淮安', '连云港', '南通', '常州', '徐州', '无锡', '宿迁', '杭州', '台州', '舟山', '衢州', '金华', '绍兴', '湖州', '嘉兴', '温州', '宁波', '丽水', '合肥', '池州', '亳州', '六安', '宿州', '阜阳', '滁州', '黄山', '安庆', '铜陵', '淮北', '马鞍山', '淮南', '蚌埠', '芜湖', '宣城', '厦门', '福州', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德', '南昌', '抚州', '宜春', '吉安', '赣州', '鹰潭', '新余', '九江', '萍乡', '景德镇', '上饶', '济南', '滨州', '聊城', '德州', '临沂', '莱芜', '日照', '威海', '泰安', '济宁', '潍坊', '烟台', '东营', '枣庄', '淄博', '青岛', '菏泽', '郑州', '驻马店', '周口', '信阳', '商丘', '南阳', '三门峡', '漯河', '许昌', '濮阳', '焦作', '新乡', '鹤壁', '安阳', '平顶山', '洛阳', '开封', '济源', '武汉', '恩施', '随州', '咸宁', '黄冈', '荆州', '孝感', '荆门', '鄂州', '襄阳', '宜昌', '十堰', '黄石', '天门', '长沙', '娄底', '怀化', '永州', '郴州', '益阳', '张家界', '常德', '岳阳', '邵阳', '衡阳', '湘潭', '株洲', '湘西土家族苗族自治州', '广州', '深圳', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '梅州', '惠州', '韶关', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '云浮', '南宁', '来宾', '河池', '贺州', '百色', '玉林', '贵港', '钦州', '防城港', '北海', '梧州', '桂林', '柳州', '崇左', '海口', '三亚', '三沙', '儋州', '成都', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝藏族羌族自治州', '甘孜藏族自治州', '眉山', '南充', '乐山', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '凉山彝族自治州', '贵阳', '六盘水', '遵义', '安顺', '铜仁', '黔西南', '毕节', '黔东南', '黔南', '昆明', '临沧', '迪庆', '怒江', '丽江', '德宏', '大理', '西双版纳', '文山', '红河', '楚雄', '昭通', '保山', '玉溪', '曲靖', '普洱', '拉萨', '昌都', '山南', '日喀则', '那曲', '林芝', '阿里地区', '西安', '安康', '榆林', '汉中', '延安', '渭南', '咸阳', '宝鸡', '铜川', '商洛', '兰州', '临夏', '陇南', '定西', '庆阳', '酒泉', '平凉', '张掖', '武威', '天水', '白银', '金昌', '嘉峪关', '甘南', '西宁', '海东', '海北', '黄南', '海南州', '果洛', '玉树', '海西', '银川', '石嘴山', '吴忠', '固原', '中卫', '乌鲁木齐', '塔城', '伊犁', '和田', '喀什', '克孜勒苏', '阿克苏', '巴音郭楞', '博尔塔拉', '昌吉', '哈密', '吐鲁番', '克拉玛依', '阿勒泰', '香港', '澳门', '台湾']
        # for city in areas:
        url = "https://gate.lagou.com/v1/neirong/companyTab/queryCompanyList?industry=不限&fundsStage=&pageSize=20&city=%s&otherCondition=&pageNo=%s&sortType=0&scale="%("北京",0)
        yield scrapy.Request(url,callback=self.parse)

    def parse(self, response):
        data = json.loads(response.text)
        self.redis_pool = redis.StrictRedis(host=settings['REDIS_HOST'], port=settings['REDIS_PORT'],password=settings['REDIS_PASSWORD'], db=3, decode_responses=True)
        headers = {
            "Content-Type": "application/json",
            "version": "Android 8.4.3",
            'referer':"https://api2.tianyancha.com",
            'User-Agent': 'com.tianyancha.skyeye/Dalvik/2.1.0 (Linux; U; Android 7.1.2; MI 5X MIUI/V9.5.3.0.NDBCNFA; appDevice/xiaomi_QAQ_MI 5X)',
            'Authorization': self.redis_pool.hget("Authorization", 'Authorization'),
        }
        if data['content']['hasNext'] == 1:
            for item in data['content']['companyMsgVos']:
                companyName = item['companyShortName']
                url = "https://api2.tianyancha.com/services/v3/search/sNorV3/%s?allowModifyQuery=1&sortType=0&pageSize=100&pageNum=1"%urllib.parse.quote(companyName)
                yield scrapy.Request(url,callback=self.parse_findCom,headers=headers,meta={'name':companyName},dont_filter=True)
                break
            page_num = re.search(r'pageNo=(\d+)&', response.url).group(1)
            next_start = 'pageNo=' + str(int(page_num)+1)+"&"
            next_url = re.sub(r'pageNo=(\d+)&', next_start, response.url)
            yield scrapy.Request(next_url,callback=self.parse,dont_filter=True)

        # item = QiyemuluItem()
        # if response.text:
        #     print(response.text)
        #     json_data = json.loads(response.text)
        #     data = json_data.get("data",'')
        #     code = json_data.get("code",'')
        #     if code == 200:
        #         if data.get("results",''):
        #             for result in data.get("results",''):
        #                 item['companyName'] = result['company']['name']
        #                 yield item
        #                 # if not self.redis_pool.sismember("company_names", companyName):
        #                 #     self.redis_pool.sadd("company_names", companyName)
        #                 #     print(companyName, "执行成功")
        #                 # else:
        #                 #     print(companyName,"已存在")
        #                 # url = "https://api2.tianyancha.com/services/v3/search/sNorV3/%s?allowModifyQuery=1&sortType=0&pageSize=100&pageNum=1"%urllib.parse.quote(companyName)
        #                 # yield scrapy.Request(url,callback=self.parse_findCom,headers=headers,dont_filter=True,meta={'name':companyName})
        #     else:
        #         print("没有获取到数据列表")
        #
        #     page_num = re.search(r'start=(\d+)', response.url).group(1)
        #     next_start = 'start=' + str(int(page_num) + 100)
        #     next_url = re.sub(r'start=\d+', next_start, response.url)
        #     yield scrapy.Request(next_url,callback=self.parse,dont_filter=True)
    def parse_findCom(self,response):
        if response.status == 200:
            json_data = json.loads(response.text)
            state = json_data.get("state",'')
            try:
                if state == "ok":
                    data = json_data.get('data','')
                    if data:
                        companyList = data.get("companyList",'')
                        if companyList:
                            for item in companyList:
                                id = item['id']
                                company_name = remove_tags(item['name'])
                                if not self.redis_pool.hexists("companyInfo",id):
                                    self.redis_pool.hset("companyInfo",id,company_name)
                                    print(company_name,"执行成功")
                else:
                    print(state)
                    # raise CloseSpider(reason='没有获取到数据')
            except Exception as e:
                print(e.args)

