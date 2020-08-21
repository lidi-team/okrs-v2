<template>
  <el-dialog :title="dialogTitle(itemData, type)" :visible.sync="syncCreateOkrsDialog" width="800px" placement="center" class="detail-history">
    <el-row :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Ngày Check-in</el-col>
      <el-col :span="18" class="detail-history__value">{{ new Date(itemData.createdAt) | dateFormat('DD/MM/YYYY') }}</el-col>
    </el-row>
    <el-row v-if="itemData.objective" :gutter="20">
      <el-col :span="6" class="detail-history__attribute">Mục tiêu</el-col>
      <el-col :span="18" class="detail-history__value">{{ itemData.objective.title }}</el-col>
    </el-row>
    <div v-if="type !== all">
      <el-row :gutter="20">
        <el-col :span="6" class="detail-history__attribute">Người {{ itemData.type }}</el-col>
        <el-col :span="18" class="detail-history__value">{{ itemData.sender }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="detail-history__attribute">Tiêu chí</el-col>
        <el-col :span="18" class="detail-history__value">{{ itemData.criteria }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="detail-history__attribute">Nội dung Feedback</el-col>
        <el-col :span="18" class="detail-history__value">
          {{ itemData.content }}
        </el-col>
      </el-row>
    </div>
    <div v-else></div>
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
  @Prop(Object) itemData!: any;
  @Prop(String) type!: String;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;
  private content: String = '';
  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private closeObjectiveForm(): void {
    this.syncCreateOkrsDialog = false;
  }

  private dialogTitle(itemData: any, type: string): String {
    if (type === 'sent') {
      return `${this.upFirst(itemData.type)} đến ${itemData.receiver.fullName}`;
    } else if (type === 'all') {
      return `${this.upFirst(itemData.type)} từ ${itemData.sender.fullName} đến ${itemData.receiver.fullName}`;
    } else {
      return `${this.upFirst(itemData.type)} bởi ${itemData.sender.fullName}`;
    }
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
