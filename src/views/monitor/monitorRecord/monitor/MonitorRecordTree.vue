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
          :current-node-key="selectId"
          :filter-node-method="filterNode"
          :default-expanded-keys="openKeys"
          :expand-on-click-node="true"
          style="padding: 5px 0"
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
                <span v-if="data.len">({{ data.len }})</span>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    onChange: {
      type: Function,
      default: (treeId) => {},
    },
    pointTreeId:{
      type:String,
      default: "",
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      filterText: "",
      selectId: -1,
      checked: false,
      openKeys: [],
      tree: [],
      options: [], //左侧区域树数据
    };
  },
  created() {
    this.load();
    // console.log("pointTreeId",this.pointTreeId);
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    load() {
      let url = `api/Mon_Group_Manager/GetProjectGroupTree?isCreateGroup=true`;
      this.http.get(url, {}, true).then((result) => {
        this.options = result;
        this.options.forEach((x) => {
          if (x.parentId == 0) {
            x.lv = 1;
            x.children = [];
            x.len = 1;
            this.tree.push(x);
            this.getTree(x.id, x);
          } else {
            x.len = "";
            this.getTreeLen(x.id, x);
          }
        });
        //设置默认打开的菜单
        this.openKeys.push(this.tree[0].children[0].children[0].children[0].id);
        // console.log("this.selectId",this.selectId);
        if(this.pointTreeId){
          this.selectId = this.pointTreeId.id;
          this.data=this.pointTreeId
        }else{
          this.selectId = this.openKeys[0];
          this.data = this.tree[0].children[0].children[0].children[0];
        }
        this.$nextTick(()=>{
          this.$refs.tree.setCurrentKey(this.openKeys[0]);
        })
        // console.log("this.data",this.data);
        this.onChange(this.data, 1);
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
    getTreeLen(id, data) {
      this.options.forEach((x) => {
        if (x.id == data.id) {
          if (data.children) data.len = data.children.length;
        }
      });
    },
    nodeClick(node, selected) {
      // console.log(node);
      this.selectId = node.id;
      this.onChange(node, 2);
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .el-tree-node__content{
  height: 40px !important;
}
.neit_es{
  width: 100%;
  height: calc(100% - 78px);
  overflow: hidden;
}
.com-el-tree {
  display: inline-block;
  width: 240px;
  height: 100%;
  .el-role-tree {
    width: 100%;
    height:100% ;
    background: #fff;
    margin-right: 5px;
    // border-right: 1px solid #eee;
  }
  .actived {
    color: #5884ff;
    font-size: 15px;
  }
  .action-text {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
}
.com-el-tree ::v-deep(.el-tree-node) {
  padding: 3px 0;
}
.com-el-tree ::v-deep(.el-scrollbar .el-scrollbar__thumb) {
  width: 0 !important;
}
</style>
