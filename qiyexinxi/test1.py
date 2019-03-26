import requests
import re
import time
import json
import random
import execjs
from lxml import etree
# from copyheaders import headers_raw_to_dict


class Qiyexinxi(object):

    def __init__(self):
        self.current_time = int(time.time() * 1000)
        self.gt_url = "http://www.gsxt.gov.cn/SearchItemCaptcha?t=%d"
        self.list_url = "http://www.gsxt.gov.cn/corp-query-search-1.html"
        self.info_url = ""
        self.jsluid = ""
        self.headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
            "Host": "www.gsxt.gov.cn",
            # "Referer": "http://www.gsxt.gov.cn/index.html",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
        }
    def get_gt(self,url=None,headers=None):
        req = requests.get(self.gt_url % self.current_time,headers = self.headers)
        jsluid = json.loads(json.dumps(dict(req.headers))).get('Set-Cookie','')
        if jsluid:
            self.jsluid = jsluid
        return req

    def use_execjs(self):
        jsl_clearance = ""
        req_json = None
        # req = requests.get(self.gt_url % self.current_time, headers=headers_raw_to_dict(header)).status_code
        req = self.get_gt()
        print(req)
        if req.status_code == 200:
            req_json = req.text
        elif req.status_code == 521:
            textjs = req.text.replace("<script>","").replace("eval","return").split("</script>")[0]
            shtml = "function cook(){"+textjs+";};"
            res = execjs.compile(shtml)
            result = res.call("cook")
            newjs = result.replace(r"setTimeout('location.href=location.pathname+location.search.replace(/[\?|&]captcha-challenge/,\'\')',1500);","").\
                           replace("document.cookie","var a").replace("return return","return ").split("};if")[0]+"; return a; }"
            func_name = re.search(r"var (.*?)=function",newjs)
            if func_name.group(1):
                func_res = execjs.compile(newjs)
                rance_res =  func_res.call(func_name.group(1))
                print(rance_res)
                txt_rance = rance_res.split("|0|")[1].split(";Expires")[0].replace("String.fromCharCode","").replace(")",",|").replace("(","|")
                if txt_rance.startswith("|"):
                    txt_rance = txt_rance[1:].split("|")
                elif txt_rance.endswith("|"):
                    txt_rance = txt_rance[:-1].split("|")
                else:
                    txt_rance = txt_rance.split("|")
                for rance in txt_rance:
                    if "," in rance:
                        for j in rance.split(",")[:-1]:
                            jsl_clearance += chr(int(j))
                    else:
                        jsl_clearance+=rance
            self.headers['Cookie'] = rance_res.split("|0|")[0]+"|0|"+jsl_clearance+";"+self.jsluid
            self.headers['Referer'] = "http://www.gsxt.gov.cn/corp-query-search-1.html"
            get_res = self.get_gt(headers=self.headers)
            if get_res.status_code == 200:
                req_json = get_res.text
            else:
                print(get_res)
        else:
            req_json = req.status_code
        return req_json

    def pojie(self):
        te = self.use_execjs()
        gt = json.loads(te)
        jy_url = "http://jiyanapi.c2567.com/shibie?gt="+gt['gt']+"&challenge="+gt['challenge']+"&referer=http://www.gsxt.gov.cn&user=hyc6446&pass=hyc6446&return=json"
        req = requests.get(jy_url)
        json_valie = json.loads(req.text)
        if json_valie['status'] =="ok":
            return json_valie
        else:
            return "验证失败"
        # pass
    def get_lists(self):
        valid = self.pojie()
        print(valid)
        form = {
            "tab": "ent_tab",
            "province": "",
            "geetest_challenge": valid['challenge'],
            "geetest_validate": valid['validate'],
            "geetest_seccode": valid['validate']+"|jordan",
            "token": "",
            "searchword": "恒宇",
        }
        req = requests.post(self.list_url)
        print(req.text)


if __name__ == "__main__":
    q = Qiyexinxi()
    q.get_lists()
