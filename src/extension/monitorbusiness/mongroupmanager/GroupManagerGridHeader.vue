<template>
    <div>
        <vol-box :lazy="true" v-model="model.box" :title="groupName" :height="1000" :width="1335" :padding="15">
            <monitor-point :nodeName="nodeName" ref="monpointTable"></monitor-point>
        </vol-box>
    </div>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
import MonitorPoint from "@/views/monitorbusiness/monpointmanager/monpoint/MonPointTable.vue"
export default {
    components: { "vol-box": VolBox, "monitor-point": MonitorPoint },
    methods: {},
    created() {
        this.$store.getters.data().MonPointTreeData = { treeId: undefined };
    },
    data() {
        return {
            model: {
                box: false,
            },
            nodeName: "",
            groupName:"查看监测点列表",
        };
    },
    methods: {
        open1(id,groupName) {
            this.model.box = true;
            // console.log('groupName',groupName)
            this.groupName=groupName+'的监测点列表';
            this.$nextTick(() => {
                this.$store.getters.data().MonPointTreeData.nodeType = 'Group_Id';
                this.$store.getters.data().MonPointTreeData.nodeValue = id;
                this.$store.getters.data().MonPointManager.nodeClick({ nodeType: 'Group_Id', nodeValue: id });
            });
        }
    },
};
</script>
<style lang="less"></style>