import Vue from 'vue';
import 'babel-polyfill';
import bridge from 'ng-bridge';

import 'muse-ui/lib/styles/base.less';
import { Snackbar, Icon } from 'muse-ui';
import Toast from 'muse-ui-toast';
import 'muse-ui/lib/styles/theme.less';

import { getQuestions, addRisk, riskResult, get } from './api/api';

import './style.scss';

Vue.use(Snackbar);
Vue.use(Icon);
Vue.use(Toast, {
  position: 'top',
  closeIcon: 'close',
  close: false,
  successIcon: '', // 成功信息图标
  infoIcon: '', // 信息信息图标
  warningIcon: '', // 提醒信息图标
  errorIcon: '' // 错误信息图标
});

const courseid = bridge.search('courseid') || bridge.search('cid');
const usertoken = bridge.search('usertoken') || bridge.search('userToken');

// 节流函数
const delay = (() => {
  let timer = 0;
  return (callback, ms) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

new Vue({
  el: '#app',
  data() {
    return {
      progress: 1,
      answer: null,
      questions: null,
      transitionName: 'slide',
      resultData: null,
    };
  },
  watch: {
    progress(news, olds) { // 动画切换
      console.log(`${news}<=>${olds}`);
      this.transitionName = news < olds ? 'slide_back' : 'slide';
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      bridge.init();
      bridge.initRefresh(0);
      bridge.setTitle('风险评测');
      this.getQues();
    },
    getQues() {
      getQuestions({
        usertoken,
        courseid,
      }).then(res => {
        document.body.style.display = 'block';
        if (+res.code) {
          Toast.error(res.message || '网络不好，刷新或退出重试~ ');
        } else {
          this.questions = res.data;
          this.answer = [...Array(this.questions.length).fill([])];
        }
      });
    },
    score(arr) {
      let score = 0;
      console.log(arr);
      if (arr[0].length === 0) return 8;
      arr.forEach((ele) => {
        if (typeof ele === 'object') {
          score += Math.max(...ele.map(item => item.charAt(0) * 1));
        } else {
          score += Number(ele.charAt(0));
        }
      });
      return score;
    },
    answerStr() {
      return this.answer[this.progress - 1].toString().replace(/\d/g, '');
    },
    addRiskProfile() {
      if (this.answer[this.progress - 1].length) {
        addRisk({
          usertoken,
          courseid,
          questionId: this.progress,
          answers: this.answerStr(),
        }).then(res => {
          if (+res.code === 0 && +res.result === 1) {
            if (+this.progress === this.questions.length) {
              this.complete(this.score(this.answer));
            } else {
              this.progress += 1;
            }
          } else {
            Toast.error(res.message);
          }
        });
      } else {
        Toast.error('请选择答案啊！~ ');
      }
    },
    nextResult() {
      delay(() => {
        this.addRiskProfile();
      }, 150);
    },
    agreeOrNot(url) {
      if (url) {
        get(url, '').then(res => {
          Toast.info(res.message);
          this.goBack();
        });
      } else {
        this.goBack();
      }
    },
    goBack() {
      setTimeout(() => {
        if (bridge.search('packtype')) {
          bridge.closePage();
        } else {
          window.history.back();
        }
      }, 1500);
    },
    prev() {
      delay(() => {
        this.progress -= 1;
      }, 150);
    },
    telPhone(tel) {
      bridge.telPhone(tel);
    },
    complete(score) {
      riskResult({
        usertoken,
        courseid,
        score,
      }).then(res => {
        if (+res.result === 1) {
          this.resultData = res.data;
        } else {
          Toast.error(res.message);
        }
      });
    },
  }
});
