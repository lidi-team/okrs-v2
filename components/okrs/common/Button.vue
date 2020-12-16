<template>
  <el-button
    class="el-button el-button--small el-button--purple"
    icon="el-icon-plus"
    @click="showDialog"
    :disabled="isDisable"
    >Tạo OKRs {{ nameObjective }}</el-button
  >
</template>

<script>
import { mapGetters } from 'vuex';
import {
  MutationState,
  GetterState,
  DispatchAction,
} from '@/constants/app.vuex';

export default {
  props: {
    nameObjective: {
      type: String,
      default: '',
      required: true,
    },
    typeObjective: {
      type: Number,
      required: true,
    },
    projectId: {
      type: Number,
      default: 0,
    },
    isDisable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      cycleId: GetterState.CYCLE_CURRENT,
    }),
  },
  methods: {
    showDialog() {
      this.$store.dispatch(DispatchAction.CREATE_DIALOG_OKRS);
      this.$store.commit(MutationState.SET_OBJECTIVE, {
        projectId: this.projectId,
        type: this.typeObjective,
        cycleId: this.cycleId,
      });
    },
  },
};
</script>
