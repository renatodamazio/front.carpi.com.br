import Vue from "vue/dist/vue.js";

export default () => {

  if ($('#redis-log').length > 0) {
    return new Vue({

      el: '#redis-log',

      data: {
        del: []
      },

      methods: {
        toggleDel(i) {
          this.del[i] = !this.del[i] ? true : false;
          this.$forceUpdate();
        }
      }
    })

  }

}
