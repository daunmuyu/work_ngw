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
      liveColumns: [
        {
          title: 'ID',
          key: 'roomId',
          align: 'center',
        },
        {
          title: '直播间名称',
          key: 'Title',
          align: 'center',
        },
        {
          title: '直播间简介',
          key: 'Description',
          align: 'center',
        },
        {
          title: '直播间图片',
          align: 'center',
          render: (h, { row }) => {
            return h('img', {
              domProps: {
                src: row.cover,
                style: 'width: 100%;margin-top: 10px;maring-bottom:10px'
              }
            })
          }
        },
        {
          title: '策略名',
          key: 'strname',
          align: 'center',
        },
        {
          title: '牌照号',
          key: 'strnumber',
          align: 'center',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('div',[
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
                    this.editLiveHandler(row);
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
      'liveList'
    ]),
  },
  mounted() {
    this.loadLiveList();
  },
  methods: {
    ...mapActions([
      'loadLiveList',
    ]),
    editLiveHandler(live) {
      this.$router.push(`/live/edit/${live.roomId}`);
    }
  }
});
