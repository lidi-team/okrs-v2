<template>
  <div class="-display-flex -justify-content-center -align-items-center">
    <img src="@/assets/images/error/error.png" alt="404" />
    <div>
      <h1 class="-title-1">{{ `Lỗi ${error.statusCode}!!!` }}</h1>
      <div>
        Vui lòng kiểm tra lại, hoặc nhấn vào nút phía dưới để trở về trang chủ.
      </div>
      <nuxt-link rel="canonical" to="/">
        <el-button class="el-button--purple -mt-3">Trở về trang chủ</el-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'Error404Page',
  head() {
    return {
      title: '404',
    };
  },
})
export default class Error404Page extends Vue {
  @Prop(Object) error;
}
</script>
