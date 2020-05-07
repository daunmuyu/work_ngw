import Vue from 'vue';
import {
  mapGetters,
  mapActions,
} from 'vuex';
import template from './index.html';
import './style.scss';

// 分页条数
const pageSize = 10;

export default Vue.extend({
  template,
  data() {
    return {
      customerColumns: [
        {
          title: 'ID',
          key: 'agentUserID',
          align: 'center',
        },
        {
          title: '资金账号',
          key: 'fundAccount',
          align: 'center',
        },
        {
          title: '真实姓名',
          key: 'realName',
          align: 'center',
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
        },
        {
          title: '直播间',
          key: 'liveRoomList',
          align: 'center',
        },
        {
          title: '最后登录时间',
          key: 'lastLoginTime',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'crateTime',
          align: 'center',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          render: (h, { row }) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.customerDetail(row);
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editCustomer(row);
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteCustomerHandler(row);
                  }
                }
              }, '删除')]);
          },
        },
      ],
      pageSize,
      page: 1,
      total: 0,
      query: {
        fundAccount: '',
        realName: '',
        liveRoomID: '',
        status: 1,
        beginLoginTime: '19000101',
        endLoginTime: '29990101',
        beginCreateTime: '19000101',
        endCreateTime: '29990101',
      }
    };
  },
  computed: {
    ...mapGetters([
      'customerList',
      'customerListTotal',
      'customerStatusList',
    ]),
  },
  mounted() {
    this.refreshCustomerList();
  },
  methods: {
    ...mapActions([
      'loadCustomerList',
      'deleteCustomer',
    ]),
    refreshCustomerList() {
      this.loadCustomerList({
        ...this.query,
        page: this.page,
        pageSize: this.pageSize,
      }).then((res) => {
        // console.log(1232, res);
        if (res.error_no !== 0) {
          this.$Message.info(res.error_info);
        }
      });
    },
    changePage(page) {
      this.page = page;
      this.refreshCustomerList();
    },
    lastLoginTimeChanged(timerange) {
      this.query.beginLoginTime = timerange[0] ? timerange[0] : '19000101';
      this.query.endLoginTime = timerange[1] ? timerange[1] : '29990101';
    },
    createTimeChanged(timerange) {
      this.query.beginCreateTime = timerange[0] ? timerange[0] : '19000101';
      this.query.endCreateTime = timerange[1] ? timerange[1] : '29990101';
    },
    newCustomer() {
      this.$router.push('/customer/new');
    },
    customerDetail(customer) {
      // console.log('detail');
      this.$router.push(`/customer/detail/${customer.agentUserID}`);
    },
    editCustomer(customer) {
      console.log('edit');
      this.$router.push(`/customer/edit/${customer.agentUserID}`);
    },
    deleteCustomerHandler(customer) {
      console.log('delete');
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？',
        width: 300,
        onOk: () => {
          // console.log('do del');
          this.deleteCustomer({
            agentUserID: customer.agentUserID,
          }).then((res) => {
            if (res.error_no === 0) {
              this.$Message.success('删除成功!');
              this.refreshCustomerList();
            } else {
              this.$Message.warning(res.error_info);
            }
          });
        }
      });
    },
  },
});
