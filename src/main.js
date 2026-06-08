import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';

// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css'
import './assets/element-icon/icon.css'
import "./uitils/rem.js"; // 自适应分辨率

import base from './uitils/common'
import http from './api/http'
import 'video.js/dist/video-js.css'
// import 'dayjs/locale/zh-cn'
// import locale from 'element-plus/lib/locale/lang/zh-cn'

//引入dataV
import DataVVue3 from '@kjgl77/datav-vue3';


import permission from './api/permission'
import viewgird from './components/basic/ViewGrid';
import publicTable from './components/publicTable';  //共用表格组件
import publicForm from './components/publicForm';    //共用表单组件
import vueSeamless from "vue-seamless-scroll/src";
if (vueSeamless.beforeDestroy) {
    vueSeamless.beforeUnmount = vueSeamless.beforeDestroy;
    delete vueSeamless.beforeDestroy;
}
vueSeamless.install = function (app, options = {}) {
    app.component(options.componentName || vueSeamless.name, vueSeamless)
}
const app = createApp(App);
app.use(DataVVue3);
//全局方法
app.config.globalProperties.base = base;
app.config.globalProperties.http = http;
app.config.globalProperties.$tabs = {};
app.config.globalProperties.permission = permission;
app.config.globalProperties.$global = { 
    signalR: false //是否开启signalR
}
app.component('publicTable', publicTable);
app.component('publicForm', publicForm);

app.use(store)
    .use(ElementPlus, { size: 'default' })
    .use(router)
    .use(viewgird)
    .use(publicTable)
    .use(publicForm)
    .use(vueSeamless)
    .mount('#app');
app.config.globalProperties.$Message = app.config.globalProperties.$message;

