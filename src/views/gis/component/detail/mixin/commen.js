
import { mapGetters } from 'vuex'
export default{
    watch: {
        GisCurrentGroup: function (newQuestion, oldQuestion) {
            this.pageInit()
        }
      },
      computed:{
        ...mapGetters([
            'GisCurrentGroup'
          ]),
      }
}