<template>
  <el-button class="el-button el-button--small el-button--purple" icon="el-icon-plus" @click="showDialog">Tạo OKRs</el-button>
</template>

<script>
import { MutationState } from '@/constants/app.vuex';
export default {
  methods: {
    showDialog() {
      this.$store.commit(MutationState.SET_IS_DIALOG_OKRS, true);
      this.$store.commit(MutationState.SET_OBJECTIVE_PARENT, Number(this.$route.query.objectiveId));
    },
  },
};
</script>
