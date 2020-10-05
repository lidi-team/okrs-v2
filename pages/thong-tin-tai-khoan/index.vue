<template>
  <profile-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// components
import ProfileView from '@/components/profile/View.vue';
@Component<ProfilePage>({
  name: 'ProfilePage',
  components: {
    ProfileView,
  },
  head() {
    return {
      title: 'Thông tin tài khoản',
    };
  },
})
export default class ProfilePage extends Vue {}
</script>
