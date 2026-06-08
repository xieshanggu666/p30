
let analyse = [
    {
      path: '/Analyse_Uniphase',
      name: 'Analyse_Uniphase',
      component: () => import('@/views/analyse/analyseuniphase/Analyse_Uniphase.vue')
    },
    {
      path: '/Analyse_Classify',
      name: 'Analyse_Classify',
      component: () => import('@/views/analyse/analyseclassify/Analyse_Classify.vue')
    },
    {
      path: '/Analyse_Montype',
      name: 'Analyse_Montype',
      component: () => import('@/views/analyse/analysemontype/Analyse_Montype.vue')
    },
    {
      path: '/Trend_Analysis',
      name: 'Trend_Analysis',
      component: () => import('@/views/analyse/analytrend/Trend_Analysis.vue')
    },
    
    // Mon_Type trend analysis
  
  ]
  export default analyse
  