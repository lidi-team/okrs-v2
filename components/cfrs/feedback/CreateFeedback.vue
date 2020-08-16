<template>
  <el-dialog
    title="Tạo Feedback"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="create-feedback-dialog"
  >
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Chu kỳ</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">{{ dataFeedback.objective.cycle.name }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Ngày check-in</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">{{ new Date(dataFeedback.checkinAt) | dateFormat('DD/MM/YYYY') }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Người được feedback</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">{{ dataFeedback.objective.user.fullName }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Mục tiêu</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">{{ dataFeedback.objective.title }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Tiêu chí</el-col>
      <el-col :span="18" class="create-feedback-dialog__value"
        ><el-select v-model="criteriaId" placeholder="Lựa chọn tiêu chí đánh giá">
          <el-option v-for="item in optionCriteria" :key="item.id" :label="item.content" :value="item.id"> </el-option> </el-select
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Nội dung </el-col>
      <el-col :span="18"
        ><el-input v-model="content" type="textarea" placeholder="Nhập nội dung feedback" :autosize="autoSizeConfig"></el-input
      ></el-col>
    </el-row>
    <div class="create-feedback-dialog__action">
      <el-button class="el-button--white el-button--modal" @click="syncCreateOkrsDialog = false">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createFeedback">Hoàn thành</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';
import { CfrsRepository } from '@/repositories/CfrsRepository';
import { confirmWarningConfig } from '@/constants/app.constant';
import EvaluationCriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
@Component<CreateFeedbackDialog>({
  name: 'CreateFeedbackDialog',
  async mounted() {
    const {
      data: { data },
    } = await EvaluationCriteriaRepository.getCombobox();
    this.optionCriteria = data;
  },
})
export default class CreateFeedbackDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop()
  dataFeedback!: any;

  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;
  private content: String = '';
  private optionCriteria: Object = [];
  private criteriaId: String | Number = '';
  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private loading: Boolean = false;
  private handleCloseDialog() {
    this.$confirm('Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?', { ...confirmWarningConfig }).then(() => {
      this.syncCreateOkrsDialog = false;
    });
  }

  private async createFeedback() {
    this.loading = true;
    const data = {
      receiverId: this.dataFeedback.objective.user.id,
      evaluationCriteriaId: this.criteriaId,
      checkinId: this.dataFeedback.id,
      content: this.content,
    };
    const response = await CfrsRepository.post(data);
    this.loading = false;
    this.$router.push('?tab=history');
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.create-feedback-dialog {
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
