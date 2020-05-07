import Vue from 'vue';
import {
  mapGetters,
  mapActions,
} from 'vuex';
import template from './index.html';
import './style.scss';

export default Vue.extend({
  template,
  data() {
    return {
      title: '',
      customerId: undefined,
      brokerList: [],
      customer: {
        fundAccount: '',
        realName: '',
        status: 1,
        roomIds: [],
        strategyIds: [],
        strategyIds2: [],
        brokerType: -1,
        followStrategyIds: []
      },
      customerValidate: {
        fundAccount: [
          {
            required: true,
            message: '资金账号不能为空',
            trigger: 'blur',
          },
        ],
      },
      liveList: [],
      strategyList: [],
      indicatorList: [],
      indicatorListCheck: []
    };
  },
  computed: {
    ...mapGetters([
      'customerStatusList',
    ]),
  },
  mounted() {
    if (this.$route.name === 'newCustomer') {
      this.title = '创建观众';
      this.getLiveList();
      this.getStragtegyList();
    } else if (this.$route.name === 'editCustomer') {
      this.title = '编辑观众';
      this.getCustomer();
    } else if (this.$route.name === 'customerDetail') {
      this.title = '查看观众';
      this.getCustomer();
    }
    this.getBrokerList();
    // this.getindicatorstatus();
  },
  methods: {
    ...mapActions([
      'getCustomerById',
      'addCustomer',
      'editCustomer',
      'loadLiveList',
      'loadStragtegyList',
      'loadBrokerList',
      'handleGetindicatorstatus',
      'handleSetindicatorstatus'
    ]),
    // async getInitInfo() {
    //   this.getBrokerList();
    //   await this.getCustomer();
    //   await this.getindicatorstatus();
    // },
    getCustomer() {
      if (this.$route.params && this.$route.params.customerId) {
        this.getCustomerById({
          agentUserID: this.$route.params.customerId,
        }).then((res) => {
          console.log(321, res);
          this.customer = {
            fundAccount: res.fundAccount,
            brokerType: res.brokerType,
            realName: res.realName,
            status: res.status,
            roomIds: res.data.filter(item => item.status === 1).map(item => item.liveRoomID),
            strategyIds: res.data.filter(item => item.strategyStatus === 1).map(item => item.liveRoomID),
            strategyIds2: res.quantStrategy.filter(item => item.visible === 1).map(item => item.strategyID),
            followStrategyIds: res.quantStrategy.filter(item => item.visible === 1 && item.isFollow === 1).map(item => item.strategyID),
          };
          this.liveList = res.data;
          this.strategyList = res.quantStrategy;
          this.getindicatorstatus();
        });
      }
    },
    setindicatorstatus() {
      const statusList = this.indicatorList.map((v) => {
        if (this.indicatorListCheck.includes(v.IndicatorID)) {
          return 1;
        }
        return 0;
      });
      const indicatorIdList = this.indicatorList.map((v) => {
        return v.IndicatorID
      });
      this.handleSetindicatorstatus({
        brokerType: this.customer.brokerType,
        indicatorIdList,
        statusList,
        brokerAccount: this.customer.fundAccount
      }).then((res) => {
        console.log(res)
      })
    },
    getindicatorstatus() {
      console.log(this.customer)
      this.handleGetindicatorstatus({
        brokerType: this.customer.brokerType,
        brokerAccount: this.customer.fundAccount
      }).then((res) => {
        if (+res.error_no === 0) {
          this.indicatorList = res.data;
          this.indicatorListCheck = this.indicatorList.map((v) => {
            if (+v.Status === 1) {
              return v.IndicatorID
            }
            return null;
          })
        }
        console.log(this.indicatorList)
      })
    },
    getLiveList() {
      this.loadLiveList().then((res) => {
        if (res.result === 1) {
          this.liveList = res.data.map((live, index) => {
            return {
              liveRoomID: live.roomId,
              liveTitle: live.Title,
            };
          });
        }
      });
    },
    getBrokerList() {
      this.loadBrokerList().then((res) => {
        this.brokerList = res.data;
      })
    },
    getStragtegyList() {
      this.loadStragtegyList().then((res) => {
        if (res.error_no === 0) {
          this.strategyList = res.quantStrategy;
          console.log(this.strategyList)
        }
      });
    },
    roomIdsChanged() {
      // 如果取消直播间权限，同时取消该直播间订阅
      this.customer.strategyIds.forEach((roomId) => {
        if (this.customer.roomIds.indexOf(roomId) === -1) {
          const selIndex = this.customer.strategyIds.indexOf(roomId);
          this.customer.strategyIds.splice(selIndex, 1);
        }
      });
    },
    strategyIdsChanged() {
      console.log(this.customer.followStrategyIds);
      this.customer.followStrategyIds.forEach((strategyId) => {
        if (this.customer.strategyIds2.indexOf(strategyId) === -1) {
          const selIndex = this.customer.followStrategyIds.indexOf(strategyId);
          this.customer.followStrategyIds.splice(selIndex, 1);
        }
      });
    },
    saveHandler() {
      if (this.$route.name === 'newCustomer') {
        this.$refs.customer.validate((valid) => {
            if (valid) {
              this.addCustomerHandler();
            }
        });
      } else if (this.$route.name === 'editCustomer') {
        this.editCustomerHandler();
      }
    },
    addCustomerHandler() {
      this.addCustomer({
        brokerType: this.customer.brokerType,
        fundAccount: this.customer.fundAccount,
        realName: this.customer.realName,
        status: this.customer.status,
        roomIds: this.customer.roomIds.join(','),
        strategyIds: this.customer.strategyIds.concat(this.customer.strategyIds2).join(','),
        followStrategyIds: this.customer.followStrategyIds.join(','),
      }).then((res) => {
        if (res.error_no === 0) {
          this.$Message.success('创建成功');
          setTimeout(() => {
            this.$router.push('/customer');
          }, 1000);
        } else {
          this.$Message.warning(res.error_info);
        }
      });
    },
    editCustomerHandler() {
      console.log(this.customer);
      this.editCustomer({
        brokerType: this.customer.brokerType,
        agentUserID: this.$route.params.customerId,
        realName: this.customer.realName,
        status: this.customer.status,
        roomIds: this.customer.roomIds.join(','),
        strategyIds: this.customer.strategyIds.concat(this.customer.strategyIds2).join(','),
        followStrategyIds: this.customer.followStrategyIds.join(','),
      }).then((res) => {
        if (res.error_no === 0) {
          this.$Message.success('保存成功');
          this.setindicatorstatus();
          setTimeout(() => {
            this.$router.push('/customer');
          }, 1000);
        } else {
          this.$Message.warning(res.error_info);
        }
      })
    },
    indicatorChange() {
      console.log(this.indicatorList.map((v) => {
        if (this.indicatorListCheck.includes(v.IndicatorID)) {
          return 1;
        }
        return 0;
      }));
      console.log(this.indicatorList.map((v) => {
        return v.IndicatorID
      }));
    }
  }
});
