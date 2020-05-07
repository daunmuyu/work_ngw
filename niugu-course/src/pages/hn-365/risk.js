import Vue from 'vue';
import { Toast } from 'vant';
import bridge from 'ng-bridge';

import { delay } from './service/util';
import { getQues, addAnswer, getRiskRes } from './service/api';

import './scss/risk.scss';

Vue.use(Toast);

new Vue({
  el: '#app',
  data() {
    return {
      progress: 1,
      answer: null,
      questions: [],
      transitionName: 'slide',
      resultData: null,
      utoken: bridge.search('usertoken') || bridge.search('userToken'),
    };
  },
  watch: {
    progress(news, olds) { // 动画切换
      this.transitionName = news < olds ? 'slide_back' : 'slide';
      console.log(news, olds);
    },
    answer(old) {
      console.log(old);
    },
  },
  beforeCreate() {
    bridge.init();
    bridge.initRefresh(0);
    bridge.setTitle('风险评测');
  },
  created() {
    if (this.utoken) {
      this.init();
    } else {
      bridge.utoken((ut) => {
        this.utoken = ut;
        this.init();
      });
    }
  },
  methods: {
    init() {
      getQues({
        usertoken: this.utoken,
      }).then((res) => {
        if (+res.code === 0) {
          this.answer = this.answerArr(res.questions);
          this.questions = res.questions;
        } else {
          Toast.error(res.message || '网络不好，刷新或退出重试~ ');
        }
      });
    },
    answerArr(arr) {
      const newArr = [];
      arr.forEach((v) => {
        let newVal = [];
        if (v.answers.length === 1) newVal = `${v.questionID}${v.answers}`;
        if (v.answers.length > 1) {
          v.answers.split(',').forEach(val => {
            newVal.push(`${v.questionID}${val}`);
          });
        }
        newArr.push(newVal);
      });
      this.progress = newArr.filter(v => v.length).length + 1;
      // if (this.progress > arr.length) this.complete();
      console.log(this.score(newArr));
      return newArr;
    },
    answerStr() {
      return this.answer[this.progress - 1].toString().replace(/\d/g, '');
    },
    prev() {
      delay(() => {
        this.progress -= 1;
      }, 200);
    },
    nextResult() {
      delay(() => {
        if (this.answer[this.progress - 1].length) {
          addAnswer({
            usertoken: this.utoken,
            qID: this.progress,
            answers: this.answerStr(),
          }).then(res => {
            if (+res.code === 0 && +res.result === 1) {
              if (+this.progress === this.questions.length) {
                this.complete();
              } else {
                this.progress += 1;
              }
            } else {
              Toast(res.message);
            }
          });
        } else {
          Toast('请选择答案啊！~ ');
        }
      }, 200);
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
    telPhone(tel) {
      bridge.telPhone(tel);
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
    complete() {
      getRiskRes({
        usertoken: this.utoken,
      }).then(res => {
        if (+res.result === 1) {
          this.resultData = res;
          console.log(this.resultData);
        } else {
          Toast.error(res.message);
        }
      });
    },
  },
});
