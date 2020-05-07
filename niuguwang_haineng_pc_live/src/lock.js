import Cookie from 'js-cookie';
import $ from 'jquery';
import './lock.scss';

const usertoken = Cookie.get('hn-token') || Cookie.get('hn-tmptoken');

function submit() {
  const password = $('#password').val();
  if (password) {
    $.ajax({
      url: 'https://live.niuguwang.com/chat/ChatroomH5/HaiNengCheckPassword',
      data: {
        password,
        usertoken,
        liveID: '570',
      },
      type: 'post',
    }).success((res) => {
      if (res.code === 0) {
        location.href = './index.html';
        Cookie.set('mark', 1);
      } else {
        alert(res.message || '操作失败，请重试！');
      }
    }).error(() => {
      alert('网络错误！');
    });
  }
}

function check() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://live.niuguwang.com/chat/ChatroomH5/HaiNengIsHavePassword',
      data: {
        usertoken,
        liveID: '570',
      },
      type: 'post',
    }).success((res) => {
      resolve(res.isHavePwd === 1);
    }).error(() => {
      reject('网络错误！');
    });
  });
}

$(() => {
  Cookie.set('mark', 'lock');
  check().then((res) => {
    console.log(res);
    if (!res) location.href = './index.html';
  });
  $('.input .btn').click(submit);
  $('input').keydown((e) => {
    if (e.keyCode === 13) {
      submit();
    }
  });
});
