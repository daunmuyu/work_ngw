import Vue from 'vue'; // 内部人员管理
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
      employeeColumns: [
        {
          title: 'ID',
          key: 'Id',
          align: 'center',
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center',
        },
        {
          title: '昵称',
          key: 'nickName',
          align: 'center',
        },
        {
          title: '真实姓名',
          key: 'userName',
          align: 'center',
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, { row }) => {
            const status = row.status === 1 ? '正常' : '冻结';
            return h('span', status);
          },
        },
        {
          title: '角色',
          key: 'roleId',
          align: 'center',
          render: (h, { row }) => {
            let roleName = '';
            switch (row.roleId) {
              case 3:
                roleName = '老师';
                break;
              case 2:
                roleName = '助理';
                break;
              case 4:
                roleName = '高手';
                break;
              default:
                break;
            }
            // const roleName = row.roleId === 3 ? '老师' : '助理';
            return h('span', roleName);
          },
        },
        {
          title: '创建时间',
          key: 'addtime',
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
                    this.employeeDetail(row);
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
                    this.editEmployeeHandler(row);
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
                    this.deleteEmployeeHandler(row);
                  }
                }
              }, '删除')]);
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'employeeList',
    ]),
  },
  mounted() {
    this.loadEmployeeList();
  },
  methods: {
    ...mapActions([
      'loadEmployeeList',
      'deleteEmployee',
    ]),
    employeeDetail(employee) {
      this.$router.push(`/employee/detail/${employee.Id}`);
    },
    editEmployeeHandler(employee) {
      this.$router.push(`/employee/edit/${employee.Id}`);
    },
    deleteEmployeeHandler(employee) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？',
        width: 300,
        onOk: () => {
          this.deleteEmployee({
            Id: employee.Id,
          }).then((res) => {
            if (res.code === 1) {
              this.$Message.success('删除成功!');
              this.loadEmployeeList();
            } else {
              this.$Message.warning('删除失败');
            }
          });
        }
      });
    },
    newEmployeeHandler() {
      this.$router.push('/employee/new');
    },
  }
});
