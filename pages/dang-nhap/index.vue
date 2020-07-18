<template>
  <account-login />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component<LoginPage>({
  name: 'LoginPage',
})
export default class LoginPage extends Vue {}
</script>
