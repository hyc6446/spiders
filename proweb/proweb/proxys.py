# -*- coding: utf-8 -*-
import requests
import json
import time


class GetProxy():
    def __init__(self):
        self.proxy_list = ""

    def getproxy(self):
        url = "http://183.129.207.70:88/open?user_name=hys_110111839_f445&timestamp=1542273125452&md5=55fca12d5072c70efba0c100f680cd89&pattern=txt&number=1&fmt=4"
        response = requests.get(url)
        self.proxy_list = response.text
        return self.proxy_list

g = GetProxy()
# print(g.getproxy())