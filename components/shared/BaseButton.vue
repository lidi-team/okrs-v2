<template>
  <el-button type="primary">hello babe</el-button>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component<BaseButton>({
  name: 'BaseButton',
  mounted() {
    console.log('hello mounted');
    console.log(this.hello);
  },
  created() {
    console.log('hello');
  },
})
export default class BaseButton extends Vue {
  private hello: string = 'helloworld';
}
</script>
