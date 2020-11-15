<template>
  <div style="overflow: hidden; height: 100vh">
    <common-navbar />
    <div id="app">
      <common-sidebar />
      <div class="authenticated-screen__app">
        <div class="authenticated-screen__nuxt">
          <nuxt />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// components
import CommonNavbar from '@/components/common/Navbar.vue';
import CommonSidebar from '@/components/common/Sidebar.vue';
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

<style lang="scss">
@import '@/assets/scss/main.scss';
$bg-gray-common: #e5e5e5;
#app {
  height: 100vh;
  overflow: hidden;
  display: flex;
}
.authenticated-screen {
  &__app {
    flex: 1;
    overflow: auto;
    width: 100%;
    background-color: $bg-gray-common;
  }
  &__nuxt {
    padding: $unit-10;
    margin: 0 auto $unit-16 auto;
  }
}
</style>
