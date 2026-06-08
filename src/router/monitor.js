
let monitor = [
  {
    path: '/Monitor_Record',
    name: 'Monitor_Record',
    component: () => import('@/views/monitor/monitorRecord/Monitor_Record.vue'),
    // meta: {
    //   keepAlive: false
    // }
  },
  {
    path: '/Monitor_Operation',
    name: 'Monitor_Operation',
    component: () => import('@/views/monitor/monitorOperation/Monitor_Operation.vue'),
    // meta: {
    //   keepAlive: false
    // }
  },
  {
    path: '/Monitor_Satellite',
    name: 'Monitor_Satellite',
    component: () => import('@/views/monitor/monitorSatellite/Monitor_Satellite.vue'),
    // meta: {
    //   keepAlive: false
    // }
  },
  {
    path: '/Monitor_Abnormal',
    name: 'Monitor_Abnormal',
    component: () => import('@/views/monitor/monitorAbnormal/Monitor_Abnormal.vue'),
  },

]
export default monitor
