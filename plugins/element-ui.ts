import Vue from 'vue';
import { Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/row.css';
import 'element-ui/lib/theme-chalk/col.css';
import 'element-ui/lib/theme-chalk/container.css';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/form.css';
import 'element-ui/lib/theme-chalk/form-item.css';
import { elComponent } from '@/constants/app.enum';

Vue.component(elComponent.ElRow, () => import(/* webpackChunkName: 'element-ui-form-row' */ 'element-ui/lib/row'));
Vue.component(elComponent.ElCol, () => import(/* webpackChunkName: 'element-ui-form-col' */ 'element-ui/lib/col'));
Vue.component(elComponent.ElContainer, () => import(/* webpackChunkName: 'element-ui-form-col' */ 'element-ui/lib/container'));
Vue.component(elComponent.ElButton, () => import(/* webpackChunkName: 'element-ui-button' */ 'element-ui/lib/button'));
Vue.component(elComponent.ElInput, () => import(/* webpackChunkName: 'element-ui-input' */ 'element-ui/lib/input'));
Vue.component(elComponent.ElForm, () => import(/* webpackChunkName: 'element-ui-form' */ 'element-ui/lib/form'));
Vue.component(elComponent.ElFormItem, () => import(/* webpackChunkName: 'element-ui-form-item' */ 'element-ui/lib/form-item'));

Vue.prototype.$loading = Loading.service;
