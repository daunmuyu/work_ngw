import Vue from 'vue';
import EventName from 'EventName';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Login from '@/components/Login';
import RegProtocol from '@/components/RegProtocol';
import CustomerService from '@/components/CustomerService.vue';
import {
  contractdatalist,
} from 'API';


require('./index.scss');
const template = require('./index.html');

export default Vue.extend({
  metaInfo() {
    return {
      title: '人人期指',
      meta: [{                 // set meta
        name: 'keywords',
        content: '首页 官网',
      }, {
        name: 'description',
        content: '卓越的金融交易服务商,专为亚洲投资者量身定制的指数差价合约CFD产品交易服务平台',
      }],
    };
  },
  template,
  data() {
    return {
      contractList: [],
      watchList: [],
      middleIndex: 0,
      timerid: undefined,
    };
  },
  components: {
    Top: Header,
    Bottom: Footer,
    RegProtocol,
    Login,
    CustomerService,
  },
  watch: {
    contractList: {
      handler(nList, oList) {
        if (nList.length > 0 && oList.length > 0) {
          this.watchList = nList.map((item, index) => {
            if (item.nowv !== oList[index].nowv) {
              setTimeout(() => {
                // console.log(index);
                this.watchList[index].changed = false;
                // console.log(this.watchList[index]);
              }, 1000);
              return {
                changed: true,
              };
            }
            return {
              changed: false,
            };
          });
        }
      },
    },
  },
  mounted() {
    this.getData();
    this.timerid = setInterval(() => {
      this.getData();
    }, 3000);
  },
  beforeRouteLeave(to, from, next) {
    if (typeof this.timerid !== 'undefined') {
      clearInterval(this.timerid);
    }
    next();
  },
  methods: {
    regClick() {
      this.$root.eventBus.$emit(EventName.noticeRegister);
    },
    filterData(list, oldList) {
      let newList = [];
      if (oldList.length > 1) {
        for (let index = 0; index < oldList.length; index += 1) {
          const item = {};
          const oldElement = oldList[index];
          const element = list[index];
          if (oldElement.nowv < element.nowv) {
            item.flag = '1';
          } else if (oldElement.nowv > element.nowv) {
            item.flag = '-1';
          } else {
            item.flag = '0';
          }
          item.nowv = element.nowv;
          item.updownrate = element.updownrate;
          item.symbolname = element.symbolname;
          newList.push(item);
        }
      } else {
        newList = list;
      }
      return newList;
    },
    getData() {
      contractdatalist().then((res) => {
        console.log(res);
        if (res.status === '1') {
          this.contractList = res.data;
          this.middleIndex = Math.ceil(res.data.length / 2.0);
          // this.leftList = res.data.slice(0, midle);
          // this.rightList = res.data.slice(-midle);
          // 数据对比
          // this.leftList = this.filterData(leftList, this.leftList);
          // this.rightList = this.filterData(rightList, this.rightList);
          // console.log(rightList);
        }
      });
    },
    getColor(updown) {
      // console.log(updown);
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
    toTrade() {
      // document.body.scrollTop = this.$refs.qrcode.offsetTop;
      this.$router.push('/trade');
    },
  },
});
