<template>
  <div class="com-el-tree">
    <div class="m-title">
      <i class="el-icon-warning-outline"></i>选择设备区域
    </div>
    <el-scrollbar style="height: 95%; width: 210px" class="el-role-tree">
      <el-tree
        :data="tree"
        @node-click="nodeClick"
        node-key="id"
        :default-expanded-keys="openKeys"
        :default-expand-all="true"
        :expand-on-click-node="false"
        style="padding: 5px 0"
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
</template>

<script>
export default {
  props: {
    onChange: {
      type: Function,
      default: (treeId) => {},
    },
  },
  data() {
    return {
      selectId: -1,
      checked: false,
      openKeys: [],
      tree: [],
      options: [], //左侧区域树数据
    };
  },
  created() {
    this.load();
  },
  methods: {
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
          }else {
            x.len = "";
            this.getTreeLen(x.id, x);
          }
        });
        //设置默认打开的菜单
        this.openKeys.push(this.tree[0].children[0].children[0].children[0].id);
        this.selectId = this.openKeys[0];
        this.data = this.tree[0].children[0].children[0].children[0];
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
      this.selectId = node.id;
      this.onChange(node, 2);
    },
  },
};
</script>
<style lang="less" scoped>
.com-el-tree {
  display: inline-block;
  width: 210px;

  .el-role-tree {
    position: absolute;
    padding: 5px 0px;
    top: 45px;
    bottom: 0;
    border-right: 1px solid #eee;
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
  line-height: 40px;
  font-size: 15px;
  background: #66b1ff0f;
  font-weight: bold;
  padding: 6px 16px;
  border: 1px solid #ececec;
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
