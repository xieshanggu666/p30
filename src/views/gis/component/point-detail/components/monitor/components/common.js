import {mapGetters} from 'vuex';
export default {
    data() {
        let that = this;
        return {
            selectDate: "",
            selectDate2: "",
            defaultTime: [new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 2, 1, 23, 59, 59)],
            formatType: "timestring",
        }
    },
    methods: {
        timeChange() {
            let past_time = new Date(Number(this.selectDate)).Format('yyyy');
            if (past_time != new Date().Format('yyyy')) {
                this.selectDate = "";
            }
            if (this.form.time == null) {
                this.form.time = [
                    `${new Date().Format("yyyy-MM-dd") + " " + "00:00:00"}`,
                    `${new Date().Format("yyyy-MM-dd hh:mm:ss")}`,
                ]
            }
        },
        timeInput() {
            let isAdmin = JSON.parse(localStorage.getItem('ur')).isAdmin;
            let obj = {
                radioDisplay: this.radio_display,
                radio: this.radio,
                type: this.condition_type.type,
                startTime: this.time && this.time[0] ? this.time[0] : "",
                endTime: this.time && this.time[1] ? this.time[1] : "",
            };
            if (this.time == null) {
                obj.startTime = `${new Date().Format("yyyy-MM-dd") + " " + "00:00:00"}`;
                obj.endTime = `${new Date().Format("yyyy-MM-dd hh:mm:ss")}`;
                this.time = [
                    `${new Date().Format("yyyy-MM-dd") + " " + "00:00:00"}`,
                    `${new Date().Format("yyyy-MM-dd hh:mm:ss")}`,
                ]
            } else {
                obj.startTime = this.time[0];
                obj.endTime = this.time[1];
            }
            if (isAdmin) {
                obj['kalmanFilter'] = this.waveFiltering
            }
            // this.$emit("deformation_determine", obj, this.radio_display);
        },
        // 判断是否跨年
        changeYear(time, split) {
            const that = this;
            let one = split;
            let minTime = new Date(that.selectDate).getTime() - one;
            let maxTime = new Date(that.selectDate).getTime() + one;
            let otherMin1 = new Date(new Date(that.selectDate).Format('yyyy') + '-01-01').getTime();
            let otherMax2 = new Date(new Date(that.selectDate).Format('yyyy') + '-12-31').getTime();
            let minYear1 = otherMin1 + one;
            let maxYear2 = otherMax2 - one;
            if (new Date(that.selectDate).getTime() < minYear1) {
                minTime = otherMin1
            }
            if (new Date(that.selectDate).getTime() > maxYear2) {
                maxTime = otherMax2;
            }
            if (maxTime > new Date().getTime()) {
                maxTime = new Date().getTime()
            }
            return time.getTime() < minTime || time.getTime() > maxTime;
        },
    }
}