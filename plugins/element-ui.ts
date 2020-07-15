import Vue from 'vue';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/input.css';

Vue.component('ElButton', () => import(/* webpackChunkName: 'element-ui-button' */ 'element-ui/lib/button'));
Vue.component('ElInput', () => import(/* webpackChunkName: 'element-ui-input' */ 'element-ui/lib/input'));
