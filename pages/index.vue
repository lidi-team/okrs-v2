<template>
  <div class="container"><Login /></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Login from './account/login.vue';
@Component<HomePage>({
  name: '',
})
export default class HomePage extends Vue {}
</script>
