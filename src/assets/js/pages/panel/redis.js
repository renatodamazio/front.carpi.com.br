import Vue from "vue/dist/vue.js";
import Code from "../../components/Highlight.vue";
import axios from "axios";
import toastr from "toastr";
import { saveAs } from 'file-saver';

export default () => {

  if ($('#redis').length > 0) {

    return new Vue({
      el: '#redis',

      components: {
        'cod': Code
      },

      data: {
        keys: [],
        show: [],
        report: {
          show: false,
          loading: false
        },
        resp: [],
        view_: 'all',
        saveData: [],
        total: {
          errors: 0,
          online: 0
        },
        info: [],
        clearAll: false
      },

      watch: {

        view_() {

          var self = this;

          self.report.show = false;

          if (self.view_ == 'all') {
            self.keys = self.saveData;
            return false;
          };

          self.keys = [];

          self.saveData.forEach(item => {

            if (self.view_ == 'success') {
              if (!item.key.match(/request:error:/)) {
                self.keys.push(item);
              }
            }

            if (self.view_ == 'error') {
              if (item.key.match(/request:error:/)) {
                self.report.show = true;
                self.keys.push(item);
              }
            }

          })
        }
      },

      methods: {
        showOptions(indice) {
          this.show[indice] = !this.show[indice] ? true : false;
          this.$forceUpdate();
        },

        toggleClearAll(indice) {
          this.clearAll = !this.clearAll ? true : false;
          this.$forceUpdate();
        },

        getRedisInfo() {
          var info = document.getElementById('info').value;

          if (info.length > 0) {

            this.info = JSON.parse(info);

          }
        }
      },

      mounted() {

        const $data = document.getElementById('data');

        if ($data.value.length) {

          this.keys = JSON.parse($data.value);
          this.saveData = JSON.parse($data.value);

          this.keys.forEach(key => {

            if (key.key.match('request:error:')) {

              this.total.errors++;

            } else {

              this.total.online++;

            }

          })

        };

        this.getRedisInfo();

      },

      methods: {

        showOptions(indice) {
          this.show[indice] = !this.show[indice] ? true : false;
          this.$forceUpdate();
        },

        toggleClearAll(indice) {
          this.clearAll = !this.clearAll ? true : false;
          this.$forceUpdate();
        },

        getRedisInfo() {
          var info = document.getElementById('info').value;

          if (info.length > 0) {

            this.info = JSON.parse(info);

          }
        },

        generateReport() {

          const self = this;

          self.report.loading = true;

          axios
            .get('/panel/logs/docx')
            .then(response => {

              const data = response.data;
              const file = data.file;

              saveAs(new Blob([new Uint8Array(file.buffer.data)]), file.name);

              self.report.loading = false;
              toastr["success"]('O relatório foi gerado com sucesso!');

            })
            .catch(error => {

              console.log('Ocorreu um erro ao gerar o documento: ', error);

              self.report.loading = false;
              toastr["error"](error);

            });

        }

      }

    });

  }

}
