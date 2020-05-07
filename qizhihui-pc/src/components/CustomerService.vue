<<template>
  <div class="float">
    <div class="tellnumber">
      <div class="number">{{tel}}</div>
    </div>
    <div @click="toCustomerService" class="server"></div>
    <div @click="toTop" class="totop"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tel: '400-020-0055',
      serviceUrl: 'http://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=805023&configID=150092&jid=1173811204&operatorId=55061',
    };
  },
  methods: {
    toTop() {
      // document.body.scrollTop = 0;
      this.toTopAnimation(300);
    },
    toTopAnimation(scrollDuration) {
      const scrollStep = -window.scrollY / (scrollDuration / 15);
      const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    },
    toCustomerService() {
      // const url = 'http://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=805023&configID=150092&jid=1173811204&operatorId=55061';
      window.open(
        this.serviceUrl,
        '',
        'height=400, width=720, top=-500, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no',
      );
    },
  },
};
</script>
<style scoped lang="scss">
.float {
  position: fixed;
  right: 0;
  width: 50px;
  top: 45%;
  z-index: 10000;
  .tellnumber {
    position: absolute;
    top: 0;
    right: -200px;
    width: 200px;
    height: 50px;
    padding-left: 50px;
    line-height: 50px;
    background: url('/static/img/right_fuceng.png');
    background-position: 0 0;
    background-repeat: no-repeat;
    cursor: pointer;
    transition: right 1s;
    .number {
      padding-left: 10px;
      font-weight: 600;
      background: #0794d4;
      color: #fff;
    }
    &:hover {
      right: -60px;
    }
  }
  .tellnumber-right {
    background-position: 0 -50px;
  }
  .server {
    width: 50px;
    height: 50px;
    background: url('/static/img/right_fuceng.png');
    background-position: 0 -100px;
    margin-top: 52px;
    cursor: pointer;
  }
  .server:hover {
    background-position: 0 -150px;
  }
  .totop {
    width: 50px;
    height: 50px;
    background: url('/static/img/right_fuceng.png');
    background-position: 0 -200px;
    cursor: pointer;
    margin-top: 2px;
  }
}
</style>