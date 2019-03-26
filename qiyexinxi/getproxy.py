import requests
import json
def get_proxy():
    url = 'http://www.xiongmaodaili.com/xiongmao-web/api/glip?secret=84a3bf510ff537a9e3a0479dba73b8a6&orderNo=GL20180901182010xb09B4Qs&count=10&isTxt=1&proxyType=1'
    res = requests.get(url)
    # json_res = json.loads(res.text)
    # if json_res["code"] == "0":
    #     proxy = json_res['obj'][0]["ip"]+":"+json_res['obj'][0]["port"]
    #     return proxy
    # else:
    #     get_proxy()
    res_text = res.text.replace("\r\n",'')
    print(res.text)
    proxy = []
    for i in res.text:
        proxy.append(i)
    # proxy['http'] = "http://"+res_text
    # proxy['https'] = "https://"+res_text
    return proxy

if __name__ =="__main__":
    a = get_proxy()
    print(a)