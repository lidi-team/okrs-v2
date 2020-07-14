import Vue from 'vue';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/input.css';
import { elComponent } from '@/type/app.enum';

export default () => {
  Vue.component(elComponent.ElButton, () => import(/* webpackChunkName: 'element-ui-button' */ 'element-ui/lib/button'));
  Vue.component(elComponent.ElInput, () => import(/* webpackChunkName: 'element-ui-input' */ 'element-ui/lib/input'));
};
