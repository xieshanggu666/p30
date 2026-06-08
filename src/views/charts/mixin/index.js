import block1Img from '@/assets/img/block-1.png';
import block2Img from '@/assets/img/block-2.png';
import block3Img from '@/assets/img/block-3.png';
import block4Img from '@/assets/img/block-4.png';

import CountTo from '../components/vueto/vue-countTo.vue'

export default {
  components: {
    CountTo
  },
  computed: {
    homeStyle() {
      return {
        transformOrigin: 'left top',
        transform: `scale(${this.scalseNum_w},${this.scalseNum_h})`,
        '-webkit-transform': `scale(${this.scalseNum_w},${this.scalseNum_h})`,
        '-moz-transform': `scale(${this.scalseNum_w},${this.scalseNum_h})`,
        '-o-transform': `scale(${this.scalseNum_w},${this.scalseNum_h})`,
        '-ms-transform': `scale(${this.scalseNum_w},${this.scalseNum_h})`,
      }
    }
  },
  data() {
    return {
      style: {
        blockArr: [{
          backgroundImage: `url(${block1Img})`
        }, {
          backgroundImage: `url(${block2Img})`
        }, {
          backgroundImage: `url(${block3Img})`
        }, {
          backgroundImage: `url(${block4Img})`
        },],
      },
      show: {
        header: false,
        left: false,
        middle: false,
        right: false,
    },
    tabIndex: 1,

    timeNow: "",
    scalseNum_h: 1,
    scalseNum_w: 1,
    blockCenter: [],
    // 数字滚动
    showVal: false,
    prNodeNum: [],
    oldNum: 0,
    //timeCenter 轮询 10秒
    timeCenter: null,
    //timeCenter 轮询 2秒
    CenterSetTime: null,
    setTime_home: null,
    //数据计时器
    dataTime: null,
    setTwo: 0,
    t: -1,
    c: -1,

    startVal: 0,
    endVal: 100,
    duration: 3000,
    timer: null,
    blockinfo:[],
    CenterData:[],
    };
  },
  created() {
    this.GetCenter();
    this.timer = setInterval(() => {
      this.ChangeCenter()
    }, 4000)
  },
  unmounted() {
    clearInterval(this.timer)
  },
  methods: {
    GetCenter() {
      this.http.get("api/BigScreen/GetMonitorData").then((result) => {
        this.blockinfo=result.data
        this.blockCenter = [
          { name: '评估数据', value: 0, inValue: this.blockinfo.safeDays, duration: parseInt(Math.random() * 4000) },
        ]
        this.CenterData=[
          { name: '今日监测数据', value: 0, inValue: this.blockinfo.totayDataCount, duration: parseInt(Math.random() * 4000) },
          { name: '今日预警数', value: 0, inValue: this.blockinfo.totayAlarmCount, duration: parseInt(Math.random() * 4000) },
          { name: '本月预警数', value: 0, inValue: this.blockinfo.monthAlarmCount, duration: parseInt(Math.random() * 4000) },
        ]
        this.show.left = true;
        this.show.middle = true;
        this.show.right = true;
        this.show.header = true;
        this.ChangeCenter();
      });
    },
     ChangeCenter() {
      this.http.get("api/BigScreen/GetMonitorData").then((result) => {
        this.blockinfo=result.data
        this.blockCenter = [
          { name: '评估数据', value: this.blockCenter[0].inValue, inValue: this.blockinfo.safeDays, duration: parseInt(Math.random() * 4000) },
        ],
        this.CenterData=[
          { name: '今日监测数据', value: this.CenterData[0].inValue, inValue: this.blockinfo.totayDataCount, duration: parseInt(Math.random() * 4000) },
          { name: '今日预警数', value: this.CenterData[1].inValue, inValue: this.blockinfo.totayAlarmCount, duration: parseInt(Math.random() * 4000) },
          { name: '本月预警数', value: this.CenterData[2].inValue, inValue: this.blockinfo.monthAlarmCount, duration: parseInt(Math.random() * 4000) },
        ]
      });
    },
  }
}
