<template>
  <div class="layout">
    <common-sidebar />
    <div class="layout__container">
      <common-navbar />
      <div class="layout__content">
        <nuxt class="-overflow-hidden" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonNavbar from '@/components/Commons/CommonNavbar.vue';
import CommonSidebar from '@/components/Commons/CommonSidebar.vue';
@Component<Layout>({
  name: 'Layout',
  middleware: 'isAuthenticated',
  components: {
    CommonNavbar,
    CommonSidebar,
  },
})
export default class Layout extends Vue {}
</script>

<style lang="scss" scoped>
$bg-gray-common: #f5f5f5;
.layout {
  overflow: hidden;
  height: 100vh;
  display: flex;
  &__container {
    width: 100%;
    overflow: scroll;
  }
  &__content {
    padding: 2rem;
  }
}
</style>
