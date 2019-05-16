import Vue from "vue/dist/vue.js";
import axios from "axios";

export default () => {

  if ($('#home').length > 0) {

    return new Vue({

      el: '#home',

      data: {
        message: 'Welcome to Frontfy!'
      }

    });

  }

}
