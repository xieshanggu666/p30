export default{
    name:'formConfig',
    data(){
        return{
            senheForm:{
                  handleVisitClose:()=>{
                    console.log('关闭触发',122);
                    this.senheForm.titles = '审核';
                    this.senheForm.visitDialogVisible = false;
                    this.senheForm.formConfig.disabled = false;
                    this.senheForm.ruleForm=this.$options.data().senheForm.ruleForm;
                  },
                  visitDialogVisible:false,
                  titles:'审核',
                  formConfig: {
                    disabled:false,            //禁用整个form表单
                    formStyle: {
                      colnum: "2", // 每行显示几列
                    },
                    items: [
                      {
                        valueType: "radio",      // 类型输入框
                        label: "审核结果",
                        col:2,
                        key: "senheStart",          // 表单key值
                        prop: "senheStart",         // 必传验证 
                        data:[
                            {label:'通过',value:1},
                            {label:'拒绝',value:2},
                        ]
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "审核备注",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "Comment",          // 表单key值
                        prop: "Comment",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                    ]
                  },
                  ruleForm: {
                      senheStart:1,
                      Comment:'', 
                  },
                  buttonConfig: {
                    position: "flex-end",
                    //validateAll: ["ruleForm"],  多表单验证 提交 ruleForm与 publicForm的ref必须一致
                    buttons: [
                      {
                        type: "save",
                        loading: false,
                        fn: data => {
                          let dataus = JSON.parse(JSON.stringify(data));
                          let user=JSON.parse(localStorage.getItem('user'));
                         
                          console.log('dataus',dataus);
                          console.log('this.shenheObj',this.shenheObj);




                          let senhetit='';
                          //如果有故障原因复合（ReasonReview） 说明是接单人提交的派发人员审核
                          if( this.shenheObj.ReasonReview){
                              //派发人员审核  通过则完成（已结束）
                              this.shenheObj.AuditStatus=dataus.senheStart==1?3:-1;  //1已派发  -1审核拒绝
                              senhetit='派发人员审核';
                          }else{ 
                              //项目负责人审核  通过则待派发
                              this.shenheObj.AuditStatus=dataus.senheStart==1?1:-1;  //3审核通过  -1审核拒绝
                              senhetit='项目负责人审核';
                          }
                          this.shenheObj.Comment=dataus.Comment;  //备注信息
                          //处理图片
                          if(Array.isArray(this.shenheObj.Acc_Num)){
                              let arrs =this.shenheObj.Acc_Num.map(val => {
                                  //处理图片拼接地址
                                  if(val.url.indexOf(this.file_url)==-1){
                                      return val.url
                                  }else{
                                      return val.url.split(this.file_url)[1];
                                  }
                              })
                              this.shenheObj.Acc_Num= arrs.join(',')
                          }
                          let obj={mainData:this.shenheObj};
                          this.http.post('api/Mon_DevOps_Manager/update', obj).then(res => {
                              if (res.status) {
                                this.$message({message: '操作成功', type: 'success'}) 
                                this.setSearchParams();
                                this.senheForm.handleVisitClose();

                                //修改流程日志
                                let Records= {  
                                        Status: senhetit,  //审核标题
                                        ShenheStart:dataus.senheStart==1?'通过':'拒绝',  //审核状态
                                        Image:user.img,  
                                        Name:user.userName,   
                                        CreateDate:this.selectDay(),
                                        Remarks:dataus.Comment,
                                };
                                //流程日志记录
                                let liucObj=this.uuRizis;
                                let nisArr=JSON.parse(liucObj.Record); 
                                nisArr.push(Records);  
                                liucObj.Record=JSON.stringify(nisArr);  //操作记录
                                let dataobj={mainData:liucObj};  
                                
                                this.http.post('api/Mon_OpsAuditRecord/update', dataobj).then(res => {
                                    if (res.status) {
                                        console.log('修改流程日志');
                                    }
                                });
                            }
                          });
                        }
                      },
                      {
                        type: "back",
                        fn: data => {
                          this.senheForm.handleVisitClose();
                        }
                      }
                    ]
                  },
                  rules: {
                    Comment: [
                       {required: true, message: '请输入审核备注', trigger: 'blur'}
                      ]
                  },
            }
        }
    }
}