import { h, resolveComponent } from 'vue';
import modelAlt from './modelAlt.vue'
import project from './project.vue'
let extension = {
  components: {
    //动态扩充组件或组件路径
    //表单header、content、footer对应位置扩充的组件
    gridHeader: '',
    gridBody: '',
    gridFooter: modelAlt,
    gridCenter:project,
    //弹出框(修改、编辑、查看)header、content、footer对应位置扩充的组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  buttons: [], //扩展的按钮
  methods: {
    //事件扩展
    onInit() {
      this.columns.forEach((x) => {
        if (x.field == 'ParentId') {
          x.title = '上级角色';
        }
      });

      //这些配置不是必须的
      this.editFormOptions.forEach((x) => {
        x.forEach((item) => {
          if (item.field == 'ParentId') {
            item.title = '上级角色';
            //设置任意节点都能选中(默认只能选中最后一个节点)
            item.changeOnSelect = true;
          }
        });
      });

    },
    onInited() {
      
      this.columns.push({
        title: "操作",
        field: "操作",
        width: 180,
        align: "center",
        render: (h, { row, column, index }) => {
            return h("div", { style: { cursor: 'pointer' } }, [
              h(
                resolveComponent("el-button"), {
                style: { padding: '0 7px' },
                type: "primary",
                plain: true,
                size: 'mini',
                onClick: (e) => {
                  e.stopPropagation()
                  this.edit(row);
                },
              },
                [h('i', { class: 'el-icon-edit' }, '修改')]
              ),
            h(
              resolveComponent("el-button"), {
              style: { padding: '0 7px' },
              type: "danger",
              plain: true,
              size: 'mini',
              onClick: (e) => {
                e.stopPropagation()
                this.del([row]);
              },
            },
              [h('i', { class: 'el-icon-delete' }, '删除')]
            )
          ],
          <el-dropdown  trigger="click" v-slots={{
            dropdown: () => (
              <el-dropdown-menu>
                <el-dropdown-item><div onClick={() => { this.dropdownClick('项目权限',row,column) }}>项目权限</div></el-dropdown-item>
                <el-dropdown-item><div onClick={() => { this.dropdownClick('菜单权限',row,column) }}>菜单权限</div></el-dropdown-item>
              </el-dropdown-menu>
            )
          }}
          >
            <el-button plain size="small" type="primary" style="font-size: 12px;cursor: pointer; margin-left:10px" class="el-dropdown-link">
              更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </el-dropdown>)
          }
        })
    },
    dropdownClick(value,row,column) {
      switch (value) {
        case "菜单权限":
          this.$refs.gridFooter.feilopenSate(row)
          break; 
        case "项目权限": 
          this.$refs.gridCenter.feilopenSate(row)
        default:
          break;
      }
    },
    addAfter(params) {
      this.initDicKeys(true);
      return true;
    },
    updateAfter(params) {
      this.initDicKeys(true);
      return true;
    },
    delAfter(params) {
      this.initDicKeys(true);
      return true;
    }
  }
};
export default extension;
