<template>
  <el-dialog
    title="Tạo Recongnition"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="create-feedback-dialog"
  >
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Chu kỳ</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">{{ $store.state.cycle.cycle.name }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Người được recognition</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">
        <el-select
          v-model="userRecongnitionId"
          filterable
          remote
          reserve-keyword
          placeholder="Chọn người đươc recongnition"
          @change="handleSelectUser()"
        >
          <el-option v-for="item in optionUserRecongnition" :key="item.id" :label="item.fullName" :value="item.id"> </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" class="create-feedback-dialog__attribute">Mục tiêu</el-col>
      <el-col :span="18" class="create-feedback-dialog__value">
        <el-select v-model="obectiveId" filterable remote reserve-keyword placeholder="Chọn mục tiêu">
          <el-option v-for="item in optionObjective" :key="item.id" :label="item.title" :value="item.id"> </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-row :gutter="20">
        <el-col :span="6" class="create-feedback-dialog__attribute">Tiêu chí</el-col>
        <el-col :span="18" class="create-feedback-dialog__value">
          <el-select v-model="criteriaId" placeholder="Lựa chọn tiêu chí đánh giá">
            <el-option v-for="item in optionCriteria" :key="item.id" :label="item.content" :value="item.id"> </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="create-feedback-dialog__attribute">Nội dung </el-col>
        <el-col :span="18"
          ><el-input v-model="content" type="textarea" placeholder="Nhập nội dung feedback" :autosize="autoSizeConfig"></el-input
        ></el-col>
      </el-row>
      <div class="create-feedback-dialog__action">
        <el-button class="el-button--white el-button--modal" @click="syncCreateOkrsDialog = false">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createRecognition">Hoàn thành</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';
import { confirmWarningConfig } from '@/constants/app.constant';
import EvaluationCriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
import { CfrsRepository } from '@/repositories/CfrsRepository';
@Component<CreateRecongnitionDialog>({
  name: 'CreateRecongnitionDialog',
  async mounted() {
    const dataCriteria = await EvaluationCriteriaRepository.getCombobox();
    this.optionCriteria = dataCriteria.data.data;
    const dataRecognition = await CfrsRepository.getRecognitions();
    this.optionUserRecongnition = dataRecognition.data.data;
  },
})
export default class CreateRecongnitionDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;
  private content: String = '';
  private optionCriteria: Object = [];
  private optionUserRecongnition: Object = [];
  private optionObjective: Object = [];
  private obectiveId: String | Number = '';
  private userRecongnitionId: String | Number = '';
  private criteriaId: String | Number = '';
  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private loading: Boolean = false;
  private handleCloseDialog() {
    this.$confirm('Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?', { ...confirmWarningConfig }).then(() => {
      this.syncCreateOkrsDialog = false;
    });
  }

  private async handleSelectUser() {
    this.obectiveId = '';
    const dataObjective = await CfrsRepository.getObjective(this.userRecongnitionId);
    this.optionObjective = dataObjective.data.data;
  }

  private async createRecognition() {
    this.loading = true;
    await CfrsRepository.posRecognition({
      receiverId: this.userRecongnitionId,
      content: this.content,
      evaluationCriteriaId: this.criteriaId,
      objectiveId: this.obectiveId,
    });
    this.syncCreateOkrsDialog = false;
    this.loading = false;
    this.$router.push('?tab=feedback');
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
