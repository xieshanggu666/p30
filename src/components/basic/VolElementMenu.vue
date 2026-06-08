<template>
  <div class="vol-el-menu">
    <el-menu
      close="vol-el-menu--vertical"
      :default-openeds="openedIds"
      :default-active="defaultActive"
      :unique-opened="true"
      @select="select"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      @contextmenu.prevent="bindRightClickMenu"
    >
      <template v-for="item in convertTree(list)">
        <el-sub-menu
          :key="item.id"
          :index="'' + item.id"
          v-if="item.children.length && (!enable || item.enable == 1)"
        >
          <template #title>
            <i class="menu-icon" :class="item.icon"></i>
            <span> {{ item.name }}</span>
          </template>
          <vol-element-menu-child
            :enable="enable"
            :list="item.children"
          ></vol-element-menu-child>
        </el-sub-menu>
        <template v-else>
          <el-menu-item
            class="menu-item-lv1"
            v-if="!enable || item.enable == 1"
            :key="item.id"
            :index="'' + item.id"
          >
            <i :class="item.icon"></i>
            <span> {{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import VolElementMenuChild from './VolElementMenuChild';
import { useRouter,useRoute} from 'vue-router';

import {
  defineComponent,
  reactive,
  watch,
  ref,
  toRef,
  toRefs,
  getCurrentInstance
  // onMounted,
} from 'vue';
export default defineComponent({
  components: {
    'vol-element-menu-child': VolElementMenuChild
  },
  props: {
    enable: {
      type: Boolean,
      default: false //是否判断enable=1
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    onSelect: {
      type: Function,
      default: (x) => {}
    },
    openSelect: {
      //打开的时候是否触发选中事件
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default: []
    },
    rootId: {
      type: String,
      default: '0'
    },
    currentMenuId: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const router = useRouter();
    // const { list } = toRefs(props);
    //  const treeList = ref([]);
    const getTree = (id, node, data) => {
      if (!node.children) {
        node.children = [];
      }
      data.forEach((x) => {
        if (x.parentId == id && !node.children.some((c) => c.id === x.id)) {
          node.children.push(x);
          getTree(x.id, x, data);
        }
      });
    };
    let rootTreeId = !isNaN(props.rootId) ? ~~props.rootId : props.rootId;
    props.list.forEach((x) => {
      if (!x.icon || x.icon.substring(0, 3) != 'el-') {
        x.icon = 'el-icon-menu';
      }
      x.children = [];
      x.isRoot = x.parentId === rootTreeId;
    });
    const convertTree = (data) => {
      var root_data = [];
      data.forEach((x) => {
        if (x.parentId === rootTreeId) {
          if (!x.hasOwnProperty('enable')) x.enable = 1;
          root_data.push(x);
          getTree(x.id, x, data);
        }
      });
      return root_data;
    };
    const { path, query, params } = useRoute();
    const openedIds = reactive([props.currentMenuId]);
    const defaultActive = ref(props.currentMenuId + '');
    let _base = getCurrentInstance().appContext.config.globalProperties.base;
    watch(
      () => props.currentMenuId,
      (newVal, oldVal) => {
        defaultActive.value = newVal + '';
        openedIds.splice(0);
        openedIds.push(
          ..._base.getTreeAllParent(newVal, props.list).map((c) => {
            return c.id;
          })
        );
      }
    );

    let eventSelect = false;
    const select = (index, path) => {
      if (eventSelect) {
        return;
      }
      eventSelect = true;
      setTimeout(() => {
        eventSelect = false;
      }, 20);

      let _item = props.list.find((x) => {
        return x.id == index;
      });
      props.onSelect(index, _item);
      router.push({ path: _item.path || '' });
    };

    const handleOpen = (index, path) => {
      if (props.openSelect) {
        select(index, path);
      }
    };
    const handleClose = () => {};

    /**
     * 菜单导航右键事件
     * @param {*} enable 是否启用右键事件[true:启用;false:禁用;]
     */
    const bindRightClickMenu = (enable) => {
      if (!enable) return;
    };

    return {
      // treeList,
      // list,
      select,
      convertTree,
      handleOpen,
      handleClose,
      bindRightClickMenu,
      openedIds,
      defaultActive
    };
  }
});
</script>
<style lang="less" scoped>
::v-deep .menu-item-lv1{
  padding-left: 16px !important;
  padding: 0 16px;
  height: 48px !important;
  line-height: 48px !important;
  i{
    color: #A2ACC2 !important;
  }
  .el-icon-s-home{
    margin-right: 0px !important;
  }
  span{
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}
.el-menu-item.is-active{
  background: #E6EEFF;
  border-radius: 4px;
  color: #3570FC;
  i{
    color: #3570FC !important;
  }
  span{
    font-size: 14px;
    color: #3570FC;
    font-weight: 500;
  }
}
.vol-el-menu {
  box-sizing: content-box;
  width: 100%;
  .menu-icon {
    font-size: 18px;
    margin-right: 6px;
  }
}
::v-deep.el-sub-menu{
  &>.el-sub-menu__title{
    height: 48px !important;
    line-height: 48px !important;
    padding: 0 16px !important ;
  }
  .menu-icon{
    color: #A2ACC2;
  }
}
.is-active.el-sub-menu{
  .menu-icon{
    color: #3570FC !important;
  }
}

</style>
