<template>
  <el-button class="el-button el-button--small el-button--purple" icon="el-icon-plus" @click="showDialog">Tạo OKRs dự án</el-button>
</template>

<script>
import { MutationState } from '@/constants/app.vuex';

export default {
  props: {
    listObjectiveParent: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    showDialog() {
      this.$store.commit(MutationState.SET_IS_DIALOG_OKRS, true);
      this.$store.commit(MutationState.SET_LIST_OBJECTIVE_PARENT, this.listObjectiveParent);
    },
  },
};
</script>
