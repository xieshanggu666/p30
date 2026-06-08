<template>
  <div id="water">

    <div class="monitor">
      <div class="title">
        监测数据
      </div>
      <div class="data-box">
        <div class="box-li" v-for="(item, key) of monitorData" :key="key">
          <div class="time">{{ item.time }}</div>
          <div class="box-title shadow">
            {{ item.title }}
          </div>
          <div class="content">
            <div class="number">
              {{ item.value }}
            </div>
            <div class="units">
              {{ item.units }}
            </div>
            <div class="type">
              [{{ item.type }}]
            </div>
          </div>
          <div class="footer shadow">
            <div class="type">[{{ item.type }}]</div>
            <div class="flow">
              [流程:{{ item.flow }}]
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="monitor">
      <div class="title">
        监测项走势
      </div>
      <div class="data-box">
        <chart />

      </div>
    </div>


  </div>
</template>

<script>
export default {
  components: {
    chart: () => import('./chart-line-water.vue')
  },
  data() {
    return {
      dataContent: null,
      monitorData: [
        {
          title: '高锰酸盐指数',
          time: '2023-01-16 14:15:20',
          value: 0.62700,
          inValue: null,
          paramValue: 0.62700,
          units: 'mg/L',
          type: '标定',
          flow: '反应池排空'
        }, {
          title: '氨氮（NH3-N）',
          time: '2023-01-16 14:15:20',
          inValue: null,
          value: 0.01500,
          paramValue: 0.01500,
          units: 'mg/L',
          type: '跨度核查测试',
          flow: '反推水样管'
        }, {
          title: '总磷（以P计）',
          time: '2023-01-16 14:15:20',
          value: 0.01700,
          paramValue: 0.01700,
          inValue: null,

          units: 'mg/L',
          type: '标定',
          flow: '读取检测样品信号'
        }, {
          title: '总氮（湖、库.以N计）',
          time: '2023-01-16 14:15:20',
          value: 2.03121,
          paramValue: 2.02154,
          inValue: null,
          units: 'mg/L',
          type: '水样测试',
          flow: '检测室加热升温'
        },
      ],
      chartData: []
    }
  },
  mounted() {
    this.dataContent = setInterval(() => {
      this.DataInit();
    }, 3000)
  },
  beforeDestroy() {
    window.clearInterval(this.dataContent);
  },
  methods: {
    DataInit() {
      const arrIndex = parseInt(Math.random() * 4);
      this.monitorData[arrIndex].inValue = this.monitorData[arrIndex].value;


      this.monitorData[arrIndex].value = (this.monitorData[arrIndex].paramValue + (Math.random() * this.monitorData[arrIndex].paramValue) - (Math.random() * this.monitorData[arrIndex].paramValue)).toFixed(6);

    }
  }
}
</script>

<style lang="scss">
#water {
  color: #23cefd;
  user-select: none;
  height: 670px;
  overflow: scroll;

  .shadow {
    box-shadow: inset 0 0 10px 0 #23dbfc;
    border-radius: 6px;
  }

  .monitor {
    background-image: url('~@/assets/gis/water/box-bg.png');
    background-size: 100% 100%;
    padding: 22px 32px;
    margin-bottom: 12px;

    .data-box {
      height: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .box-li {
        text-align: center;
        width: 185px;

        .box-title {
          height: 36px;
          font-size: 16px;
          line-height: 36px;
          margin: 8px 0;
        }

        .content {
          height: 180px;
          padding: 20px 0 10px 0;
          box-sizing: border-box;
          border-radius: 10px;
          box-shadow: inset 0 0 70px 0 rgb(35 206 253 / 80%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;

          .number {
            width: 80%;
            height: 72px;
            line-height: 72px;
            border-radius: 8px;
            background-color: rgba(105, 214, 241, .45);
            color: #fff;
            font-size: 30px;
          }

          .units {
            font-size: 24px;
            color: #fff;
          }
        }

        .footer {
          width: 100%;
          height: 65px;
          margin-top: 8px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .title {
      width: 200px;
      height: 29px;
      padding-left: 9px;
      line-height: 29px;
      box-sizing: border-box;
      color: #23cefd;
      font-size: 14px;
      background-image: url(data:image/png;base64,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);
      background-size: 100% 100%
    }

  }

}
</style>