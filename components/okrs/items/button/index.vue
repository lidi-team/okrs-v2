<template>
  <el-button class="el-button el-button--small el-button--purple" icon="el-icon-plus" @click="showDialog">Tạo OKRs {{ nameObjective }}</el-button>
</template>

<script>
import { mapGetters } from 'vuex';
import { MutationState, GetterState, DispatchAction } from '@/constants/app.vuex';

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
    },
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
        cycleId: this.cycleId.id,
      });
    },
  },
};
</script>
