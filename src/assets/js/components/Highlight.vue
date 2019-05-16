<template>
  <div></div>
</template>

<script>
import JSONFormatter from "json-formatter-js";

export default {

  mounted() {
    setTimeout(() => {
      try {
        const formatter = new JSONFormatter(JSON.parse(this.$attrs.resp), [0]);
        this.$el.appendChild(formatter.render());
      } catch (err) {
        console.log("Ocorreu um erro ao formatar o objeto JSON: ", err);
      }
    }, 100);
  }
};
</script>
