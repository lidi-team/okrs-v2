<template>
  <el-dialog
    :title="`${upFirst(dataDetail.type)} của ${dataDetail.receiver}`"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    class="detail-history"
  >
    <el-row :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Ngày Check-in</el-col>
      <el-col :span="18" class="detail-history__value">{{ new Date(dataDetail.createdAt) | dateFormat('DD/MM/YYYY') }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Mục tiêu</el-col>
      <el-col :span="18" class="detail-history__value">{{ dataDetail.objective }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Người {{ dataDetail.type }}</el-col>
      <el-col :span="18" class="detail-history__value">{{ dataDetail.sender }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Tiêu chí</el-col>
      <el-col :span="18" class="detail-history__value">{{ dataDetail.criteria }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Nội dung Feedback</el-col>
      <el-col :span="18" class="detail-history__value">
        {{ dataDetail.content }}
      </el-col>
    </el-row>
    <div class="create-feedback-dialog__action">
      <el-button class="el-button--white el-button--modal" @click="closeObjectiveForm">Hủy</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';
import { confirmWarningConfig } from '@/constants/app.constant';
@Component<DetailHistory>({
  name: 'DetailHistory',
})
export default class DetailHistory extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop() dataDetail!: Object;

  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;
  private content: String = '';
  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private closeObjectiveForm(): void {
    this.syncCreateOkrsDialog = false;
  }

  private upFirst(data: String): String {
    return data ? data.charAt(0).toUpperCase() + data.slice(1) : 'Feedback';
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.detail-history {
  padding: $unit-4;
  &__attribute {
    font-weight: bold;
    padding: $unit-3 0;
  }
  &__value {
    padding: $unit-3 0;
  }
  &__action {
    margin-top: $unit-4;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
