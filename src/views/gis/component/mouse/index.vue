<template >
    <div class="box">
        <div>
            经度:{{ props.position.lon}}

        </div>
        <div>
            纬度:{{ props.position.lat}}
        </div>

    </div>
</template>
<script setup>
const props = defineProps({
    position: {
        type: Object,
        default: {
            lon: 0,
            lat: 0
        }
    },

})
</script>
<style lang="scss" scoped>
.box {
    font-size: 12px;
    display: flex;
    width: 320px;

    div {
        flex: 1;
    }
}
</style>