
let viewgird = [
  {
    path: '/Sys_Log',
    name: 'sys_Log',
    component:  () => import('@/views/system/Sys_Log.vue' )
  },
  {
    path: '/Sys_User',
    name: 'Sys_User',
    component:  () => import('@/views/system/Sys_User.vue' )
  },
  {
    path: '/permission',
    name: 'permission',
    component:  () => import('@/views/system/Permission.vue' )
  },
  
  {
    path: '/Sys_Dictionary',
    name: 'Sys_Dictionary',
    component:  () => import('@/views/system/Sys_Dictionary.vue' )
  },
  {
    path: '/Sys_Role',
    name: 'Sys_Role',
    component:  () => import('@/views/system/Sys_Role.vue' )
  }, {
    path: '/Sys_Role1',
    name: 'Sys_Role1',
    component:  () => import('@/views/system/Sys_Role1.vue' )
  }
  , {
    path: '/Sys_DictionaryList',
    name: 'Sys_DictionaryList',
    component:  () => import('@/views/system/Sys_DictionaryList.vue' )
  }
  , {
    path: '/SellOrder',
    name: 'SellOrder',
    component:  () => import('@/views/order/SellOrder.vue' )
  }, {
    path: '/SellOrder2',
    name: 'SellOrder2',
    component:  () => import('@/views/order/SellOrder2.vue' )
  }, {
    path: '/SellOrder3',
    name: 'SellOrder3',
    component:  () => import('@/views/order/SellOrder3.vue' )
  }, {
    path: '/vSellOrderImg',
    name: 'vSellOrderImg',
    component:  () => import('@/views/order/vSellOrderImg.vue' )
  },
  {
    path: '/App_Appointment',
    name: 'App_Appointment',
    component:  () => import('@/views/order/App_Appointment.vue' )
  },
  {
    path: '/App_Appointment2', //二级表头
    name: 'App_Appointment2',
    component:  () => import('@/views/order/App_Appointment2.vue' )
  },
  {
    path: '/App_TransactionAvgPrice',
    name: 'App_TransactionAvgPrice',
    component:  () => import('@/views/appmanager/App_TransactionAvgPrice.vue' )
  }
  , {
    path: '/App_Expert',
    name: 'App_Expert',
    component:  () => import('@/views/appmanager/App_Expert.vue' )
  }
  , {
    path: '/App_Expert2',
    name: 'App_Expert2',
    component:  () => import('@/views/appmanager/App_Expert2.vue' )
  }
  , {
    path: '/App_Transaction',
    name: 'App_Transaction',
    component:  () => import('@/views/appmanager/App_Transaction.vue' )
  }
  , {
    path: '/App_Transaction2',
    name: 'App_Transaction2',
    component:  () => import('@/views/appmanager/App_Transaction2.vue' )
  }, {
    path: '/App_ReportPrice',
    name: 'App_ReportPrice',
    component:  () => import('@/views/appmanager/App_ReportPrice.vue' )
  }, {
    path: '/App_News',
    name: 'App_News',
    component:  () => import('@/views/appmanager/App_News.vue' )
  }, {
    path: '/App_NewsEditor',
    name: 'App_NewsEditor',
    component:  () => import('@/views/appmanager/App_NewsEditor.vue' )
  }    ,{
        path: '/FormDesignOptions',
        name: 'FormDesignOptions',
        component: () => import('@/views/system/form/FormDesignOptions.vue')
    }    ,{
        path: '/FormCollectionObject',
        name: 'FormCollectionObject',
        component: () => import('@/views/system/form/FormCollectionObject.vue')
    }    ,{
        path: '/Sys_WorkFlow',
        name: 'Sys_WorkFlow',
        component: () => import('@/views/system/flow/Sys_WorkFlow.vue')
    }    ,{
        path: '/Sys_WorkFlowTable',
        name: 'Sys_WorkFlowTable',
        component: () => import('@/views/system/flow/Sys_WorkFlowTable.vue')
    }    ,{
        path: '/Sys_QuartzOptions',
        name: 'Sys_QuartzOptions',
        component: () => import('@/views/system/quartz/Sys_QuartzOptions.vue')
    }    ,{
        path: '/Sys_QuartzLog',
        name: 'Sys_QuartzLog',
        component: () => import('@/views/system/quartz/Sys_QuartzLog.vue')
    }    ,{
        path: '/Test',
        name: 'Test',
        component: () => import('@/views/order/test/Test.vue')
      }    ,{
        path: '/Mon_Group_Manager',
        name: 'Mon_Group_Manager',
        component: () => import('@/views/monitorbusiness/mongroupmanager/Mon_Group_Manager.vue')
    }    ,{
        path: '/Mon_Type_Manager',
        name: 'Mon_Type_Manager',
        component: () => import('@/views/monitorbusiness/montypemanager/Mon_Type_Manager.vue')
    }    ,{
        path: '/Mon_Point_Manager',
        name: 'Mon_Point_Manager',
        component: () => import('@/views/monitorbusiness/monpointmanager/Mon_Point_Manager.vue'),
        // meta: {
        //   keepAlive: false
        // }
    }    ,{
        path: '/Sys_Personal_Setting',
        name: 'Sys_Personal_Setting',
        component: () => import('@/views/system/syspersonalsetting/Sys_Personal_Setting.vue')
    }    ,{
        path: '/Sys_Ent_Manager',
        name: 'Sys_Ent_Manager',
        component: () => import('@/views/system/sysentmanager/Sys_Ent_Manager.vue')
    }    ,{
        path: '/Sys_My_Notice',
        name: 'Sys_My_Notice',
        component: () => import('@/views/system/sysmynotice/Sys_My_Notice.vue')
    }    ,{
        path: '/Mon_Abnormal_Input',
        name: 'Mon_Abnormal_Input',
        component: () => import('@/views/monitorbusiness/monabnormalinput/Mon_Abnormal_Input.vue')
    }    ,{
        path: '/Mon_DevOps_Manager',
        name: 'Mon_DevOps_Manager',
        component: () => import('@/views/monitorbusiness/mondevopsmanager/Mon_DevOps_Manager.vue')
    }    ,{
        path: '/Ala_Infomation',
        name: 'Ala_Infomation',
        component: () => import('@/views/alarm/alainfomation/Ala_Infomation.vue')
    }    ,{
        path: '/Ala_Model',
        name: 'Ala_Model',
        component: () => import('@/views/alarm/alamodel/Ala_Model.vue')
    }    ,{
        path: '/Ala_SingleTemp',
        name: 'Ala_SingleTemp',
        component: () => import('@/views/alarm/singletemplate/Ala_SingleTemp.vue')
    }    ,{
        path: '/Ala_Operationinfo',
        name: 'Ala_Operationinfo',
        component: () => import('@/views/alarm/alaoperationinfo/Ala_Operationinfo.vue')
    }    ,{
        path: '/Data_Simple_Report',
        name: 'Data_Simple_Report',
        component: () => import('@/views/monitordata/datasimplereport/Data_Simple_Report.vue')
    }    ,{
        path: '/Ala_Statistic',
        name: 'Ala_Statistic',
        component: () => import('@/views/alarm/alastatistic/Ala_Statistic.vue')
    },{
        path: '/Data_MonitorReportTask',
        name: 'Data_MonitorReportTask',
        component: () => import('@/views/monitordata/datamonitorreporttask/Data_MonitorReportTask.vue')
    }    ,{
        path: '/bus_expertevaluation',
        name: 'bus_expertevaluation',
        component: () => import('@/views/monitorbusiness/bus_expertevaluation/bus_expertevaluation.vue')
    }    ,{
        path: '/bus_evaluationinfo',
        name: 'bus_evaluationinfo',
        component: () => import('@/views/monitorbusiness/bus_evaluationinfo/bus_evaluationinfo.vue')
    }    ,{
        path: '/Deduce_Layer',
        name: 'Deduce_Layer',
        component: () => import('@/views/deduce/deducelayer/Deduce_Layer.vue')
    },
    {  //xjc
      path: '/newCaidan',
      name: 'newCaidan',
      component: () => import('@/views/deduce/deducelayer/newCaidan.vue')
    },
    {  //cesium地图封装
      path: '/cesium',
      name: 'cesium',
      component: () => import('@/views/deduce/deducelayer/cesium.vue')
    },
    {  //设备预警
      path: '/Ala_equipment_warning',
      name: 'Ala_equipment_warning',
      component: () => import('@/views/alarm/alaequipment/Ala_equipment_warning.vue')
    },
    { //设备故障
      path: '/Equipment_Failure',
      name: 'Equipment_Failure',
      component: () => import('@/views/alarm/device/Equipment_Failure.vue')
    },
    { //人员管理 通讯录
      path: '/userGuanli',
      name: 'userGuanli',
      component: () => import('@/views/userGuanli/userGuanli.vue')
    },
    { //工单管理
      path: '/gonDanWorkOrder',
      name: 'gonDanWorkOrder',
      component: () => import('@/views/gonDanWorkOrder/gonDanWorkOrder.vue')
    },
    { //项目管理
      path: '/ProjectPoints',
      name: 'ProjectPoints',
      component: () => import('@/views/ProjectPoints/ProjectPoints.vue')
    },
    { //采集设备
      path: '/collectingDevice',
      name: 'collectingDevice',
      component: () => import('@/views/collectingDevice/collectingDevice.vue')
    },
    { //测点管理
      path: '/measurepoint',
      name: 'measurepoint',
      component: () => import('@/views/measurepoint/measurepoint.vue')
    }
    
  ]

export default viewgird
