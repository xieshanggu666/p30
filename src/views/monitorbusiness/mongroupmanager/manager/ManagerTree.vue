<template>
  <div class="com-el-tree">
    <div class="m-title">
      <el-input placeholder="请输入关键词" v-model="filterText">
      </el-input>
    </div>
    <div class="neit_es">
      <el-scrollbar  class="el-role-tree">
        <el-tree
          :data="tree"
          @node-click="nodeClick"
          node-key="id"
          :current-node-key="actId"
          :default-expanded-keys="openKeys"
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          style="padding: 5px 0px"
          highlight-current
          ref="tree"
        >
          <template #default="{ node, data }">
            <div class="action-group">
              <div
                class="action-text"
                :class="{
                  actived: data.id == selectId,
                  'node-text': data.parentId !== 0,
                }"
                :style="{ width: (4 - data.lv) * 18 + 150 + 'px' }"
              >
                {{ data.nodeName }}
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
// 测试用
import options from "./tree_options";
export default {
  props: {
    onChange: {
      type: Function,
      default: (treeId) => {},
    },
  },
  data() {
    return {
      actId:'',
      filterText: "",
      selectId: -1,
      checked: false,
      openKeys: [],
      tree: [],
      options: [], //左侧区域树数据
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.load();
  },
  methods: {
    filterNode(value, data) {
      console.log("value", value);
      console.log("data", data);
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    load() {
      let url = `api/Mon_Group_Manager/GetProjectGroupTree?isCreateGroup=false`;
      this.http.get(url, {}, true).then((result) => {
        this.options = result;
        this.options.forEach((x) => {
          if (x.parentId == 0) {
            x.lv = 1;
            x.children = [];
            this.tree.push(x);
            this.getTree(x.id, x);
          }
        });
        //设置默认打开的菜单
        // this.openKeys.push(this.tree[0].id);
        // this.selectId = this.openKeys[0];
        this.openKeys.push(this.tree[0].children[0].children[0].id);
        this.selectId = this.openKeys[0];
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.selectId);
        });
        this.data = this.tree[0].children[0].children[0];
        //默认加载第一个树形菜单下面的数据
        this.$store.getters.data().treeData.treeId = this.selectId;
        this.$store.getters.data().treeData.nodeName = this.tree[0].nodeName;
        this.$store.getters.data().treeData.nodeType = this.tree[0].nodeType;
        this.$store.getters.data().treeData.nodeValue = this.tree[0].nodeValue;
        //调用刷新table数据
        this.onChange(this.data);
      });
    },
    getTree(id, data) {
      this.options.forEach((x) => {
        if (x.parentId == id) {
          x.lv = data.lv + 1;
          if (!data.children) data.children = [];
          data.children.push(x);
          this.getTree(x.id, x);
        }
      });
    },
    nodeClick(node, selected) {
      this.$nextTick(()=>{
        this.actId = node.id;
      })
      
      console.log("1111111111111111111111111", node);
      this.selectId = node.id;
      //缓存当前选中的节点
      this.$store.getters.data().treeData.treeId = node.id;
      this.$store.getters.data().treeData.nodeName = node.nodeName;
      this.$store.getters.data().treeData.nodeType = node.nodeType;
      this.$store.getters.data().treeData.nodeValue = node.nodeValue;
      //调用刷新table数据
      this.onChange(node);
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .el-tree-node__content{
  height: 40px !important;
}
.com-el-tree {
  display: inline-block;
  width: 100%;
  height: 100%;
  .el-role-tree {
    width: 100%;
    height: 100%;
    background: #fff;
    // position: absolute;
    // padding: 5px 0px;
    // top: 45px;
    // bottom: 0;
    // border-right: 1px solid #eee;
  }
  .actived {
    color: #5884ff;
    font-size: 15px;
  }
  .action-text {
    font-size: 14px;
  }
}
.role-list {
  color: white;
  line-height: 44px;
  background: #1a89ff;
  padding: 0 13px;
  font-size: 16px;
  position: absolute;
  top: 2px;
  width: 210px;
}
.m-title {
  // height: 68px;
  // line-height: 40px;
  font-size: 15px;
  background: #fff;
  font-weight: bold;
  padding: 20px 16px 5px;
  i {
    padding-right: 5px;
  }
 ::v-deep .el-input__wrapper{
    background: #F8FAFF !important;
  }
}
.neit_es{
  width: 100%;
  height: calc(100% - 78px);
  overflow: hidden;
}
.com-el-tree ::v-deep(.el-tree-node) {
  padding: 3px 0;
}
.com-el-tree ::v-deep(.el-scrollbar .el-scrollbar__thumb) {
  width: 0 !important;
}
</style>
