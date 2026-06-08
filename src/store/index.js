import { createStore } from 'vuex'
const keys = { USER: 'user' }
function getUserInfo(state) {
  if (state.userInfo) return state.userInfo;
  let userInfo = localStorage.getItem(keys.USER);
  if (userInfo) {
    state.userInfo = JSON.parse(userInfo);
  }
  return state.userInfo;
}
export default createStore({
  state: {
    data: {},
    permission: [],
    isLoading: false,//2020.06.03增加路由切换时加载提示
    userInfo: null,
    currentGroup:null,
    getTreeValue:'',
    isrouter:'',
  },
  mutations: {
    //设备检测菜案选中
    rouACT:(state,data)=>{
      state.isrouter = data;
    },
    GIS_CHANGE_SETTING: (state, {
      key,
      value
  }) => {
      // eslint-disable-next-line no-prototype-builtins
      if (state.hasOwnProperty(key)) {
          state[key] = value;
      }
  },
    setPermission(state, data) {  //调用方式 this.$store.commit('setPermission', data)
      if (!data || typeof data != 'object') return;
      if (data instanceof Array) {
        state.permission.push(...data);
      } else {
        state.permission = data;
      }
    }, setUserInfo(state, data) {
      state.userInfo = data;
      localStorage.setItem(keys.USER, JSON.stringify(data));
    },
    clearUserInfo(state) {
      state.permission = [];
      state.userInfo = null;
      localStorage.removeItem(keys.USER);
    },
    test(state) {
      return 113344;
    },
    updateLoadingState(state, flag) {
      state.isLoading = flag
    },
    updateTreeValueState(state , flag){
      state.getTreeValue = flag
    }
  }, getters: {
    getPermission: (state) => (path) => {  //调用方式 store.getters.getPermission('sys_User')
      if (!path) return state.permission;
      return state.permission.find(x => x.path == path);
    },
    getUserInfo: (state) => () => {
      getUserInfo(state);
      return state.userInfo;
    }, getUserName: (state) => () => {
      getUserInfo(state);
      if (state.userInfo) {
        return state.userInfo.userName;
      }
      return '未获取到登陆信息';
    },
    getToken: (state) => () => {
      getUserInfo(state);
      if (state.userInfo) {
        return 'Bearer ' + state.userInfo.token;
      }
      return '';
    },
    isLogin: (state) => () => {
      if (getUserInfo(state)) {
        return true;
      }
      return false;
    },
    isLoading: (state) => () => {
      return state.isLoading;
    },

    getTreeValue: (state) => () => {
      return state.getTreeValue;
    },
    
    data: (state) => () => {
      return state.data;
    },
    getData: (state) => () => {
      return state.data;
    },
    GisCurrentGroup: state => state.currentGroup,

  }, actions: {
    setPermission(context, data) {
      context.commit('setPermission', data); //调用方式 store.dispatch('push')
    },
    toDo(context) {
      return context.Store.m;
    },
    onLoading(context, flag) {
      context.commit("updateLoadingState", flag);
    },
    setTreeValue(context,flag){
      context.commit("updateTreeValueState", flag);
    },
    GisChangeSetting({
      commit
  }, data) {
      commit('GIS_CHANGE_SETTING', data)
  } 
  }
})
