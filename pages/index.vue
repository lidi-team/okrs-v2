<template>
  <div class="container"><Login /></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Login from './account/login.vue';
@Component<Boss>({
  name: 'Base-component',
  components: {
    Login,
  },
})
export default class Boss extends Vue {}
</script>
