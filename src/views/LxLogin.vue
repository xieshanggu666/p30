<template>
  <div class="bg">
    <div class="content">
      <div class="login">
        <div class="login-contianer"></div>
      </div>
    </div>

    <div class="login-footer" style="display: none;">
      <div style="text-decoration: none">
        <!-- 版权所有: 中物九联(成都)科技有限责任公司 -->
      </div>

      <div style="text-decoration: none">
        <!-- 公司地址: 成都市双流区银河路596号中物院科研综合楼4楼 -->
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store/index";
import http from "@/../src/api/http.js";
export default defineComponent({
  setup(props, context) {
    const loading = ref(false);
    const codeImgSrc = ref("");
    const userInfo = reactive({
      userName: "",
      password: "",
      verificationCode: "",
      UUID: undefined,
    });

    const getVierificationCode = () => {
      http.get("/api/User/getVierificationCode").then((x) => {
        codeImgSrc.value = "data:image/png;base64," + x.img;
        userInfo.UUID = x.uuid;
      });
    };
    getVierificationCode();

    let appContext = getCurrentInstance().appContext;
    let $message = appContext.config.globalProperties.$message;
    let router = useRouter();

    const login = () => {
      if (!userInfo.userName) return $message.error("请输入用户名");
      if (!userInfo.password) return $message.error("请输入密码");
      if (!userInfo.verificationCode) {
        return $message.error("请输入验证码");
      }
      loading.value = true;
      http.post("/api/user/login", userInfo, "正在登录....").then((result) => {
        if (!result.status) {
          loading.value = false;
          getVierificationCode();
          return $message.error(result.message);
        }
        $message.success("登录成功,正在跳转!");
        store.commit("setUserInfo", result.data);
        console.log("result.data", result.data);
        router.push({ path: "/" });
      });
    };

    const gologin = () => {
      var sum = "";
      var str = "";
      // var url = location.search;
      // var url = "http://localhost:9990/#/lxlogin?token=123";
      if (url.indexOf("?") != -1) {
        var code = url.substr(1);
        str = code.split("=");
        sum = str[1];
      }
      if (sum) {
        router.push({ path: "/" });
        http.post("/api/lxLogin", {}, "正在登录....").then((result) => {
          console.log("result", result);
          // router.push({ path: "/" });
        });
      }
    };
    gologin();

    const loginPress = (e) => {
      if (e.keyCode == 13) {
        login();
      }
    };
    const openUrl = (url) => {
      window.open(url, "_blank");
    };
    return {
      loading,
      codeImgSrc,
      getVierificationCode,
      login,
      userInfo,
      loginPress,
      openUrl,
      gologin,
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      },
    },
  },
});
</script>

<style lang="less" scoped>
@import "../views//login/font/font.css";
.bg {
  display: flex;
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;
  background: url("../assets/login/logo_zw.jpg") no-repeat center center;
}

.login {
  flex: 1;
}
.loging-btn {
  button {
    width: 100%;
    font-size: 14px !important;
    letter-spacing: 2px;
  }
}
.content {
  display: flex;
  z-index: 99;
  position: relative;
  width: 860px;
  left: 30%;
  right: 0;

  margin: 0 auto;
  transform: translateY(-50%);
  // background: #dedede40;
  top: 50%;
  height: 400px;
  border-radius: 10px;
  .l-left {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    width: 400px;
    // background-image: linear-gradient(135deg, #0d82ff 10%, #0cd7bd);
    // border: 1px solid #5c87ff;
  }
}

.desc {
  text-align: left;
  width: 450px;
  padding: 10px 30px;
  box-sizing: border-box;
  height: 100%;
}

.desc p {
  font-size: 15px;
  color: white;
  line-height: 30px;
}

.desc p:before {
  top: -1px;
  content: "o";
  position: relative;
  margin-right: 7px;
}
</style>

<style lang="less" scoped>
.form-user {
  margin: 25px 0;

  .item {
    display: flex;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    margin-bottom: 30px;
    display: flex;
    .f-text {
      color: #484848;
      font-weight: 400;
      width: 110px;
      font-size: 16px;
      text-align: left;
      i {
        position: relative;
        top: -1px;
        right: 5px;
      }
    }
    .f-input {
      border: 0px;
      flex: 1;
    }
    .code {
      position: relative;
      cursor: pointer;
      top: -5px;
      width: 74px;
      border: 1px solid #fdfdfd;
      border-radius: 2px;
      height: 35px;
      margin-left: 10px;
    }
  }
}
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset;
}
.login-contianer {
  .login-header {
    font-size: 60px;
    font-family: Microsoft YaHei UI;
    font-weight: 700;
    color: #fff;
    position: absolute;
    bottom: 400px;
    left: 20px;
  }
  .login-form {
    position: relative;
    overflow: hidden;
    // margin-top: 25px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px 30px 40px 30px;
    width: 400px;
    background: #ffffff;
    height: 400px;
    box-shadow: 2px 5px 18px #6453534a;
    h2 {
      font-weight: 500;
      padding: 10px 0px;
      text-align: left;
      margin-top: 15px;
    }
    .v-tag {
      top: -23px;
      text-align: center;
      position: absolute;
      right: -43px;
      line-height: 49px;
      top: -17px;
      padding-left: 21px;
      font-size: 12px;
      width: 158px;
      background: #3a8ee6;
      padding-top: 25px;
      color: white;
      -webkit-transform: rotate(40deg);
      letter-spacing: 2px;
    }
  }
}

.loging-btn {
  margin-top: 20px;
}
.action {
  text-align: right;
  margin-top: 20px;
  font-size: 12px;
  color: #9c9c9c;
  cursor: pointer;
  a {
    margin-left: 20px;
  }
}
.login-footer {
  cursor: pointer;
  padding: 10px;
  // text-align: center;
  display: flex;
  justify-content: center;
  font-size: 14px;
  position: absolute;
  width: 100%;
  bottom: 0px;
  i {
    position: relative;
    top: -2px;
    margin-right: 5px;
  }
  div {
    margin-left: 30px;
    color: #f9ebd0;
  }
}
@media screen and (max-width: 600px) {
  .desc {
    display: none;
  }
  .bg {
    background-image: none;
  }
  .login-form {
    box-shadow: none !important;
  }
  .login-form {
    width: 100% !important;
  }
  .login-footer,
  .r-bg,
  .l-bg {
    display: none;
  }
  .l-left {
    display: none;
  }
  .c-bg-item {
    background: none !important;
  }
}
.link a {
  text-decoration: none;

  color: #ffff;
  border: 1px solid #ffff;
  width: 80px;
  margin-right: 5px;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;

  white-space: nowrap;
  user-select: none;
  padding: 5px 15px 6px;
  font-size: 12px;
  border-radius: 32px;
}
</style>
<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}
input {
  background: white;
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  color: #323233;
  line-height: inherit;
  text-align: left;
  border: 0;
  outline: none;
  font-size: 16px;
  line-height: 20px;
}
</style>
<style lang="less" scoped>
.c-bg {
  position: absolute;
  width: 100%;
  height: 200px;

  .c-bg-item {
    width: 25%;
    background: #00a7f5;
    height: 200px;
  }
}
.app-link {
  text-align: center;
  padding-top: 21px;
  font-size: 14px;
  a {
    position: relative;
    cursor: pointer;
    width: 70px;
    color: #1483f6;
    margin: 20px 20px 0 0;
  }
  img {
    display: none;
  }
  a:hover {
    img {
      display: block;
      position: absolute;
      z-index: 999999999;
      top: -130px;
      width: 120px;
      left: -22px;
      border: 1px solid #b1b1b1;
    }
  }
}
</style>
