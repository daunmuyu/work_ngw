
import util from './request' // 此处，引入存放对promise处理的文件

const wxcode = '?appid=wx05afe3aacbacb3a7&secret=0f83dc54d06e3610244893cab8162435&grant_type=authorization_code'
const inquant = 'https://ngwstrategy.inquant.cn/' // 后台的ip地址
const openid = 'https://api.weixin.qq.com/sns/jscode2session' // 获取openid
const ngwHttp = 'https://swww.niuguwang.com/' // ngw域名IP
const shqHttp = 'https://shq.niuguwang.com/' // shp域名IP
// APPID APPsecret
const zlmcode = '&reqappid=wx05afe3aacbacb3a7&reqsecret=0f83dc54d06e3610244893cab8162435'

const getRequest = util.httpsPromisify(wx.request)

const date = new Date().getTime()

const request = (method, url, data = {}) => { // method为请求方法，url为接口路径，data为传参
  return getRequest({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json'
    }
  })
}

export default {
  homeData: params => request('GET', inquant + 'IntelligentStock/Home/HomeData?reqminitype=2&date=' + date, params), // 获取个股数据
  wxOpenId: params => request('GET', openid + wxcode + '&reqminitype=2&date' + date, params), // 获取openID
  ngwOpenId: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=getopenid&reqminitype=2' + zlmcode, params), // 获取openid
  ngwPhone: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=setphonenumber&reqminitype=2', params), // 上传手机号
  ngwSearch: params => request('GET', ngwHttp + 'stock/wxminisearch.ashx?reqminitype=2&date=' + date, params), // 股票搜索
  shqFlow: params => request('GET', shqHttp + 'aquote/quotedata/fundsflow.ashx?reqminitype=2&date=' + date, params), // A股主力资金接口
  shqStock: params => request('GET', shqHttp + 'aquote/quotedata/StockShare.ashx?reqminitype=2&date=' + date, params), // A股大事提醒
  userInfo: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=adduserinfo&reqminitype=2&date=' + date, params), // 获取访问小程序用户信息
  diagnosis: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=adddiagnostic&reqminitype=2&reqminitype=2&date=' + date, params), // 搜索点击记录诊股
  indexData: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=getindexdata&reqminitype=2&date=' + date, params), // 取诊股首页数据
  hotStock: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=gethotstock&reqminitype=2&date=' + date, params), // 最火股票
  history: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=gethistorysearch&reqminitype=2&date=' + date, params), // 获取搜索历史记录
  clearHist: params => request('GET', ngwHttp + 'wx/DiagnosisStock.ashx?action=clearhistory&reqminitype=2&date=' + date, params) // 清空搜索记录
}
