# -*- coding: utf-8 -*-
import json
import redis
import typing
import time
import mitmproxy.addonmanager
import mitmproxy.connections
import mitmproxy.http
import mitmproxy.log
import mitmproxy.tcp
import mitmproxy.websocket
import mitmproxy.proxy.protocol
from mitmproxy import ctx


class Events:
    def __init__(self):
        self.redis_pool = redis.StrictRedis(host='127.0.0.1', port=6379, password="",db=0, decode_responses=True)

    # HTTP lifecycle
    def http_connect(self, flow: mitmproxy.http.HTTPFlow):
        # print("http_connect",flow.request.headers)
        """
            An HTTP CONNECT request was received. Setting a non 2xx response on
            the flow will return the response to the client abort the
            connection. CONNECT requests and responses do not generate the usual
            HTTP handler events. CONNECT requests are only valid in regular and
            upstream proxy modes.
        """

    def requestheaders(self, flow: mitmproxy.http.HTTPFlow):
        # print("requestheaders",flow.request.headers)
        """
            HTTP request headers were successfully read. At this point, the body
            is empty.
        """

    def request(self, flow: mitmproxy.http.HTTPFlow):
        if '/api2.tianyancha.com/services/v3/' in flow.request.url:
            hd =flow.request.headers
            Authorization = dict(hd)['Authorization']
            print("当前时间:",time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())),Authorization)
            self.redis_pool.hset("Authorization","Authorization",Authorization)
        """
            The full HTTP request has been read.
        """

    def responseheaders(self, flow: mitmproxy.http.HTTPFlow):
        # if "tianyancha" in flow.request.url:
            # print("responseheaders:",flow.request.url,flow.request.headers)
        """
            HTTP response headers were successfully read. At this point, the body
            is empty.
        """

    def response(self, flow: mitmproxy.http.HTTPFlow):

        """
            The full HTTP response has been read.
        """

    def error(self, flow: mitmproxy.http.HTTPFlow):
        # print('error',flow.request.headers)
        """
            An HTTP error has occurred, e.g. invalid server responses, or
            interrupted connections. This is distinct from a valid server HTTP
            error response, which is simply a response with an HTTP error code.
        """

    # TCP lifecycle
    def tcp_start(self, flow: mitmproxy.tcp.TCPFlow):
        # print('tcp_start', flow.request.headers)
        """
            A TCP connection has started.
        """

    def tcp_message(self, flow: mitmproxy.tcp.TCPFlow):
        """
            A TCP connection has received a message. The most recent message
            will be flow.messages[-1]. The message is user-modifiable.
        """

    def tcp_error(self, flow: mitmproxy.tcp.TCPFlow):
        """
            A TCP error has occurred.
        """

    def tcp_end(self, flow: mitmproxy.tcp.TCPFlow):
        """
            A TCP connection has ended.
        """

    # Websocket lifecycle
    def websocket_handshake(self, flow: mitmproxy.http.HTTPFlow):

        """
            Called when a client wants to establish a WebSocket connection. The
            WebSocket-specific headers can be manipulated to alter the
            handshake. The flow object is guaranteed to have a non-None request
            attribute.
        """

    def websocket_start(self, flow: mitmproxy.websocket.WebSocketFlow):
        """
            A websocket connection has commenced.
        """

    def websocket_message(self, flow: mitmproxy.websocket.WebSocketFlow):
        """
            Called when a WebSocket message is received from the client or
            server. The most recent message will be flow.messages[-1]. The
            message is user-modifiable. Currently there are two types of
            messages, corresponding to the BINARY and TEXT frame types.
        """

    def websocket_error(self, flow: mitmproxy.websocket.WebSocketFlow):
        """
            A websocket connection has had an error.
        """

    def websocket_end(self, flow: mitmproxy.websocket.WebSocketFlow):
        """
            A websocket connection has ended.
        """

    # Network lifecycle
    def clientconnect(self, layer: mitmproxy.proxy.protocol.Layer):
        """
            A client has connected to mitmproxy. Note that a connection can
            correspond to multiple HTTP requests.
        """

    def clientdisconnect(self, layer: mitmproxy.proxy.protocol.Layer):
        # print('clientdisconnect', layer.__dict__)

        """
            A client has disconnected from mitmproxy.
        """

    def serverconnect(self, conn: mitmproxy.connections.ServerConnection):
        """
            Mitmproxy has connected to a server. Note that a connection can
            correspond to multiple requests.
        """

    def serverdisconnect(self, conn: mitmproxy.connections.ServerConnection):
        # print('serverdisconnect', conn.__dict__)

        """
            Mitmproxy has disconnected from a server.
        """

    def next_layer(self, layer: mitmproxy.proxy.protocol.Layer):
        """
            Network layers are being switched. You may change which layer will
            be used by returning a new layer object from this event.
        """

    # General lifecycle
    def configure(self, updated: typing.Set[str]):
        """
            Called when configuration changes. The updated argument is a
            set-like object containing the keys of all changed options. This
            event is called during startup with all options in the updated set.
        """

    def done(self):
        """
            Called when the addon shuts down, either by being removed from
            the mitmproxy instance, or when mitmproxy itself shuts down. On
            shutdown, this event is called after the event loop is
            terminated, guaranteeing that it will be the final event an addon
            sees. Note that log handlers are shut down at this point, so
            calls to log functions will produce no output.
        """

    def load(self, entry: mitmproxy.addonmanager.Loader):
        """
            Called when an addon is first loaded. This event receives a Loader
            object, which contains methods for adding options and commands. This
            method is where the addon configures itself.
        """

    def log(self, entry: mitmproxy.log.LogEntry):
        """
            Called whenever a new log entry is created through the mitmproxy
            context. Be careful not to log from this event, which will cause an
            infinite loop!
        """

    def running(self):
        """
            Called when the proxy is completely up and running. At this point,
            you can expect the proxy to be bound to a port, and all addons to be
            loaded.
        """

    def update(self, flows: typing.Sequence[mitmproxy.flow.Flow]):
        """
            Update is called when one or more flow objects have been modified,
            usually from a different addon.
        """
addons = [
    Events()
]

# company_base_info = {}
# changeRecord_info = []

# def response(flow):
#     print(11111)
#     print(flow.request.url)
#     if '/api2.tianyancha.com/services/v3/' in flow.request.url:
#         print(request.headers)


    # global company_base_info
    # global changeRecord_info
    # base_info = None
    # '''
    #     "changeRecordCount":"变更记录",
    #     "employeesCount":"主要人员",
    #     "investCount":"对外投资",
    #     "reportCount":"企业年报",
    #     "lawsuitCount":"裁判文书",
    #     "executedPersonCount":"被执行人",
    #     "courtNoticeCount":"开庭公告",
    #     "noticeCount":"法院公告",
    #     "executionCount":"失信信息",
    #     "mortgagesCount":"动产抵押",
    #     "taxInfoCount":"税务信息",
    #     "autionCount":"司法拍卖",
    #     "equityCount":"股权出质",
    #     "abnormalCount":"经营异常",
    #     "punishmentCount":"行政处罚",
    #     "equityFreezeCount":"股权冻结",
    #     "":"司法协助",
    #     "caseCount":"立案信息",
    #     "clearAccountCount":"清算信息",
    #     "knowledgePropertiesCount":"知识产权出质",
    #     "brandsCount":"品牌产品",
    #     "financingCount":"融资信息",
    #     "competitorsCount":"竞品信息",
    #     "tradeMarkCount":"商标信息",
    #     "patentCount":"专利信息",
    #     "copyrightCount":"著作权",
    #     "certificateCount":"资质证书",
    #     "biddingCount":"招投标",
    #     "checkUpCount":"抽查检查",
    #     "domainCount":"域名信息",
    #     "licenseCount":"行政许可",
    #     "customsCount":"进出口信息",
    #     "taxQualificationsCount":"税务资质",
    #     "landCount":"土地信息",
    #     "pledgeeCount":"质权人",
    # '''
    # 通过抓包软包软件获取请求的接口
    #企业 基本信息 路由
        # data = json.loads(flow.response.content.decode("utf-8"))['data']
        # company_base_info['name'] = data.get('name','')
        # company_base_info['historyNames'] = data.get('historyNames','')
        # company_base_info['status'] = data.get('status','')
        # company_base_info['operName'] = data.get('operName','')
        # company_base_info['regCapi'] = data.get('regCapi','')
        # company_base_info['startDate'] = data.get('startDate','')
        # company_base_info['address'] = data.get('address','')
        # company_base_info['email'] = data.get('email','')
        # company_base_info['econKind'] = data.get('econKind','')
        # company_base_info['lastUpdateTime'] = data.get('lastUpdateTime','')
        # company_base_info['tag'] = data.get('tags','')[0].get('tag','') if data['tags'] else ""
        # contacts = data.get('contacts','')
        # if contacts:
        #     phone = contacts.get('phone','')
        #     zd = contacts['zd'].get('items','') if contacts['zd'] else ""
        #     gs = contacts['gs'].get('items','') if contacts['gs'] else ""
        #
        #     tel_zd = ','.join([ item['src']+":"+item['contact'] for item in zd])
        #     tel_gs = ','.join([ item['src']+":"+item['contact'] for item in gs])
        #     company_base_info['phone'] = "phone:%s,%s,%s" %(phone,tel_zd,tel_gs)
    # #企业 工商信息 路由
    # if '/v4/enterprise/getDetail2' in flow.request.url:
    #     regInfo_data = json.loads(flow.response.content.decode("utf-8"))['data']['regInfo']
    #     regInfo_data = json.loads(flow.response.content.decode("utf-8"))['data']['regInfo']
    #     #注册号
    #     company_base_info['regNo'] = regInfo_data.get('regNo','')
    #     #组织机构代码
    #     company_base_info['orgNo'] = regInfo_data.get('orgNo','')
    #     #统一社会信用代码
    #     company_base_info['creditNo'] = regInfo_data.get('creditNo',"")
    #     #社保
    #     company_base_info['shebao'] = regInfo_data.get('shebao',"")
    #     #营业期限
    #     company_base_info['businessTerm'] = regInfo_data.get('businessTerm',"")
    #     #核准日期
    #     company_base_info['checkDate'] = regInfo_data.get('checkDate',"")
    #     #登记机关
    #     company_base_info['belongOrg'] = regInfo_data.get('belongOrg',"")
    #     #经营范围
    #     company_base_info['scope'] = regInfo_data.get('scope',"")
    #
    # #企业 变更记录 路由
    # if '/v4/enterprise/getPagingEntBasicInfo' in flow.request.url:
    #     data = json.loads(flow.response.content.decode("utf-8"))['data']['items']
    #     for item in data:
    #         changeRecord_info.append(item)
    # # #企业 变更记录 路由
    # # if '/v4/enterprise/getPagingEntBasicInfo' in flow.request.url:
    # #     pass
    # base_info = deepcopy(company_base_info)
    # # print(base_info)
    # print(changeRecord_info)



