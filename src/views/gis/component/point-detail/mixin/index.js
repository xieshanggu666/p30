export default {
    methods: {

        InitNodeDetail(data) {
            console.log(data,'data');
            this.http.post('/api/Mon_Point_Manager/getPageData',{order: "asc",page: 1,rows: 30,sort: "ID",value: 1,wheres:JSON.stringify([{name:"ID",value:data.ID}])}).then(res => {
                this.result = res.rows[0];
                if (res.accessoryFile.length > 0) {
                    console.log(res.accessoryFile, 'res.accessoryFile');
                    this.srcList = [res.accessoryFile[0].url]
                }
            })
        },
        ShowDetailData(type) {
            this.dialogVisible = true;
            this.dialogType = type;
        },
        //先留下，看看是不是重启已经有了 
        showGroupInfo() {
            const that = this,
                data = this.currentGroupInfo;
            that.isHomeGroup = false;
            that.groupId = data.id;
            that.markerUpData();
            that.$emit("viewTestGroup", { groupId: data.id });
            that.moveToCenter(data.longitude, data.latitude, "group", data.d3Angle);
            that.$emit("showOrHideLeftBox", false);
            // this.mapConfig.map.setZoom(12);
        },
        showGroupDetail() {
            this.showDialog = true;
        },
        //关闭
        closeDetail() {
            this.hide();
            this.showViewDataDialog = false;
            this.showRunDataDialog = false;
            this.showControlDataDialog = false;
            this.$emit("CloseDetail");
        },
    }
}