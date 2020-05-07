// 预告管理
import Vue from 'vue';
import {
  mapGetters,
  mapActions,
} from 'vuex';
import { deepClone } from 'lib/utils';
import template from './index.html';
import './style.scss';


export default Vue.extend({
  template,
  data() {
    return {
      showEdit: false,
      editInfo: [],
      selectRoomId: undefined,
      noticeColumns: [{
          title: '直播室ID',
          key: 'roomId',
          align: 'center',
        },
        {
          title: '直播室名称',
          key: 'liveTitle',
          align: 'center',
        },
        // {
        //   title: '编辑日期',
        //   key: 'addtime',
        //   align: 'center',
        // },
        {
          title: '直播时间',
          align: 'center',
          render: (h , { row }) => {
            const { previewInfos } = row;
            return h('div', previewInfos.map(v => {
              // return h('Button', `${v.title} ${v.startTime.substring(11)}-${v.endTime.substring(11)}`);
              return h(
                'Button',
                {
                  style: {
                    marginTop: '15px',
                    width: '100%',
                  }
                },
                `${v.title} ${v.previewTime}`
              );
            }))
          }
        },
        {
          title: '预告图',
          align: 'center',
          render: (h, {
            row
          }) => {
            return h('img', {
              domProps: {
                src: row.notice,
                style: 'width: 100%;margin-top: 10px;maring-bottom:10px'
              }
            })
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          render: (h, {
            row
          }) => {
            return h('div', [
              h('input', {
                domProps: {
                  type: 'file',
                  id: `file${row.id}`,
                  name: `file${row.id}`,
                  style: 'display:none',
                },
                on: {
                  change: ({
                    target: {
                      files,
                    },
                  }) => {
                    if (files.length > 0) {
                      this.uploadImgHandler(row, files[0]);
                    }
                  },
                },
              }),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                domProps: {
                  for: row.id,
                },
                on: {
                  click: () => {
                    document.getElementById(`file${row.id}`).click();
                  }
                }
              }, '上传图片'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginTop: '10px'
                },
                domProps: {
                  for: row.id,
                },
                on: {
                  click: () => {
                    this.selectRoomId = row.roomId;
                    // this.editInfo = Object.assign({}, this.noticeList.find(v => v.roomId === this.selectRoomId).previewInfos);
                    this.editInfo = deepClone(this.noticeList.find(v => v.roomId === this.selectRoomId).previewInfos);
                    // this.editInfo[0].previewTime = '1099'
                    this.showEdit = true;
                  }
                }
              }, '编辑'),
            ]);
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'noticeList',
    ]),
  },
  mounted() {
    this.loadNoticeList();
    // console.log(this.noticeList)
  },
  watch: {
    // noticeList(v) {
    //   // console.log(v)
    //   if (v) {
    //     // console.log(v)
    //     this.editInfo = v;
    //   }
    // }
  },
  methods: {
    ...mapActions([
      'loadNoticeList',
      'updateNotice',
      'setNoticeInfo'
    ]),
    handleNoticeInfo(type, index) {
      const { editInfo = [] } = this;
      const dataLength = editInfo.length;
      if (type === 'add') {
        if (dataLength && (editInfo[dataLength - 1].title === '' || editInfo[dataLength - 1].previewTime === '')) {
          this.$Message.error('请确保已添加内容不为空~');
          return;
        }
        editInfo.push({
          title: '',
          previewTime: ''
        })
      } else if (type === 'delete') {
        editInfo.splice(index, 1);
      }
    },
    getBase64FromFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result;
          if (data.length > 0) {
            resolve(data);
          } else {
            reject();
          }
        };
        reader.readAsDataURL(file);
      });
    },
    handleSetNoticeInfo(payload) {
      const { editInfo = [] } = this;
      const dataLength = editInfo.length;
      if (!dataLength) {
        this.$Message.error('请确认至少包含一个项目~');
      }
      if (editInfo[dataLength - 1].title === '' || editInfo[dataLength - 1].previewTime === '') {
        this.$Message.error('请确保已添加内容不为空~');
        return;
      }
      this.setNoticeInfo({
        roomid: this.selectRoomId,
        previewInfos: payload
      }).then(res => {
        // console.log(res)
        const { code = 0 } = res;
        if (+code === 1) {
          this.$Message.success('提交成功');
          this.showEdit = false;
          this.loadNoticeList();
        } else {
          this.$Message.success(res.msg || '操作失败，请刷新页面后重试！');
        }
      })
    },
    async uploadImgHandler(notice, file) {
      if (file) {
        const fileData = await this.getBase64FromFile(file);
        const res = await this.updateNotice({
          Id: notice.roomId,
          img: fileData,
        });
        if (res.code === 1) {
          this.$Message.success('修改成功');
          this.loadNoticeList();
        } else {
          this.$Message.warning('修改异常');
        }
      }
    },
  }
});
