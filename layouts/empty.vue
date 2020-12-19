<template>
  <div>
    <common-navbar />
    <nuxt />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// components
import CommonNavbar from '@/components/Commons/CommonNavbarUnauth.vue';
@Component<EmptyLayout>({
  name: 'EmptyLayout',
  components: {
    CommonNavbar,
  },
})
export default class EmptyLayout extends Vue {}
</script>
