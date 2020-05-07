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
      employee: {
        phone: '',
        nickName: '',
        userName: '',
        img: '',
        status: 1,
        roleId: 0,
        summary: '',
      },
      employeeValidate: {
        phone: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur',
          }
        ],
        nickName: [
          {
            required: true,
            message: '昵称不能为空',
            trigger: 'blur',
          }
        ],
        img: [
          {
            required: true,
            message: '头像不能为空',
            trigger: 'blur',
          }
        ],
        roleId: [
          {
            validator: (rule, value, callback) => {
              // 2是助理，3是老师
              if (value === 2 || value === 3 || value === 4) {
                callback();
              } else {
                callback(new Error('角色不能为空'));
              }
            },
            trigger: 'blur',
          }
        ]
      },
    };
  },
  computed: {
    ...mapGetters([
      'employeeStatusList',
      'employeeRoleList',
    ])
  },
  mounted() {
    if (this.$route.name === 'employeeDetail') {
      this.title = '查看内部人员';
      this.getEmployee();
    } else if (this.$route.name === 'editEmployee') {
      this.title = '编辑内部人员';
      this.getEmployee();
    } else if (this.$route.name === 'newEmployee') {
      this.title = '创建内部人员';
    }
  },
  methods: {
    ...mapActions([
      'getEmployeeDetail',
      'addEmployee',
      'editEmployee',
    ]),
    getEmployee() {
      if (this.$route.params && this.$route.params.employeeId) {
        this.getEmployeeDetail({
          Id: this.$route.params.employeeId,
        }).then((res) => {
          console.log(4312, res);
          this.employee = res;
        });
      }
    },
    changePhone() {
      this.$refs.phone.click();
    },
    removePhone() {
      this.employee.img = '';
    },
    uploadImg({
      target: {
        files,
      },
    }) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data.length > 0) {
          this.employee.img = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    saveHandler() {
      this.$refs.employee.validate((valid) => {
        if (valid) {
          if (this.$route.name === 'newEmployee') {
            this.addEmployeeHandler();
          } else if (this.$route.name === 'editEmployee') {
            this.editEmployeeHandler();
          }
        }
      });
    },
    addEmployeeHandler() {
      this.addEmployee({
        ...this.employee,
      }).then((res) => {
        if (res.code === 1) {
          this.$Message.success('创建成功');
          setTimeout(() => {
            this.$router.push('/employee');
          }, 1000);
        } else {
          this.$Message.warning('创建失败');
        }
      });
    },
    editEmployeeHandler() {
      const params = {
        ...this.employee,
      };
      if (!params.img || params.img.indexOf('data:image') === -1) {
        delete params.img;
      }
      this.editEmployee(params).then((res) => {
        if (res.code === 1) {
          this.$Message.success('保存成功');
          setTimeout(() => {
            this.$router.push('/employee');
          }, 1000);
        } else {
          this.$Message.warning('保存失败');
        }
      })
    },
  },
});
