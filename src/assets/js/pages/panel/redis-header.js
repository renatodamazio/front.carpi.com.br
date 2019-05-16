import Vue from "vue/dist/vue.js";
import { firebase } from '../../services/firebase/index';

export default () => {

  if ($('#redis-header').length > 0) {

    return new Vue({

      el: '#redis-header',

      data() {

        return {
          template: ''
        };

      },

      created() {

        firebase.auth().onAuthStateChanged(function (user) {
          if (!user) window.location.href = "/panel/auth";
        });

        this.template = $('#template').val();

      },

      methods: {

        logout() {
          firebase.auth().signOut();
          window.location.href = "/panel/auth";
        }

      }

    });

  }

}
