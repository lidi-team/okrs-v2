<template>
  <profile-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ProfilePage>({
  name: 'ProfilePage',
})
export default class ProfilePage extends Vue {}
</script>
