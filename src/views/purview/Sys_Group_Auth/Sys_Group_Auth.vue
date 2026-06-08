<template>
  <div class="role-container">
    <div class="role-tree-left flex-col">
      <div class="title"><i class="el-icon-user"></i>角色列表</div>
      <el-scrollbar class="el-role-list">
        <el-tree
          :data="tree"
          @node-click="nodeClick"
          node-key="id"
          :default-expanded-keys="openKeys"
          :expand-on-click-node="false"
          style="padding: 5px 0; margin-right: 2px"
        >
          <template #default="{ data }">
            <div class="action-group">
              <div class="action-text">
                {{ data.roleName }}
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="role-tree-right flex-col">
      <div class="title">
        <div><i class="el-icon-folder-opened"></i>项目权限配置</div>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
      <el-scrollbar class="el-role-list">
        <el-tree
          @check-change="leftCheckChange"
          @check="nodeCheck"
          :data="roleTree"
          :show-checkbox="false"
          style="padding: 15px"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ data }">
            <div class="action-group">
              <div
                class="action-text"
                :style="{ width: (4 - data.lv) * 18 + 150 + 'px' }"
              >
                <el-checkbox v-model="data.leftCk" @change="allChange(data)">{{
                  data.nodeName
                }}</el-checkbox>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, getCurrentInstance } from "vue";
import http from "@/../src/api/http.js";
export default defineComponent({
  setup() {
    const selectId = ref(-1);
    const checked = ref(false);
    const tree = reactive([]);
    const list = reactive([]);
    const roles = reactive([]);
    const roleList = reactive([]);
    const roleTree = reactive([]);
    const openKeys = reactive([]);

    const leftCheckChange = (node, selected) => {
      node.actions.forEach((x, index) => {
        x.checked = selected;
      });
    };
    const nodeCheck = (node, data) => {
      let rootData = roleList.find((x) => {
        return x.id === node.pid;
      });
      if (rootData && rootData.actions.length) {
        rootData.actions[0].checked =
          node.actions.some((x) => {
            return x.checked;
          }) ||
          data.halfCheckedNodes.some((x) => {
            return x.id === node.pid;
          });
      }
    };

    const allChange = (data) => {
      // console.log("data",data);
        // data.checked = data.leftCk;
      if (!data.children) {
        return;
      }
      setChildrenChecked(data, data.leftCk);
    };

    const setChildrenChecked = (data, ck) => {
      data.children.forEach((item) => {
        item.leftCk = ck;
        // item.actions.forEach((c) => {
        //   c.checked = ck;
        // });
        if (item.children) {
          setChildrenChecked(item, ck);
        }
      });
    };

    const load = () => {
      const url = "api/role/getUserChildRoles";
      http.post(url, {}, true).then((result) => {
        if (!result.status) return;
        list.splice(0);
        list.push(...result.data);
        list.forEach((x) => {
          if (x.parentId == 0) {
            x.lv = 1;
            x.children = [];
            tree.push(x);
            getTree(x.id, x);
          }
        });
        openKeys.push(tree[0].id);
        selectId.value = openKeys[0];
      });
    };
    const getTree = (id, data) => {
      list.forEach((x) => {
        if (x.parentId == id) {
          x.lv = data.lv + 1;
          if (!data.children) data.children = [];
          data.children.push(x);
          getTree(x.id, x);
        }
      });
    };
    
    // 点击树后权限分配
    const nodeClick = (node, selected) => {
      // 角色id
      selectId.value = node.id;
      console.log(selectId.value );
      getUserRole(node);
    };
    const getUserRole = (item) => {
      selectId.value = item.id;
      roleList.forEach((x) => {
          x.leftCk = false;
      });
      let url = `/api/Sys_Group_Auth/GetUserGroupPermission?groupRoleId=${item.id}`;
      http.post(url, {}, true).then((result) => {
        if (!result.status) return;
        result.data.forEach((item) => {
          // if (item.length == 0) return;
          let sourceItem = roleList.find((f) => parseInt(f.nodeValue) == item);
          if (sourceItem){
            sourceItem.leftCk=true
          };
        });

      });

    };

    const getRoleTree = (id, data, isRootId) => {
      roleList.forEach((x) => {
        if (x.parentId == id) {
          x.lv = data.lv + 1;
          if (isRootId) {
            x.rootId = id;
          }
          if (!data.children) data.children = [];
          data.children.push(x);
          getRoleTree(x.id, x, isRootId);
        }
      });
    };

// 初始化
    const getCurrentTreePermission = () => {
      let url = "/api/Sys_Group_Auth/GetCurrentTreePermission";
      http.post(url, {}, true).then((result) => {
        if (!result.status) return;
        roleList.splice(0);
        roles.splice(0);
        roleList.push(...result.data.tree);
        roles.push(...result.data.roles);
        roleList.forEach((x) => {
          if (x.parentId == 0) {
            x.lv = 1;
            x.children = [];
            x.len = 1;
            roleTree.push(x);
            getRoleTree(x.id, x);
          }
        });

      });
    };
    let $message =
      getCurrentInstance().appContext.config.globalProperties.$message;


    // 提交权限 
    const save = () => {
      if (selectId.value <= 0) {
        return $message.error("请选择角色!");
      }
      let checkedItems = roleList.filter(item => item.leftCk);
      let userPermissions = []
      checkedItems.forEach((x)=>{
        userPermissions.push(parseInt(x.nodeValue));
      })
      let filteredArr = userPermissions.filter(value => !isNaN(value)); // 过滤掉NaN
      console.log("filteredArr",filteredArr);
      
      
      
      let url = "/api/Sys_Group_Auth/SaveGroupPermission";
      let parmes={
        groupRoleId:selectId.value,
        groupIds:filteredArr
      }
      http.post(url, parmes, true).then((result) => {
        $message[result.status ? "success" : "error"](result.message);
      });
    };

    load();
    getCurrentTreePermission();
    return {
      list,
      nodeClick,
      checked,
      tree,
      selectId,
      openKeys,
      getUserRole,
      roles,
      roleList,
      getCurrentTreePermission,
      leftCheckChange,
      nodeCheck,
      roleTree,
      allChange,
      save,
    };
  },
});
</script>
<style lang="less" scoped>
.role-container {
  // position: absolute;
  background: #f6f6f6;
  height: 100%;
  width: 100%;
  // padding: 10px;
  display: flex;
  .flex-col {
    display: flex;
    flex-direction: column;
  }
  .role-tree-left {
    border: 1px solid #f2f2f2;
    background: #fff;
    width: 240px;
    height: 100%;
    margin-right: 10px;
    .title {
      height: 40px;
      border-bottom: 1px solid #f5f5f5;
      i {
        margin-left: 10px;
      }
    }
    ::v-deep .el-scrollbar{
      width: 100%;
      height: calc(100% - 40px) !important;
    }
  }
  .role-tree-right {
    background: #fff;
    width: calc(100% - 250px);
    .title {
      display: flex;
      height: 40px;
      border-bottom: 1px solid #f5f5f5;
      i {
        margin-left: 10px;
      }
      div {
        flex: 1;
      }
    }
    .action-group {
      display: flex;
      // line-height: 32px;
      justify-content: center;
      align-items: center;
      label {
        float: left;
      }
      .action-text {
        line-height: 33px;
        label {
          margin-right: 5px;
        }
      }
    }
  }
  .title {
    padding: 10px;
    // background: rgb(246 250 255);
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 2px;
  }
  .el-role-list {
    flex: 1;
    height: 0;
    overflow-x: hidden;
  }
}
.role-tree-left ::v-deep(.el-tree-node__content) {
  cursor: pointer;
  height: auto;
  padding: 5px;
  margin: 2px 10px;
  font-size: 15px;
}
.role-tree-left ::v-deep(.el-tree-node__content:hover) {
  background: #f4f4f4;
  border-radius: 20px;
}
.role-tree-left ::v-deep(.is-current > .el-tree-node__content:first-child) {
  background: #f2f2f2;
  border-radius: 20px;
}
.role-tree-right ::v-deep(.el-tree-node__content) {
  margin-bottom: 5px;
  height: auto;
}
.role-tree-right ::v-deep(.el-checkbox__label) {
  position: relative;
  top: 2px;
}
</style>
