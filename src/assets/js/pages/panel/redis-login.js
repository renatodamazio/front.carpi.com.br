import Vue from "vue/dist/vue.js";
import toastr from "toastr";
import { firebase } from '../../services/firebase/index';

export default () => {

  if ($('#redis-login').length > 0) {

    return new Vue({

      el: '#redis-login',

      data: {
        loading: false,
        password: '',
        email: ''
      },

      methods: {

        login() {

          const self = this;

          self.loading = true;

          firebase.auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(function (resp) {

              firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
                window.location.href = '/panel/';
              });

            })
            .catch(function (error) {

              console.log('Login catch error: ', error);

              self.loading = false;
              toastr["error"](error.message);

            });

        }

      }

    })

  }

}
