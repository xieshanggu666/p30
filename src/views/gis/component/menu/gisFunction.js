export default {
  data() {
    return {
      gisFunction: {
        basicLayer: "image",
        landform: true,
        labels: {
          ibo: {
            title: '边界',
            flag: false,
            type: "ibo"
          },
          label: {
            title: '行政路线',
            flag: false,
            type: 'label'
          },
        },
      }
    }
  },
  methods: {
    ChangeLayer() {
      this.$emit("GisFunctionChangeLayer", this.gisFunction.basicLayer);
    },
    ChangeLaber(labelObj) {
      this.$emit("GisFunctionChangeLabel", labelObj,this.gisFunction.labels);
    },
    ChangeLandForm() {
      this.$emit("GisFunctionChangeLandForm", this.gisFunction.landform);
    },
    CallBackGroup(){
      this.$emit("GisFunctionCallBackGroup", this.gisFunction.landform);
    },
  }
}
