import Vue from 'vue';
import {
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Button,
  Pagination,
  Dialog,
  RadioGroup,
  RadioButton,
  Loading,
  Message,
  Input,
  MessageBox,
} from 'element-ui';
import EventName from 'EventName';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ShareChart,
  CandleChart,
} from '@/components/stock-chart';
import ShareStock from '@/components/n-chart/timeshare.js';
import CandleStock from '@/components/n-chart/candlechart.js';
import {
  parseDate,
} from 'lib/time.js';
import {
  contractdatalist,
  futuresshare,
  futureskline,
  tradeHomePageInfo,
  closetrade,
  querydroporder,
  buypage,
  order,
  setstopprice,
  closepos,
  simulateSettingInfo,
} from '../../service/trade.js';
import {
  getwalletbank,
} from '../../service/api.js';
import template from './index.html';
import './style.scss';

Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Button.name, Button);
Vue.component(Pagination.name, Pagination);
Vue.component(Dialog.name, Dialog);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(RadioButton.name, RadioButton);
Vue.component(Input.name, Input);
Vue.use(Loading.directive);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

// 止盈止损列表
const stopList = [1, 2, 3, 4];

export default Vue.extend({
  metaInfo() {
    return {
      title: '交易中心',
      meta: [{                 // set meta
        name: 'keywords',
        content: '交易中心',
      }],
    };
  },
  template,
  components: {
    top: Header,
    bottom: Footer,
    ShareStock,
    CandleStock,
  },
  data() {
    return {
      // simulate: false,
      refreshInterval: 1000,
      marketList: [],
      currentMarket: {
        contractid: undefined,
        marketInfo: {},
        shareData: [],
        candleData: [],
        shareConfig: {},
      },
      candleTimeFormat: 'HH:mm',
      chartType: 0,
      tradeListType: 'position',
      positionList: [],
      settlementList: [],
      unfinishedList: [],
      pageSize: 10,
      settlementListPage: 0,
      settlementListTotal: false,
      settlementListLoading: false,
      unfinishedListPage: 0,
      unfinishedListTotal: false,
      unfinishedListLoading: false,
      account: {
        totalprofit: 0,
        frozenamout: 0,
        canusedamount: 0,
        posnum: 0,
      },
      orderPanelVisible: false,
      order: {
        orderType: 2,
        price: undefined,
        direction: 1,
        quantity: 1,
        stopprofit: 0,
        stoploss: 1,
        tradefee: 0,
        margin: 0,
        datatype: 5,
        deviceid: undefined,
        mobilemode: undefined,
      },
      orderInfo: {},
      stopList,
      stopLev: 1,
      orderPanelLoading: true,
      lossProfitOrderPanel: false,
      lossProfitOrderId: undefined,
      lossProfit: {
        stopprofit: 0,
        stoploss: 0,
      },
      lossProfitLoading: false,
      shareChart: undefined,
      candleChart: undefined,
      indicatorType: 'VOL',
      refreshTimetamp: undefined,
      count: 200,
      chargePanel: false,
      chargeMessage: '购买力不足',
      refreshId: undefined,
      idauthentication: 0,
    };
  },
  watch: {
    '$root.simulate': {
      async handler(nVal, oVal) {
        if (nVal !== oVal) {
          this.positionList = [];
          this.settlementList = [];
          this.unfinishedList = [];
          if (nVal) {
            if (this.$root.usertoken) {
              const res = await simulateSettingInfo({
                usertoken: this.$root.usertoken,
              });
              const {
                data: tradestatus,
              } = res;
              if (res && res.status === '1') {
                if (tradestatus.tradestatus === 1) {
                  this.loadPositionList();
                  this.settlementListPage = 0;
                  this.loadSettlementList();
                  this.unfinishedListPage = 0;
                  this.loadUnfinishedList();
                } else if (tradestatus.tradestatus === 2) {
                  this.$confirm('您的模拟交易时间已到期,请去实盘交易', '模拟交易到期', {
                    confirmButtonText: '去入金',
                    cancelButtonText: '取消',
                  }).then(() => {
                    this.$router.push('/personalcenter/2');
                  }, () => {});
                  this.$root.eventBus.$emit('changeSimulate', false);
                } else {
                  this.$confirm('您的模拟盘已被禁止交易,如有问题请联系客服', '禁止交易', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  });
                  this.$root.eventBus.$emit('changeSimulate', false);
                }
              } else {
                this.$message({
                  message: res.info || '模拟已经关闭',
                  type: 'info',
                });
                this.$root.eventBus.$emit('changeSimulate', false);
              }
            } else {
              this.$root.eventBus.$emit('changeSimulate', false);
              this.$root.eventBus.$emit(EventName.noticeLogin);
            }
          } else {
            this.loadPositionList();
            this.settlementListPage = 0;
            this.loadSettlementList();
            this.unfinishedListPage = 0;
            this.loadUnfinishedList();
          }
        }
      },
      deep: true,
    },
    stopLev() {
      this.order.stoploss = +this.orderInfo.perstoploss * this.stopLev * this.order.quantity;
      this.order.stopprofit = +this.orderInfo.perstopprofit * this.stopLev * this.order.quantity;
      this.order.margin = this.order.quantity * this.stopLev * (+this.orderInfo.perrmbmargin);
    },
    'currentMarket.shareData': {
      handler() {
        if (typeof this.shareChart === 'undefined') {
          this.shareChart = new ShareChart(
            '.sharechart',
            {
              offset: this.currentMarket.marketInfo.place,
              totalCount: this.currentMarket.marketInfo.scount,
              timeaxistext: this.currentMarket.marketInfo.timeaxistext,
              timeaxisindex: this.currentMarket.marketInfo.timeaxisindex,
            },
            this.currentMarket.shareData);
        } else {
          this.shareChart.refresh(
            this.currentMarket.shareData,
            {
              offset: this.currentMarket.marketInfo.place,
              totalCount: this.currentMarket.marketInfo.scount,
              timeaxistext: this.currentMarket.marketInfo.timeaxistext,
              timeaxisindex: this.currentMarket.marketInfo.timeaxisindex,
            });
        }
      },
      deep: true,
    },
    'currentMarket.candleData': {
      handler() {
        const config = {
          offset: this.currentMarket.marketInfo.place,
        };
        if (this.chartType === 6) {
          config.timeFormat = '%m/%d';
        } else {
          config.timeFormat = '%H:%M';
        }
        if (typeof this.candleChart === 'undefined') {
          this.candleChart = new CandleChart(
            '.candlechart',
            config,
            this.currentMarket.candleData);
        } else {
          this.candleChart.refresh(this.currentMarket.candleData, config);
        }
      },
      deep: true,
    },
    'order.quantity': {
      handler() {
        this.stopLev = 1;
        this.order.stoploss = +this.orderInfo.perstoploss * this.stopLev * this.order.quantity;
        this.order.stopprofit = +this.orderInfo.perstopprofit * this.stopLev * this.order.quantity;
        this.order.tradefee = this.order.quantity * (+this.orderInfo.perrmbfee);
        this.order.margin = this.order.quantity * this.stopLev * (+this.orderInfo.perrmbmargin);
      },
      deep: true,
    },
    chartType: {
      handler(nVal, oVal) {
        if (nVal !== oVal) {
          this.refreshTimetamp = (new Date()).getTime();
          this.loadChartData();
        }
      },
    },
    tradeListType: {
      handler(nVal, oVal) {
        if (nVal !== oVal) {
          if (nVal === 'settlement') {
            this.settlementListPage = 0;
            this.settlementListTotal = false;
            this.settlementList = [];
            this.loadSettlementList();
          } else if (nVal === 'unfinished') {
            this.unfinishedListPage = 0;
            this.unfinishedListTotal = false;
            this.unfinishedList = [];
            this.loadUnfinishedList();
          }
        }
      },
    },
  },
  computed: {
    marketPrice() {
      if (this.order.direction === 1) {
        return this.currentMarket.marketInfo.askp;
      } else if (this.order.direction === 2) {
        return this.currentMarket.marketInfo.bidp;
      }
      return '';
    },
    lossProfitOrder() {
      const filterOrders = this.positionList.filter(position => position.posid === this.lossProfitOrderId);
      if (filterOrders.length > 0) {
        return filterOrders[0];
      }
      return {};
    },
    fixedVal() {
      const min = `${this.lossProfitOrder.minfloat}` || 'abcd';
      return min.indexOf('.') > -1 ? min.split('.')[1].length : 0;
    },
    // 止盈点数
    profitPrice() {
      if (this.lossProfitOrder.direction === '1') {
        return parseFloat(this.lossProfitOrder.buyprice) + parseFloat(this.lossProfit.stopprofit * this.lossProfitOrder.minfloat);
      }
      return parseFloat(this.lossProfitOrder.buyprice) - parseFloat(this.lossProfit.stopprofit * this.lossProfitOrder.minfloat);
    },
    lossPrice() {
      if (this.lossProfitOrder.direction === '1') {
        return parseFloat(this.lossProfitOrder.buyprice) - parseFloat(this.lossProfit.stoploss * this.lossProfitOrder.minfloat);
      }
      return parseFloat(this.lossProfitOrder.buyprice) + parseFloat(this.lossProfit.stoploss * this.lossProfitOrder.minfloat);
    },
    profitAmount() {
      return Number(this.lossProfitOrder.quantity) * Number(this.lossProfitOrder.perprofit) * Number(this.lossProfit.stopprofit);
    },
    lossAmount() {
      return Number(this.lossProfitOrder.quantity) * Number(this.lossProfitOrder.perprofit) * Number(this.lossProfit.stoploss) * -1;
    },
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.refreshId);
    next();
  },
  async created() {
    const bankRes = await getwalletbank({
      usertoken: this.$root.usertoken,
      currenttype: 'CNY',
    });
    if (bankRes.status === '1') {
      this.idauthentication = bankRes.idauthentication;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 页面初始化
     */
    async init() {
      this.loadPositionList();
      this.loadSettlementList();
      this.loadUnfinishedList();
      await this.loadMarketList();
      if (this.marketList.length > 0) {
        this.currentMarket.contractid = this.marketList[0].contractid;
      }
      this.refreshTimetamp = (new Date()).getTime();
      await this.loadChartData();
      this.refreshId = setTimeout(() => {
        this.initRefresh();
      }, this.refreshInterval);
    },
    /**
     * 初始化页面数据刷新
     */
    async initRefresh() {
      try {
        await Promise.all([
          this.loadMarketList(),
          this.loadChartData(true),
          this.loadPositionList(),
        ]);
      } finally {
        this.refreshId = setTimeout(() => {
          this.initRefresh();
        }, this.refreshInterval);
      }
    },
    /**
     * 加载行情列表
     */
    async loadMarketList() {
      try {
        const res = await contractdatalist();
        if (res.status === '1') {
          this.marketList = res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * 加载选中行情数据
     */
    loadChartData(isRefresh = false) {
      if (this.chartType === 0) {
        const params = {
          contractid: this.currentMarket.contractid,
        };
        if (isRefresh && this.currentMarket.shareData.length > 0) {
          params.time = this.currentMarket.shareData[this.currentMarket.shareData.length - 1].times;
          params.count = this.count;
          params.ba = 2;
        }
        this.loadCurrentMarketShare(params, isRefresh ? this.refreshTimetamp : '');
      } else {
        const params = {
          contractid: this.currentMarket.contractid,
          type: this.chartType,
          count: 200,
        };
        if (isRefresh && this.currentMarket.candleData.length > 0) {
          params.time = this.currentMarket.candleData[this.currentMarket.candleData.length - 1].timestamp;
          params.ba = 2;
        }
        this.loadCurrentMarketCandle(params, isRefresh ? this.refreshTimetamp : '');
      }
    },
    /**
     * 加载蜡烛图
     */
    async loadCurrentMarketCandle({
      contractid,
      type,
      count,
      time,
      ba,
    }, timestamp) {
      try {
        const res = await futureskline({
          contractid,
          type,
          count,
          time,
          ba,
        });
        if (res.status === '1') {
          const offset = 10 ** (+res.data.place);
          this.currentMarket.marketInfo = {
            ...res.data,
          };
          if (timestamp !== this.refreshTimetamp) {
            this.currentMarket.candleData = res.data.timedata.reverse().map((item) => {
              return {
                date: parseDate(item.timestamp),
                open: +item.openp / offset,
                high: +item.highp / offset,
                low: +item.lowp / offset,
                close: +item.nowv / offset,
                vol: +item.curvol,
                updownrate: item.updownrate,
                timestamp: item.timestamp,
              };
            });
          } else {
            const lastItem = this.currentMarket.candleData[this.currentMarket.candleData.length - 1];
            res.data.timedata.reverse().forEach((item, index) => {
              const temItem = {
                date: parseDate(item.timestamp),
                open: +item.openp / offset,
                high: +item.highp / offset,
                low: +item.lowp / offset,
                close: +item.nowv / offset,
                vol: +item.curvol,
                updownrate: item.updownrate,
                timestamp: item.timestamp,
              };
              if (index === 0 && item.timestamp === lastItem.timestamp) {
                this.currentMarket.candleData.splice(-1, 1, temItem);
              } else {
                this.currentMarket.candleData.push(temItem);
              }
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * 加载分时图
     */
    async loadCurrentMarketShare({
      contractid,
      count,
      time,
      ba,
    }, timestamp) {
      try {
        const res = await futuresshare({
          contractid,
          count,
          time,
          ba,
        });

        if (res.status === '1') {
          const offset = 10 ** (+res.data.place);
          this.currentMarket.marketInfo = {
            ...res.data,
          };
          if (timestamp !== this.refreshTimetamp) {
            this.shareTotalValue = 0;
            this.shareTotalVolume = 0;
            this.currentMarket.shareData = res.data.timedata.reverse().map((item) => {
              this.shareTotalValue += +item.curvalue;
              this.shareTotalVolume += +item.curvolume;
              return {
                date: parseDate(item.times),
                price: +item.curp / offset,
                vol: +item.curvolume,
                ma: +this.shareTotalValue / offset / this.shareTotalVolume,
                value: item.curvalue,
                updownrate: item.updownrate,
                times: item.times,
              };
            });
          } else {
            const lastItem = this.currentMarket.shareData[this.currentMarket.shareData.length - 1];
            res.data.timedata.reverse().forEach((item, index) => {
              if (index === 0 && item.times === lastItem.times) {
                this.shareTotalValue = (this.shareTotalValue - (+lastItem.value)) + (+item.curvalue);
                this.shareTotalVolume = (this.shareTotalVolume - (+lastItem.vol)) + (+item.curvolume);
                const temItem = {
                  date: parseDate(item.times),
                  price: +item.curp / offset,
                  vol: +item.curvolume,
                  ma: +this.shareTotalValue / offset / this.shareTotalVolume,
                  value: item.curvalue,
                  updownrate: item.updownrate,
                  times: item.times,
                };
                this.currentMarket.shareData.splice(-1, 1, temItem);
              } else {
                this.shareTotalValue += +item.curvalue;
                this.shareTotalVolume += +item.curvolume;
                const temItem = {
                  date: parseDate(item.times),
                  price: +item.curp / offset,
                  vol: +item.curvolume,
                  ma: +this.shareTotalValue / offset / this.shareTotalVolume,
                  value: item.curvalue,
                  updownrate: item.updownrate,
                  times: item.times,
                };
                this.currentMarket.shareData.push(temItem);
              }
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * 加载持仓列表
     */
    async loadPositionList() {
      if (this.$root.usertoken) {
        try {
          const tradeRes = await tradeHomePageInfo({
            usertoken: this.$root.usertoken,
          }, this.$root.simulate);
          if (tradeRes.status === '1') {
            this.account = {
              totalprofit: tradeRes.data.totalprofit,
              canusedamount: tradeRes.data.canusedamount,
              frozenamout: tradeRes.data.frozenamout,
              posnum: tradeRes.data.posnum,
            };
            this.positionList = tradeRes.data.list;
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    /**
     * 加载结算列表
     */
    async loadSettlementList() {
      if (this.$root.usertoken) {
        try {
          this.settlementListLoading = true;
          const settleRes = await closetrade({
            usertoken: this.$root.usertoken,
            page: this.settlementListPage + 1,
            pagesize: this.pageSize,
          }, this.$root.simulate);
          if (settleRes.status === '1') {
            if (settleRes.data.list.length > 0) {
              this.settlementListPage += 1;
              this.settlementListTotal = false;
              const top = document.getElementById('app').scrollTop;
              this.settlementList = this.settlementList.concat(settleRes.data.list);
              this.$nextTick(() => {
                document.getElementById('app').scrollTop = top;
              });
            } else {
              this.settlementListTotal = true;
            }
          }
        } catch (err) {
          console.log(err);
        } finally {
          this.settlementListLoading = false;
        }
      }
    },
    /**
     * 加载流单列表
     */
    async loadUnfinishedList() {
      if (this.$root.usertoken) {
        try {
          this.unfinishedListLoading = true;
          const unfinishedRes = await querydroporder({
            usertoken: this.$root.usertoken,
            page: this.unfinishedListPage + 1,
            pagesize: this.pageSize,
          }, this.$root.simulate);
          if (unfinishedRes.status === '1') {
            if (unfinishedRes.data.list.length > 0) {
              this.unfinishedListPage += 1;
              this.unfinishedListTotal = false;
              const top = document.getElementById('app').scrollTop;
              this.unfinishedList = this.unfinishedList.concat(unfinishedRes.data.list);
              this.$nextTick(() => {
                document.getElementById('app').scrollTop = top;
              });
            } else {
              this.unfinishedListTotal = true;
            }
          }
        } catch (err) {
          console.log(err);
        } finally {
          this.unfinishedListLoading = false;
        }
      }
    },
    /**
     * 加载下单时数据
     */
    async loadBuyPage() {
      if (this.$root.usertoken) {
        try {
          const res = await buypage({
            usertoken: this.$root.usertoken,
            contractid: this.currentMarket.contractid,
            bstype: this.order.direction,
          }, this.$root.simulate);
          if (res.status === '1') {
            this.orderInfo = {
              ...res.data,
            };
            return true;
          }
        } catch (err) {
          console.log(err);
        }
      }
      return false;
    },
    /**
     * 选择交易品种
     */
    selectCurrentMarket(row) {
      this.currentMarket.contractid = row.contractid;
      this.refreshTimetamp = (new Date()).getTime();
      this.loadChartData();
    },
    currentMarketStyle({
      row,
    }) {
      const actived = +row.contractid === +this.currentMarket.contractid ? 'actived' : '';
      const updown = this.getColor(row.updown);
      return `${actived} ${updown} market-item`;
    },
    getColor(updown) {
      if (updown) {
        if (updown.indexOf('+') > -1) {
          return 'red';
        } else if (updown.indexOf('-') > -1) {
          return 'green';
        }
        return 'gray';
      }
      return '';
    },
    /**
     * 显示下单面板
     */
    async showOrderPanel(direction) {
      if (this.$root.usertoken) {
        if (this.$root.simulate || this.idauthentication === 1) {
          if (this.currentMarket.marketInfo.openstatus === '1') {
            this.orderPanelLoading = true;
            this.orderPanelVisible = true;
            await this.loadBuyPage();
            this.stopLev = 1;
            this.order = {
              ...this.order,
              direction: direction,
              quantity: 1,
              stopprofit: +this.orderInfo.perstopprofit,
              stoploss: +this.orderInfo.perstoploss,
              tradefee: +this.orderInfo.perrmbfee,
              margin: +this.orderInfo.perrmbmargin,
            };
            this.orderPanelLoading = false;
          } else {
            this.$message({
              message: this.currentMarket.marketInfo.tradestatustip || '非交易时间不能交易',
              type: 'info',
            });
          }
        } else {
          this.$confirm('您还没有实名认证，请先实名认证', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
          }).then(() => {
            this.$router.push('/personalcenter');
          }, () => {});
        }
      } else {
        this.$root.eventBus.$emit(EventName.noticeLogin);
      }
    },
    /**
     * 下单
     */
    async orderHandler() {
      if (this.$root.usertoken) {
        try {
          this.orderPanelLoading = true;
          const res = await order({
            usertoken: this.$root.usertoken,
            contractid: this.currentMarket.contractid,
            ...this.order,
          }, this.$root.simulate);
          this.orderPanelLoading = false;
          if (res.info === '购买力不足') {
            // this.orderPanelVisible = false;
            this.chargeMessage = res.info;
            this.chargePanel = true;
          } else if (res.status === '1') {
            this.orderPanelVisible = false;
            this.loadPositionList();
            this.$message({
              message: res.info,
              type: 'success',
            });
          } else {
            this.$message({
              message: res.info,
              type: 'warning',
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    /**
     * 切换买涨，买跌
     */
    changeOrderDirection(direction) {
      this.order.direction = direction;
    },
    async closePositionHandler(item) {
      if (this.$root.usertoken) {
        try {
          await this.$confirm('确定平仓？', '', {
            confirmButtonClass: 'confirm-btn',
            confirmButtonText: '确定',
            cancelButtonClass: 'cancel-btn',
            cancelButtonText: '取消',
            center: true,
          });
          const res = await closepos({
            usertoken: this.$root.usertoken,
            posid: item.posid,
            ordertype: 2,
            quantity: item.quantity,
            datatype: 5,
          }, this.$root.simulate);
          if (res.status === '1') {
            this.loadPositionList();
            this.settlementListPage = 0;
            this.loadSettlementList();
            this.$message({
              message: res.info,
              type: 'success',
            });
          } else {
            this.$message({
              message: res.info,
              type: 'warning',
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    /**
     * 初始化止盈止损面板数据
     */
    setLossProfit(item) {
      this.lossProfitOrderId = item.posid;
      this.lossProfit.stoploss = -this.lossProfitOrder.stoplossnum;
      this.lossProfit.stopprofit = +this.lossProfitOrder.stopprofitnum;
      this.lossProfitOrderPanel = true;
    },
    /**
     * 验证止盈止损
     */
    validateLossProfit() {
      if (isNaN(+this.lossProfit.stopprofit) || isNaN(+this.lossProfit.stoploss)) {
        this.$message({
          message: '请输入正确的数字',
          type: 'info',
        });
        return false;
      }
      if (this.lossProfit.stopprofit.toString().indexOf('.') > -1 || this.lossProfit.stoploss.toString().indexOf('.') > -1) {
        this.$message({
          message: '止盈止损必须为整数',
          type: 'info',
        });
        return false;
      }
      if (+this.lossProfit.stopprofit > +this.lossProfitOrder.maxprofitnum || +this.lossProfit.stopprofit < +this.lossProfitOrder.minprofitnum) {
        this.$message({
          message: this.lossProfitOrder.setprofittxt,
          type: 'info',
        });
        return false;
      }
      if (+this.lossProfit.stoploss > Math.abs(this.lossProfitOrder.maxlossnum) || +this.lossProfit.stoploss < Math.abs(this.lossProfitOrder.minlossnum)) {
        this.$message({
          message: this.lossProfitOrder.setlosstxt,
          type: 'info',
        });
        return false;
      }
      return true;
    },
    /**
     * 设置止盈止损
     */
    async lossProfitHandler() {
      if (this.$root.usertoken) {
        const validate = this.validateLossProfit();
        if (validate) {
          this.lossProfitLoading = true;
          const res = await setstopprice({
            usertoken: this.$root.usertoken,
            posid: this.lossProfitOrderId,
            stopprofit: this.profitAmount,
            stoploss: this.lossAmount,
          }, this.$root.simulate);
          if (res.status === '1') {
            this.lossProfitOrderPanel = false;
            this.$message({
              message: res.info,
              type: 'success',
            });
            await this.loadPositionList();
          } else {
            this.$message({
              message: res.info,
              type: 'warning',
            });
          }
          this.lossProfitLoading = false;
        }
      }
    },
    changeIndicatorType(type) {
      this.indicatorType = type;
      this.candleChart.changeIndicatorType(type);
    },
    marketListSort(a, b) {
      return (+a.updownrate.replace('%', '').replace('+', '')) - (+b.updownrate.replace('%', '').replace('+', ''));
    },
    toCharge() {
      this.chargePanel = false;
      this.$router.push('/personalcenter/2');
    },
    changeSimulateHandler(simulate) {
      this.$root.eventBus.$emit('changeSimulate', simulate);
    },
    chargeHandler() {
      if (this.$root.usertoken) {
        this.$router.push('/personalcenter/2');
      } else {
        this.$root.eventBus.$emit(EventName.noticeLogin);
      }
    },
  },
});
