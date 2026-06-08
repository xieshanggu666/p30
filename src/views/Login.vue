<template>
  <div class="bg">
    <img class="younei" src="../assets/login/fanks.png"/>
    <div class="loges"></div>

    <div class="zanglogin">
      <div class="userph">账号密码登录</div>
      <div class="itmys mb20" @keypress="loginPress">
        <el-input class="suru" v-model="userInfo.userName" type="text" size="large" auto-complete="off" placeholder="登录账号">
          <template #prefix><img class="icusd" src="../assets/login/user.png"/> </template>
        </el-input>
      </div>
      <div class="itmys mb20">
        <el-input class="suru"  v-model="userInfo.password" show-password v-focus type="password" size="large" auto-complete="off" placeholder="登录密码">
          <template #prefix><img class="icusd" src="../assets/login/pwds.png"/> </template>
        </el-input>
      </div>
      <div class="itmys mb20">
        <el-input class="suru"  v-model="userInfo.verificationCode"  v-focus type="text" size="large" auto-complete="off" placeholder="验证码">
          <template #prefix><img class="icusd" src="../assets/login/yanzs.png"/> </template>
        </el-input>
        <div class="yanzCode" @click="getVierificationCode">
          <img v-show="codeImgSrc != ''" :src="codeImgSrc" />
        </div>
      </div>
      <div class="jzpwd"><el-checkbox v-model="checked">记住账号</el-checkbox></div>
      <div class="submites" >
            <el-button
                    size="large"
                    :loading="loading"
                    type="primary"
                    @click="login"
                    long
                  >
                <span v-if="!loading">登录</span>
                <span v-else>正在登录...</span>
              </el-button>
      </div>
    </div>
    <!-- <div class="content">
      <div class="login">
        <div class="login-contianer">
          <div class="login-form">
            <h2 style="color: #006abc;font-weight:600;text-align: center;">
              智慧安全系统
            </h2>
            <div class="form-user" @keypress="loginPress">
              <div class="item">
                <div class="f-text">
                  <label> 用户名： </label>
                </div>
                <div class="f-input">
                  <input
                    type="text"
                    v-focus
                    v-model="userInfo.userName"
                    placeholder="输入用户"
                  />
                </div>
              </div>
              <div class="item">
                <div class="f-text">
                  <label> 密&nbsp;&nbsp;&nbsp;码： </label>
                </div>
                <div class="f-input">
                  <input
                    type="password"
                    v-focus
                    v-model="userInfo.password"
                    placeholder="输入密码"
                  />
                </div>
              </div>
              <div class="item">
                <div class="f-text">
                  <label> 验证码： </label>
                </div>
                <div class="f-input">
                  <input
                    v-focus
                    type="text"
                    v-model="userInfo.verificationCode"
                    placeholder="输入验证码"
                  />
                </div>
                <div class="code" @click="getVierificationCode">
                  <img v-show="codeImgSrc != ''" :src="codeImgSrc" />
                </div>
              </div>
            </div>
            <div class="loging-btn">
              <el-button
                size="large"
                :loading="loading"
                type="primary"
                @click="login"
                long
              >
                <span v-if="!loading">登录</span>
                <span v-else>正在登录...</span>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div> -->

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
    let checked=ref(localStorage.getItem("checked")?true:false);
    const loading = ref(false);
    const codeImgSrc = ref("");
    const userInfo = reactive({
      userName:localStorage.getItem("userNames")?localStorage.getItem("userNames"): "",
      password: '',//localStorage.getItem("passwords")?localStorage.getItem("passwords"): "",
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
       let audio=document.getElementById('audios');
       audio.play();
       audio.pause();
       audio.muted = true; // 静音音频
      if (!userInfo.userName) return $message.error("请输入用户名");
      if (!userInfo.password) return $message.error("请输入密码");
      if (!userInfo.verificationCode) {
        return $message.error("请输入验证码");
      }
      loading.value = true;
      //记住密码
      if(checked.value==true){
        localStorage.setItem("checked",checked.value);
        localStorage.setItem("userNames",userInfo.userName);
        //localStorage.setItem("passwords",userInfo.password);
      }else{
        localStorage.removeItem("checked");
        localStorage.removeItem("userNames");
        //localStorage.removeItem("passwords");
      }
      http.post("/api/user/login", userInfo, "正在登录....").then((result) => {
        if (!result.status) {
          loading.value = false;
          getVierificationCode();
          return $message.error(result.message);
          console.log('获取菜单');
        }
        $message.success("登录成功,正在跳转!");
        store.commit("setUserInfo", result.data);
         //获取码表并设置缓存数据
         seleCodes();
        //获取菜单权限
        getTreeMenu();
        console.log('获取菜单');
      });
    };
    //获取码表数据
    const seleCodes=()=>{
          let arr=["groupManager","alarmInfoType","alarmLevel","dealState","typeManager","errorType","devopsType","gnssBaseList"];
          let url="/api/Sys_Dictionary/GetVueDictionary";
          http.post(url, arr, true).then((result) => {
            localStorage.setItem("codeTable",JSON.stringify(result));
          });
      }
    //获取菜单权限 默认取第一条 用于登录跳转
    const getTreeMenu=()=>{
      http.get("/api/menu/getTreeMenu", userInfo, "").then((result) => {
         //缓存菜单权限数据 用于路由拦截器判断是否拥有权限访问该页面
         localStorage.setItem('menuTree',JSON.stringify(result));
         //将一维数组转为树形结构
         const tree = arrayToTree(result,0);
         //大屏权限限制
         let routerTo=[];
         tree.forEach(item=>{
            if(item.url.indexOf("largeScreen")>-1){
              routerTo.push(item);
            }
         })
         localStorage.setItem('largeScreen',JSON.stringify(routerTo));
         //获取第一个菜单
         let urls={url:''};
         oneCai(tree[0],urls);
         router.push({ path:urls.url });
      });
    }

    //将一维数组转为树形结构
    const arrayToTree=(flatArray)=>{
            const map = {}; // 用于存储每个节点的引用
            const tree = []; // 最终的树形结构
            // 首先将所有节点存入 map 中
            flatArray.forEach(item => {
                map[item.id] = { ...item, children: [] };
            });
            // 遍历数组，构建树形结构
            flatArray.forEach(item => {
                if (item.parentId === null || item.parentId === 0) {
                    // 如果 pid 为 null 或 0，说明是根节点
                    tree.push(map[item.id]);
                } else {
                    // 否则，将其添加到父节点的 children 数组中
                    if (map[item.parentId]) {
                        map[item.parentId].children.push(map[item.id]);
                    }
                }
            });
            return tree;
    }
    //递归查找url
    const oneCai=(arr,urls)=>{
      if(arr.children.length==0||(!arr.children)){
         urls.url=arr.url;
      }else{
          oneCai(arr.children[0],urls);
      }
    }
    const gologin = () => {

      // http.post("/api/user/allowLogin", {}, "正在登录....").then((result) => {
      //       store.commit("setUserInfo", result.data);
      //       router.push({ path: "/" });
      //     });
      var url = window.location.href;
      // var url = http://localhost:9990/#/login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMzgzIiwiaWF0IjoiMTY5NTI2MjQwOSIsIm5iZiI6IjE2OTUyNjI0MDkiLCJleHAiOiIxNjk1MjY5NjA5IiwiaXNzIjoienVqbC5jb3JlLm93bmVyIiwiYXVkIjoienVqbC5jb3JlIn0.XsmBri5WFehx47y7n3T9K8DcXG8TNVrEyiOBxurDGi8";
      // var url = http://159.75.243.87/#/login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMzgzIiwiaWF0IjoiMTY5NTI2MjQwOSIsIm5iZiI6IjE2OTUyNjI0MDkiLCJleHAiOiIxNjk1MjY5NjA5IiwiaXNzIjoienVqbC5jb3JlLm93bmVyIiwiYXVkIjoienVqbC5jb3JlIn0.XsmBri5WFehx47y7n3T9K8DcXG8TNVrEyiOBxurDGi8";
      var querys = url.substring(url.indexOf("?") + 1).split("&");
      var result = [];
      for (var i = 0; i < querys.length; i++) {
        var temp = querys[i].split("=");
        if (temp.length < 2) {
          result[temp[0]] = "";
        } else {
          result[temp[0]] = temp[1];
        }
      }
      if (result.redirect) {
        router.push({ path: "/login" });
      } else {
        if (
          (result.token ==
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMzgzIiwiaWF0IjoiMTY5NTI2MjQwOSIsIm5iZiI6IjE2OTUyNjI0MDkiLCJleHAiOiIxNjk1MjY5NjA5IiwiaXNzIjoienVqbC5jb3JlLm93bmVyIiwiYXVkIjoienVqbC5jb3JlIn0.XsmBri5WFehx47y7n3T9K8DcXG8TNVrEyiOBxurDGi8")
        ) {
          http.post("/api/user/lxLogin", {}, "正在登录....").then((result) => {
            store.commit("setUserInfo", result.data);
            router.push({ path: "/" });
          });
        } else {
        }
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
      checked,
      loading,
      codeImgSrc,
      getVierificationCode,
      login,
      userInfo,
      loginPress,
      openUrl,
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
  background: url("../assets/login/weifbg.png") no-repeat center center;
  background-size: 100% 100%;
}
.younei{
  position: absolute;
  width:40.88% ;
  height: auto;
  left: 200px;
  bottom: 0.036%;
}
.loges{
  width: 310px;
  height: 56px;
  position: absolute;
  top: 64px;
  left: 64px;
  background: url("../assets/login/loggs.png") no-repeat center center;
  background-size: 100% 100%;
}
.zanglogin{
  width: 500px;
  height: 580px;
  background: #FFFFFF;
  box-shadow: 0px 0px 25px 1px rgba(23,39,93,0.16);
  border-radius: 15px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 250px;
  .userph{
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 28px;
    padding-top: 64px;
    color: #333333;
    margin-bottom: 45px;
  }
  .itmys{
    padding: 0 50px;
    position: relative;
    .icusd{
      width: 20px;
      height: 20px;
      margin-top: -2px;
    }
    .yanzCode{
      width: 123px;
      height: 44px;
      background: #FBFBFB;
      border-radius: 4px;
      right: 62px;
      top: 6px;
      position: absolute;
      &>img{
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
    }
  }
  .jzpwd{
    padding: 0 50px;
    margin-bottom: 59px;
  }
  .submites{
    width:calc(100% - 100px);
    margin: auto;
    height: 60px;
   
    color: #FFFFFF;
    ::v-deep .el-button{
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: #3370FF;
      font-size: 20px;
      font-weight: 500;
    }
  }
  ::v-deep .el-checkbox__label{
    font-weight: 500;
    font-size: 14px;
    color: #A2ACC2;
  }
  ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
    color:#3370FF ;
  }
}
.mb20{
  margin-bottom: 20px;
}
::v-deep .el-input__wrapper{
    box-shadow: none !important;
    background-color:rgba(53, 112, 252, 0.08) !important;
    padding: 16px;
    border-radius:4px;
    .el-input__inner {
        color: #000 !important;
        font-size: 18px;
        &::placeholder {
          font-weight: 400;
          font-size: 18px;
          color: #A2ACC2;
        }
      }
  }
  .el-input {
      height: 56px;
      // background: url('../assets/images/inptys.png') no-repeat !important;
      // background-size: 100% 100% !important;
      input {
        height: 40px;
      }
  }
  .suru{
    ::v-deep .is-focus{
      // background: url('../assets/images/actinptys.png') no-repeat !important;
      // background-size: 100% 100% !important;
    }
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
  left: 40%;
  right: 0;

  margin: 0 auto;
  transform: translateY(-50%);
  // background: #dedede40;
  top: 48%;
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
