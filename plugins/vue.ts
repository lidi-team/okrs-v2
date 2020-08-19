import Vue from 'vue';

Vue.prototype.$watchAll = function (props: Array<any>, callback) {
  props.forEach((prop) => {
    this.$watch(prop, callback);
  });
};
