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
      totalPage: 1,
      roomid: undefined,
      current: 1,
      videoColumns: [{
          title: 'ID',
          key: 'id',
          align: 'center',
        },
        {
          title: '视频标题',
          key: 'liveTitle',
          align: 'center',
        },
        {
          title: '视频配图',
          align: 'center',
          render: (h, {
            row
          }) => {
            return h('img', {
              domProps: {
                src: row.cover,
                style: 'width: 115px;margin-top: 10px;maring-bottom:10px'
              }
            })
          }
        },
        {
          title: '描述',
          key: 'description',
          align: 'center',
        },
        {
          title: '开始时间',
          key: 'starttime',
          align: 'center',
        },
        {
          title: '结束时间',
          key: 'endtime',
          align: 'center',
        },
        {
          title: '是否精彩视频',
          key: 'strnumber',
          align: 'center',
          width: '120',
          render: (h, {
            row
          }) => {
            return h('Checkbox', {
              props: {
                value: row.bright === 1,
              },
              on: {
                'on-change': async () => {
                  const res = await this.settingVideoHandler(row.id, 1);
                  return res;
                },
              },
            });
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 180,
          render: (h, {
            row
          }) => {
            return h('div', [
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
                    this.editVideoHandler(row);
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.settingVideoHandler(row.id, 2);
                  }
                }
              }, '置顶'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.settingVideoHandler(row.id, 3);
                  }
                }
              }, '删除'),
            ]);
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'liveList',
      'videoList',
    ]),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions([
      'loadLiveList',
      'loadVideoList',
      'settingVideo',
    ]),
    async init() {
      await this.loadLiveList();
      if (this.liveList.length > 0) {
        this.roomid = this.liveList[0].roomId;
        this.handleLoadVideoList(1);
        // this.loadVideoList({
        //   roomid: this.roomid,
        //   id: 657
        // });
      }
    },
    liveChanged(value) {
      this.roomid = value;
      console.log('change')
      this.handleLoadVideoList()
    },
    pageChanged(pageNum) {
      console.log(pageNum)
      this.handleLoadVideoList(pageNum);
    },
    editVideoHandler(row) {
      this.$router.push(`/video/edit/${row.id}`)
    },
    topVideoHandler(row) {
      console.log(row);
    },
    handleLoadVideoList(num) {
      this.current = 1;
      if (!num) {
        num = 1;
        this.current = 1;
      }
      this.loadVideoList({
        roomid: this.roomid,
        pageSize: 10,
        pageIndex: num
      }).then((res) => {
        this.totalPage = res.count;
        window.scrollTo(0, 0);
      });
    },
    delVideoHandler(row) {
      console.log('del');
    },
    addVideo() {
      this.$router.push('/video/new');
    },
    async settingVideoHandler(id, type) {
      console.log(232);
      try {
        const res = await this.settingVideo({
          id,
          t: type,
        });
        if (res.code !== 1) {
          throw new Error();
        }
        this.$Message.success('修改成功');
        this.handleLoadVideoList();
        return true;
      } catch (err) {
        this.$Message.warning('修改异常');
        return false;
      }
    }
  },
});
