<template>
  <profile-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProfileView from '@/components/Account/AccountProfile.vue';
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
