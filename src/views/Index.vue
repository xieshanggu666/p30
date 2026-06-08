<template>
  <div id="vol-container" :class="['vol-theme-' + theme]">
    <div class="vol-aside" :style="{ width: menuWidth + 'px' }">
      <div class="header" :style="{ width: menuWidth - 1 + 'px' }">
        <img v-show="!isCollapse" v-bind:src="logo" />
        <span v-show="flag" :xjccount="xjccount">智慧安全综合管理</span>
        <!-- <span v-show="flag">古蔺茅溪九坝园区安全监测平台</span> -->
      </div>
      <div class="vol-menu">
        <el-scrollbar class="vol-sty" style="height: 100%">
          <VolMenu
            :currentMenuId="currentMenuId"
            :on-select="onSelect"
            :enable="true"
            :open-select="false"
            :isCollapse="isCollapse"
            :list="menuOptions"
          ></VolMenu>
        </el-scrollbar>
      </div>
    </div>
    <div class="vol-container" :style="{ left: menuWidth - 1 + 'px' }">
      <div class="vol-header">
        <i @click="toggleLeft" class="el-icon-s-fold collapse-menu" />
        <div class="header-text">
          <div
            v-if="
              userName === 'gulin' ||
              userName === '甲岩电站' ||
              userName === 'hanwei' ||
              userName === '甲岩电站01' ||
              userName === 'baihetan2' ||
              userName === 'baihetan'
            "
            class="h-link"
            style="display: flex"
          >
            <!-- <a href="javascript:void(0)" @click="to(item)" v-for="(item, index) in links.filter((c) => {
              return !c.icon;
            })" :key="index">
              <span v-if="!item.icon"> {{ item.text }}</span>
              <i v-else :class="item.icon"></i>
            </a> -->
            <div
              @click="goItem(item)"
              v-for="(item, index) in link"
              :key="index"
              style="margin-left: 10px"
            >
              <span style="cursor: pointer; font-weight: bold">
                {{ item.text }}</span
              >
            </div>
            <div></div>
          </div>
          <div v-else class="h-link" style="display: flex">
            <!-- <a href="javascript:void(0)" @click="to(item)" v-for="(item, index) in links.filter((c) => {
              return !c.icon;
            })" :key="index">
              <span v-if="!item.icon"> {{ item.text }}</span>
              <i v-else :class="item.icon"></i>
            </a> -->
            <div
              @click="goItem(item)"
              v-for="(item, index) in links"
              :key="index"
              style="margin-right: 10px"
            >
              <span style="cursor: pointer"> {{ item.text }}</span>
            </div>
            <div></div>
          </div>
        </div>
        <div class="header-info">
          <!--消息管理-->
          <div
            class="h-link"
            style="margin-top: 5px"
            @click="messageModel = true"
          >
            <a
              ><i class="el-icon-message-solid cusp" style="font-size: 24px"></i
              ><el-badge
                :value="showMsgCount"
                v-if="showMsgCount !== 0"
                class="item"
              >
              </el-badge
            ></a>
            <audio ref="audio" id="audio">
              <source
                src="http://smp.cnzwjl.com:9991/Upload/warning.mp3"
                type="audio/mpeg"
              />
            </audio>
          </div>
          <div @click="cartUser">
            <img class="user-header cusp" :src="userImg" :onerror="errorImg" />
          </div>
          <div class="caoname cusp" @click="cartUser">{{ userName }}</div>
          <div class="uslin cusp"></div>
          <div class="tuiout cusp" @click="to({ path: '/login' })">
            <i class="el-icon-switch-button"></i> 退出系统
          </div>
          <!-- <div class="user">
            <el-dropdown>
              <span class="el-dropdown-link">
                <span style="color:white">{{ userName }}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template v-slot:dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="drawer_model = true"
                    >主题设置</el-dropdown-item
                  >
                  <el-dropdown-item @click="to({ path: '/UserInfo',text:'个人中心' })"
                    >个人中心</el-dropdown-item
                  >
                  <el-dropdown-item @click="to({ path: '/login' })"
                    >退出登陆</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <br />
            <span id="index-date"></span>
          </div> -->
        </div>
      </div>
      <div class="vol-path">
        <el-tabs
          @tab-click="selectNav"
          @tab-remove="removeNav"
          @contextmenu.prevent="bindRightClickMenu(false)"
          type="border-card"
          class="header-navigation"
          v-model="selectId"
          :strtch="false"
        >
          <el-tab-pane
            v-for="(item, navIndex) in navigation"
            type="card"
            :name="navIndex + ''"
            :closable="navIndex > 0"
            :key="navIndex"
            :label="item.name"
          >
            <span style="display: none">{{ navIndex }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 右键菜单 -->
        <div v-show="contextMenuVisible">
          <ul
            :style="{ left: menuLeft + 'px', top: menuTop + 'px' }"
            class="contextMenu"
          >
            <li v-show="visibleItem.all">
              <el-button type="text" @click="closeTabs()" size="small">
                <i class="el-icon-close"></i>
                {{
                  navigation.length == 2 ? "关闭菜单" : "关闭所有"
                }}</el-button
              >
            </li>
            <li v-show="visibleItem.left">
              <el-button type="text" @click="closeTabs('left')" size="small"
                ><i class="el-icon-back"></i>关闭左边</el-button
              >
            </li>
            <li v-show="visibleItem.right">
              <el-button type="text" @click="closeTabs('right')" size="small">
                <i class="el-icon-right"></i>关闭右边</el-button
              >
            </li>
            <li v-show="visibleItem.other">
              <el-button type="text" @click="closeTabs('other')"
                ><i class="el-icon-right"></i>关闭其他
              </el-button>
            </li>
          </ul>
        </div>
      </div>
      <div class="vol-main" id="vol-main">
        <div class="div-scrollbar" v-if="permissionInited">
          <!-- <el-scrollbar  style="height:100%" v-if="permissionInited"> -->
          <loading v-show="$store.getters.isLoading()"></loading>
          <router-view
            v-if="
              !$route.meta ||
              ($route.meta && !$route.meta.hasOwnProperty('keepAlive'))
            "
            v-slot="{ Component }"
          >
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
          <router-view
            v-if="$route.meta && $route.meta.hasOwnProperty('keepAlive')"
          ></router-view>
          <!-- </el-scrollbar> -->
        </div>
      </div>
    </div>
    <el-drawer
      title="选择主题"
      v-model="drawer_model"
      direction="rtl"
      destroy-on-close
    >
      <div class="theme-selector">
        <div
          @click="changeTheme(item.name)"
          class="item"
          v-for="(item, index) in theme_color"
          :key="index"
          :style="{ background: item.color }"
        >
          <div
            v-show="item.leftColor"
            :style="{ background: item.leftColor }"
            style="height: 100%; width: 20px"
            class="t-left"
          ></div>
          <div class="t-right"></div>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      title="消息列表"
      v-model="messageModel"
      direction="rtl"
      destroy-on-close
    >
      <Message :list="messageList"></Message>
    </el-drawer>
    <!-- 个人中心 -->
    <VolBox :width="886" :height="504" v-model="showes" title="个人中心">
      <div class="usercon">
        <div class="uselet">
          <el-image class="yaoim" :src="userInfoes.img" fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>

          <div class="caoji">{{ userInfoes.userName }}</div>
          <div class="uutim">注册时间</div>
          <div class="uutim">{{ userInfoes.createDate }}</div>
          <div class="updatePwd" @click="modifyOptions.model = true">
            <img src="@/assets/home/edits.png" /> 修改密码
          </div>
        </div>
        <div class="userigt">
          <vol-form
            ref="form"
            :load-key="true"
            :width="654"
            :formRules="editFormOptions"
            :formFields="editFormFields"
          >
          </vol-form>
        </div>
      </div>
      <template #footer>
        <div class="usebot">
          <el-button type="primary" size="small" long @click="modifyInfo"
            >确定</el-button
          >
          <el-button size="small" long @click="showes = false">取消</el-button>
        </div>
      </template>
    </VolBox>
    <!-- 个人中心之修改密码 -->
    <VolBox
      :width="500"
      :height="270"
      v-model="modifyOptions.model"
      title="修改密码"
    >
      <div style="padding:10px;20px;">
        <VolForm
          ref="pwd"
          :formRules="modifyOptions.data"
          :formFields="modifyOptions.fields"
        ></VolForm>
      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button
            type="primary"
            size="mini"
            icon="md-checkmark-circle"
            long
            @click="savePwd"
            >保存</el-button
          >
        </div>
      </template>
    </VolBox>
  </div>
</template>
<style lang="less" scoped>
@import "./index/index.less";
</style>
<script>
import loading from "@/components/basic/RouterLoading";
import VolMenu from "@/components/basic/VolElementMenu.vue";
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import Message from "./index/Message.vue";
import MessageConfig from "./index/MessageConfig.js";
var imgUrl = require("@/assets/login/logo.png");
var $this;
var $interval;
var $audioInterval;
var $indexDate;
import {
  defineComponent,
  reactive,
  ref,
  watch,
  onMounted,
  getCurrentInstance,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store/index";
import { useStore } from "vuex";
import http from "@/../src/api/http.js";
import base from "@/uitils/common.js";
export default defineComponent({
  components: {
    VolMenu,
    VolForm,
    loading,
    Message,
    VolBox,
  },
  data() {
    return {
      allTabs: true,
      leftTabs: true,
      rightTabs: true,
      otherTabs: true,
      menuLeft: 0,
      menuTop: 0,
      //showMsgCount:0
      //  contextMenuVisible: false, // 右键关闭显/隐
    };
  },

  setup(props, context) {
    //如果从gis跳转设备检测  则固定选中左侧菜单
    const store = useStore(); // 获取 store 实例
    const xjccount = computed(() => {
      let { path } = useRoute();
      if (path == "/Ala_equipment_warning") {
        currentMenuId.value = 199;
      } else if (path == "/gis") {
        currentMenuId.value = 175;
      }
      return store.state.isrouter;
    });
    //控制个人中心弹窗显示
    let showes = ref(false);
    //表单基础配置
    let userInfoes = reactive({
      img: "",
      createDate: "--",
      userName: "--",
      email: "",
      phoneNo: "",
    });
    let editFormFields = reactive({
      roleName: "",
      userName: "",
      userTrueName: "",
      address: "",
      gender: "",
      remark: "",
    });
    let editFormOptions = reactive([
      [
        {
          columnType: "string",
          title: "用户名",
          field: "userName",
          disabled: true,
        },
      ],
      [
        {
          columnType: "string",
          title: "角色",
          field: "roleName",
          disabled: true,
          type: "text",
        },
      ],
      [
        {
          columnType: "string",
          title: "真实姓名",
          field: "userTrueName",
          required: true,
          type: "text",
        },
      ],
      [
        {
          columnType: "string",
          title: "地址",
          field: "address",
          type: "text",
        },
      ],
      [
        {
          dataKey: "gender",
          title: "性别",
          field: "gender",
          data: [],
          type: "select",
        },
      ],
      [
        {
          columnType: "string",
          title: "备注",
          field: "remark",
          colSize: 12,
          type: "textarea",
        },
      ],
    ]);
    //获取表单元素
    let form = ref(null);
    let modifyInfo = () => {
      form.value.validate((result) => {
        if (result) {
          showes.value = false;
          console.log("提交保存接口", form);
        }
      });
    };
    //获取用户基本信息
    let cartUser = () => {
      showes.value = true;
      http.post("/api/user/getCurrentUserInfo", {}, true).then((x) => {
        if (!x.status) {
          return this.$message(x.message);
        }
        x.data.createDate = (x.data.createDate || "").replace("T", " ");
        x.data.gender = x.data.gender + "";

        form.value.reset(x.data);
        userInfoes.img = base.getImgSrc(x.data.headImageUrl, http.ipAddress);
        userInfoes.createDate = x.data.createDate;
        userInfoes.userName = x.data.userTrueName;
        userInfoes.phoneNo = x.data.phoneNo;
        userInfoes.email = x.data.email;
        console.log("userInfoes", userInfoes);
        //   this.editFormFields = x.data;
      });
    };
    //修改密码配置参数
    let modifyOptions = reactive({
      model: false,
      fields: { oldPwd: "", newPwd: "", newPwd1: "" },
      data: [
        [
          {
            columnType: "string",
            required: true,
            title: "旧密码",
            field: "oldPwd",
          },
        ],
        [
          {
            type: "password",
            required: true,
            title: "新密码",
            field: "newPwd",
          },
        ],
        [
          {
            type: "password",
            required: true,
            title: "确认密码",
            field: "newPwd1",
          },
        ],
      ],
    });
    //修改密码提交
    let pwd = ref(null);
    const savePwd = () => {
      if (!pwd.value.validate()) return;
      if (modifyOptions.fields.newPwd != modifyOptions.fields.newPwd1) {
        return appContext.config.globalProperties.$message.error(
          "两次密码不一致!"
        );
      }
      let url =
        "/api/user/modifyPwd?oldPwd=" +
        modifyOptions.fields.oldPwd +
        "&newPwd=" +
        modifyOptions.fields.newPwd;
      http.post(url, {}, true).then((x) => {
        if (!x.status) {
          return appContext.config.globalProperties.$message.error(x.message);
        }
        modifyOptions.model = false;
        appContext.config.globalProperties.$message.success(x.message);
        pwd.value.reset();
      });
    };
    // 获取全局属性和方法
    const { proxy, appContext } = getCurrentInstance();

    // 菜单导航默认宽度
    const menuWidth = ref(240);
    const contextMenuVisible = ref(false);
    const isCollapse = ref(false);
    const flag = ref(true);
    const drawer_model = ref(false);
    const messageModel = ref(false);
    const theme_color = ref([
      { name: "blue", color: "rgb(45, 140, 240)" },
      { name: "blue2", color: "rgb(45, 140, 240)", leftColor: "#0068d6" },
      { name: "red", color: "rgb(237, 64, 20)" },
      { name: "red2", color: "rgb(237, 64, 20)", leftColor: "#a90000" },
      { name: "dark", color: "#272929" },
      { name: "orange", color: "#ff9900" },
      { name: "orange2", color: "#ff9900", leftColor: "rgb(232 141 5)" },
      { name: "green", color: "rgb(25, 190, 107)" },
      { name: "green2", color: "rgb(25, 190, 107)", leftColor: "#019e4f" },
      { name: "white", color: "#fff" },
    ]);
    //获取大屏按钮
    let links = ref([]);
    let largeScreen = JSON.parse(localStorage.getItem("largeScreen")) || null;
    if (largeScreen) {
      links.value = largeScreen.map((item) => ({
        text: item.name,
        path: item.url,
      }));
      links.value.push({ text: "雷达监测平台", path: "/radarLarge" });
    }
    // const links = ref([
    //   // {
    //   //   text: "框架视频",
    //   //   path: "https://www.cctalk.com/m/group/90268531",
    //   //   id: -3,
    //   // },
    //   // { text: "gis", path: "/gis", id: -3 },
    //   { text: "安全监测平台", path: "/largeScreen", id: 0 },
    //   { text: "监测运维", path: "/largeScreen", id: 1 },
    //   // { text: "魔镜客户端", path: "/getExe", id: -8 },
    //   // { text: "设备一览", path: "/deviceLargeScreen", id: -5 },

    //   // {
    //   //   text: "框架文档",
    //   //   path: "http://v2.volcore.xyz/document/guide",
    //   //   id: -2,
    //   // },
    //   // { text: "个人中心", path: "/UserInfo", id: -1, icon: "el-icon-s-custom" },
    //   // {
    //   //   text: "安全退出",
    //   //   path: "/login",
    //   //   id: -4,
    //   //   icon: "el-icon-switch-button",
    //   // },
    // ]);
    const link = ref([{ text: "魔镜客户端", path: "/getExe", id: -8 }]);
    const errorImg = ref(
      'this.src="' + require("@/assets/imgs/error-img.png") + '"'
    );
    const selectId = ref("1");
    // 【首页】标签序号(当前右键选中的菜单)
    const selectMenuIndex = ref("0");
    //2022.05.29增加tab选项与菜单联动功能
    const currentMenuId = ref(175);
    const userName = ref("--");
    const userInfoName = ref("");
    const userInfo = ref({});
    const visibleItem = reactive({
      left: false,
      right: false,
      all: false,
      other: false,
    });
    const userImg = ref("");
    const navigation = reactive([
      { orderNo: "0", id: "1", name: "GIS地图", path: "/gis" },
    ]);
    const logo = ref(imgUrl);
    const theme = ref("blue2");
    const menuOptions = ref([]);
    const permissionInited = ref(false);
    const messageList = reactive([]);
    let _config = getCurrentInstance().appContext.config.globalProperties;
    let router = useRouter();
    const toggleLeft = () => {
      isCollapse.value = !isCollapse.value;
      flag.value = !flag.value;
      menuWidth.value = isCollapse.value ? 63 : 240;
    };
    const showMsgCount = computed(() => {
      return messageList.length;
    });
    //2021.08.28开放手动折叠菜单方法
    _config.menu = {
      show() {
        toggleLeft();
      },
      hide() {
        toggleLeft();
      },
    };
    const changeTheme = (name) => {
      if (theme.value != name) {
        theme.value = name;
      }
      localStorage.setItem("vol3_theme", name);
    };

    const to = (item) => {
      /* 2020.07.31增加手动打开tabs*/
      if (item.path == "#") {
        window.open("https://github.com/cq-panda/Vue.NetCore");
        return;
      }
      if (item.path.indexOf("http") != -1) {
        window.open(item.path);
        return;
      }
      if (typeof item == "string" || item.path == "/login") {
        if (item == "/login" || item.path == "/login") {
          store.commit("clearUserInfo", "");
          window.location.href = "/";
          return;
        }
        router.push({ path: item });
        return;
      }
      if (item.path == "#") return;
      open(item);
    };

    const open = (item, useRoute) => {
      /* 2020.07.31增加手动打开tabs*/
      let _index = navigation.findIndex((x) => {
        return x.path == item.path;
      });
      if (_index == -1) {
        navigation.push({
          //  orderNo: String(navigation.length),// 序号
          id: item.id + "",
          name: item.name || item.text || "无标题",
          path: item.path,
          query: item.query, //2021.03.20修复自定义二次打开$tabs时参数丢失的问题
        });
        //新打开的tab移至最后一个选项
        selectId.value = navigation.length - 1 + "";
      } else {
        selectId.value = _index + "";
      }
      if (useRoute === undefined) {
        //非标准菜单，记录最后一次跳转的页面，用于刷新
        setItem(item);
        router.push(item);
        // this.$router.push(item);
      }
      currentMenuId.value = item.id * 1;
      // tab菜单绑定右键事件
      proxy.$nextTick(function (e) {
        proxy.bindRightClickMenu(true);
      });
    };
    const close = (path) => {
      /* 2020.07.31增加手动打开tabs*/
      let index = navigation.findIndex((x) => {
        return x.path == path;
      });
      if (index == -1) {
        return _config.$Message.error("未找到菜单");
      }
      removeNav(index);
    };
    const setItem = (item) => {
      /* 2020.07.31增加手动打开tabs*/
      localStorage.setItem(
        window.location.origin + "_tabs",
        JSON.stringify(item)
      );
    };
    const getItem = () => {
      /* 2020.07.31增加手动打开tabs*/
      let nav = localStorage.getItem(window.location.origin + "_tabs");
      return nav ? JSON.parse(nav) : null;
    };
    const selectNav = (item) => {
      //升级element正式版修改
      selectId.value = item.props.name;
      let _path = navigation[item.index].path;
      currentMenuId.value = (
        menuOptions.value.find((c) => {
          return c.path == _path;
        }) || { id: 0 }
      ).id;

      router.push({
        path: navigation[item.index].path,
        query: navigation[item.index].query,
      });
    };

    const removeNav = (_index) => {
      return new Promise(() => {
        //关闭的当前项,跳转到前一个页面
        if (selectId.value == _index + "") {
          console.log(navigation[_index - 1]);
          setItem(navigation[_index - 1]);
          router.push({
            path: navigation[_index - 1].path,
            //2022.06.27修复tabs二次切换后参数丢失的问题
            query: navigation[_index - 1].query,
          });
          navigation.splice(_index, 1);
          selectId.value = selectId.value - 1 + "";
          return;
        }
        if (_index < selectId.value) {
          selectId.value = selectId.value - 1 + "";
        }
        navigation.splice(_index, 1);
        currentMenuId.value = (
          menuOptions.value.find((c) => {
            return c.path == navigation[selectId.value * 1].path;
          }) || { id: 0 }
        ).id;
      });
    };

    const getSelectMenuName = (id) => {
      return menuOptions.value.find(function (x) {
        return x.id == id;
      });
    };
    const onSelect = (treeId) => {
      /* 2020.07.31增加手动打开tabs*/
      var item = getSelectMenuName(treeId);
      open(item, false);
    };

    /**
     * 显示右键菜单
     * @param {*} e 事件对象
     */
    const openTabsMenu = function (e) {
      e.preventDefault(); // 防止默认菜单弹出
      let tabId = e.target.id.split("-")[1] * 1;

      //记录当前选中的菜单index
      selectMenuIndex.value =
        document.getElementById("pane-" + tabId).children[0].textContent * 1;
      //只有首页时不显示
      if (navigation.length == 1) {
        return;
      }

      //首页设置显示关闭右边菜单
      if (!selectMenuIndex.value) {
        visibleItem.all = false;
        visibleItem.right = true;
        visibleItem.left = false;
        visibleItem.other = false;
      } else {
        visibleItem.all = true;
        //不是最后一个显示关闭右边菜单
        visibleItem.right = selectMenuIndex.value != navigation.length - 1;
        //只有两个菜单时不显示关闭左边
        visibleItem.left = navigation.length != 2;
        //只有两个菜单时不显示关闭其他
        visibleItem.other = navigation.length != 2;
      }
      contextMenuVisible.value = true;
      // 设置右键菜单显示的位置
      proxy.menuLeft =
        e.target.getBoundingClientRect().left - (isCollapse.value ? 63 : 198); //-e.target.clientWidth
      proxy.menuTop = 36;
    };

    /**
     * 关闭右键菜单
     */
    const closeTabsMenu = () => {
      contextMenuVisible.value = false;
    };
    const toHome = () => {
      open({
        text: navigation[0].name,
        path: navigation[0].path,
      });
    };
    /**
     * 关闭其它标签页
     * @param {*} par 关闭类型(left,right,other)
     */
    const closeTabs = (value) => {
      let _menuId = navigation[selectId.value * 1].id;
      let currnetIndex = selectId.value * 1; // navigation.findIndex(c => { return c.id == selectId.value });
      switch (value) {
        case "left": {
          // 删除左侧tab标签
          navigation.splice(1, currnetIndex - 1); // 删除左侧tab标签
          break;
        }
        case "right": {
          // 删除右侧tab标签
          if (selectMenuIndex.value == 0) {
            navigation.splice(currnetIndex); // 删除右侧tab标签
            toHome();
          } else {
            navigation.splice(currnetIndex + 1); // 删除右侧tab标签
            if (selectMenuIndex.value < currnetIndex) {
              navigation.splice(
                selectMenuIndex.value,
                currnetIndex - selectMenuIndex.value
              );
            }
          }
          break;
        }
        case "other": {
          // 删除其他所有tab标签
          navigation.splice(currnetIndex + 1); // 删除右侧tab标签(这里必须按照右→左顺序删除)
          navigation.splice(1, currnetIndex - 1); // 删除左侧tab标签
          break;
        }
        default: {
          //关闭所有
          navigation.splice(1, navigation.length);
          toHome();
          break;
        }
      }
      selectId.value =
        navigation.findIndex((c) => {
          return c.id == _menuId;
        }) + "";
      closeTabsMenu();
    };

    watch(
      () => contextMenuVisible.value,
      (newVal, oldVal) => {
        // 监视
        if (newVal) {
          document.body.addEventListener("click", closeTabsMenu);
        } else {
          document.body.removeEventListener("click", closeTabsMenu);
        }
      }
    );

    /**
     * 系统创建开始
     */
    const created = () => {
      let _theme = localStorage.getItem("vol3_theme");
      if (_theme) {
        theme.value = _theme;
      }

      let _userInfo = store.getters.getUserInfo();
      if (_userInfo) {
        userName.value = _userInfo.userName;
        if (_userInfo.img) {
          userImg.value = _config.base.getImgSrc(_userInfo.img, http.ipAddress);
        }
      }
      Object.assign(_config.$tabs, { open: open, close: close });

      http.get("api/menu/getTreeMenu", {}, true).then((data) => {
        data.push({ id: "1", name: "首页", url: "/home" }); // 为了获取选中id使用
        data.forEach((d) => {
          d.path = (d.url || "").replace("/Manager", "");
          d.to = (d.url || "").replace("/Manager", "");
          if (!d.icon || d.icon.substring(0, 3) != "el-") {
            d.icon = "el-icon-menu";
          }
        });
        store.dispatch("setPermission", data);
        menuOptions.value = data;
        permissionInited.value = true;

        //开启消息推送（main.js中设置是否开启signalR）2022.05.05
        if (_config.$global.signalR) {
          MessageConfig(http, (result) => {
            messageList.unshift(result);
            //    console.log(result)
          });
        }

        $audioInterval = setInterval(function () {
          let noticeTime = new Date().toLocaleDateString();
          http
            .post("/api/Sys_My_Notice/getPageData", {
              order: "asc",
              page: 1,
              rows: 30,
              sort: "ID",
              value: 1,
              wheres: JSON.stringify([
                { name: "Notice_Type", value: 9 },
                {
                  name: "CreateDate",
                  value: noticeTime,
                  displayType: "thanorequal",
                },
              ]),
            })
            .then((res) => {
              messageList.splice(0, messageList.length);
              const msg = res.rows.map((obj) => {
                return {
                  title: obj.Title,
                  date: obj.CreateDate,
                  message: obj.Content,
                };
              });
              console.log(msg);
              messageList.unshift(...msg);
              if (messageList.length > 0) {
                proxy.$refs.audio.play();
              }
              if (messageList.length === 0) {
                proxy.$refs.audio.pause();
              }
            });
        }, 30000);

        //当前刷新是不是首页
        if (router.currentRoute.value.path != navigation[0].path) {
          //查找系统菜单
          let item = menuOptions.value.find((x) => {
            return x.path == router.currentRoute.value.path; //this.$route.path;
          });
          if (item) return onSelect(item.id);
          //查找顶部快捷连接
          item = links.value.find((x) => {
            return x.path == router.currentRoute.value.path; //this.$route.path;
          });
          item = link.value.find((x) => {
            return x.path == router.currentRoute.value.path; //this.$route.path;
          });
          //查找最后一次跳转的页面
          if (!item) {
            item = getItem();
          }
          if (item) {
            return open(item, false);
          }
        }
        selectId.value = "1";
      });
    };
    created();
    return {
      showes,
      userInfoes,
      editFormFields,
      editFormOptions,
      form,
      modifyInfo,
      cartUser,
      modifyOptions,
      pwd,
      savePwd,
      showMsgCount,
      menuWidth,
      isCollapse,
      flag,
      drawer_model,
      theme_color,
      errorImg,
      userInfo,
      userName,
      userInfoName,
      userImg,
      selectId,
      selectMenuIndex,
      navigation,
      links,
      link,
      onSelect,
      openTabsMenu,
      selectNav,
      getSelectMenuName,
      removeNav,
      logo,
      theme,
      menuOptions,
      permissionInited,
      changeTheme,
      to,
      toggleLeft,
      messageModel,
      messageList,
      contextMenuVisible,
      visibleItem,
      closeTabsMenu,
      closeTabs,
      currentMenuId,
      xjccount,
    };
  },
  /**
   * 挂载钩子函数
   */
  mounted() {
    // let _date = showTime();
    // $indexDate = document.getElementById("index-date");
    // $indexDate.innerText = _date;
    // $interval = setInterval(function() {
    //   $indexDate.innerText = showTime();
    // }, 1000);

    this.bindRightClickMenu(true);
  },

  methods: {
    /**
     * 绑定右键事件
     * @param {*} enable 是否启用右键事件[true:启用;false:禁用;]
     * @param {*} $event 事件
     */
    bindRightClickMenu(enable) {
      if (!enable) return;
      let that = this;
      // 使用原生js 为单个dom绑定鼠标右击事件
      that.$nextTick(() => {
        let tab_top_dom = Object.assign(
          [],
          document.getElementsByClassName("el-tabs__item is-top")
        );
        tab_top_dom.forEach((item, index) => {
          item.oncontextmenu = that.openTabsMenu;
        });
      });
    },

    goItem(item) {
      //const fullPath = `#` + item.path+'?id='+item.id;
      const fullPath = `#` + item.path;
      window.open(fullPath, "_blank");
    },
  },

  /**
   * 销毁钩子函数
   */
  destroyed() {
    $this = null;
    clearInterval($interval);
    clearInterval($audioInterval);
  },
});
const week = new Array(
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日"
);
function showTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let second = date.getSeconds();

  return (
    // year +
    //"." +
    //(month < 10 ? "0" + month : month) +
    // "." +
    //(day < 10 ? "0" + day : day) + //202.08.08修复日期天数小于10时添加0
    //"" +
    //" " +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (second < 10 ? "0" + second : second) +
    " " + //2020.08.30修复首页日期星期天不显示的问题
    (week[date.getDay() - 1] || week[6])
  );
}
</script>

<style lang="less" scoped>
::v-deep .el-scrollbar__view {
  height: 100% !important;
}
.header-navigation {
  ::v-deep .el-tabs__nav-scroll {
    padding-left: 24px;
    .el-tabs__nav {
      display: flex;
    }
  }
}

.header-navigation {
  ::v-deep .el-tabs__item.is-top {
    padding-left: 0 !important;
    padding-right: 32px !important;
    display: flex;
    align-items: center;
  }
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: none !important;
  font-weight: 500;
  font-size: 14px;
  color: #999999;
  padding-left: 0;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  background: #fff !important;
  border-bottom: none !important;
}
.cusp {
  cursor: pointer;
}
.caoname {
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 64px;
}
.uslin {
  width: 1px;
  height: 22px;
  margin: 0 13px;
  background: #666666;
}
.tuiout {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  i {
    font-size: 25px;
    margin-right: 6px;
  }
}
.vol-sty {
  width: 208px;
  margin: auto;
}
::v-deep .vol-el-menu {
  .el-menu {
    border-right: none !important;
    background: none !important;
  }
  .el-sub-menu {
  }
}

::v-deep .el-dropdown i {
  color: white;
}

.vol-aside .header {
  display: flex;
  // justify-content: center;
  align-items: center;
  padding-left: 15px;
}

.vol-aside .header img {
  width: 36px;
  height: 36px;
}

.vol-aside .header span {
  font-size: 18px;
  font-weight: bold;
  // letter-spacing: 4px;
  margin-left: -15px;
  color: #333333;
}

.vol-container .vol-path ::v-deep(.el-tabs__content) {
  padding: 0;
}

.contextMenu {
  width: 120px;
  margin: 0;
  border: 1px solid #eaeaea;
  background: #fff;
  z-index: 30000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgb(182 182 182 / 20%);

  i,
  button {
    font-size: 14px !important;
  }
}

.contextMenu li {
  margin: 0;
  padding: 0px 17px;
}

.contextMenu li:hover {
  background: #fafafa;
  cursor: pointer;
}

.contextMenu li button {
  color: #626060;
  font-size: 14px;
  letter-spacing: 1px;
}

.el-tabs.el-tabs--top.el-tabs--border-card.header-navigation
  > .el-tabs__header
  .el-tabs__item:last-child,
.el-tabs--top.el-tabs--border-card.header-navigation
  > .el-tabs__header
  .el-tabs__item:nth-child(2) {
  padding: 0;
}

.header-navigation ::v-deep(.el-tabs__item.is-top) {
  padding: 0 0px;
}
// 个人中心样式
.usercon {
  width: 100%;
  height: 393px;
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  .uselet {
    height: 316.5px;
    padding: 0 43px 0 26px;
    border-right: 1px dashed #bfc0c2;
    .yaoim {
      width: 147px;
      height: 147px;
      border-radius: 6px;
      margin-bottom: 18px;
    }
    .caoji {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
      margin-bottom: 13px;
    }
    .uutim {
      font-weight: 500;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
    }
    .updatePwd {
      cursor: pointer;
      padding-top: 17px;
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
      color: #3570fc;
      & > img {
        width: 16px;
        height: 16px;
        margin-right: 3px;
      }
    }
  }
  .userigt {
    width: 100%;
    height: 100%;
    padding: 0 26px 0 10px;
  }
}
.usebot {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0 24px 19px 0;
  .el-button {
    width: 86px;
    height: 36px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
  }
  .el-button--primary {
    background: #3570fc;
  }
}
</style>
<style>
.horizontal-collapse-transition {
  transition: 0s width ease-in-out, 0s padding-left ease-in-out,
    0s padding-right ease-in-out;
}
</style>
