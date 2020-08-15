<template>
  <el-form ref="tempAlignOkrs" :model="tempAlignOkrs" :rules="rules">
    <el-form-item prop="objectiveId">
      <el-select v-model.number="tempAlignOkrs.objectiveId" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs liên kết chéo">
        <el-option v-for="item in itemsAlignOkrs" :key="item.id" :label="staffOkrsFormat(item)" :value="item.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OkrsRepository from '@/repositories/OkrsRepository';
import { Maps, Rule } from '@/constants/app.type';
@Component<InputAlignOkrs>({
  name: 'InputAlignOkrs',
  created() {
    this.getStaffOkrs();
  },
})
export default class InputAlignOkrs extends Vue {
  private itemsAlignOkrs: any[] = [];
  private tempAlignOkrs: Object = {
    objectiveId: null,
  };

  private getStaffOkrs() {
    const items = this.$store.state.okrs.staffOkrs as any[];
    this.itemsAlignOkrs = items;
  }

  private rules: Maps<Rule[]> = {
    objectiveId: [{ type: 'number', required: true, message: 'Vui lòng chọn OKRs để liên kết', trigger: 'blur' }],
  };

  private staffOkrsFormat(item) {
    return `[${item.user.email}] ${item.title}`;
  }
}
</script>
<style lang="scss" scoped></style>
