<template>
  <el-dialog
    title="Tạo Feedback"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="create-feedback-dialog"
  >
    <el-form ref="contentFeedback" :model="contentFeedback" :rules="rules" label-position="left">
      <el-form-item label-width="200px" label="Ngày checkin">
        <p>{{ new Date(dataFeedback.checkinAt) | dateFormat('DD/MM/YYYY') }}</p>
      </el-form-item>
      <el-form-item label-width="200px" label="Người được feedback">
        <p>{{ dataFeedback.objective.user.fullName }}</p>
      </el-form-item>
      <el-form-item label-width="200px" label="Mục tiêu">
        <p>{{ dataFeedback.objective.title }}</p>
      </el-form-item>
      <el-form-item label-width="200px" prop="evaluationCriteriaId" label="Tiêu chí" class="custom-label">
        <el-select v-model="contentFeedback.evaluationCriteriaId" placeholder="Lựa chọn tiêu chí đánh giá">
          <el-option v-for="item in listEvaluationCriterias" :key="item.id" :label="item.content" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="200px" prop="content" label="Nội dung" class="custom-label">
        <el-input v-model="contentFeedback.content" type="textarea" placeholder="Nhập nội dung feedback" :autosize="autoSizeConfig"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="create-feedback-dialog__action">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createFeedback">Tạo Feedback</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { CfrsRepository } from '@/repositories/CfrsRepository';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import EvaluationCriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
import { FeedbackDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
@Component<CreateFeedbackDialog>({
  name: 'CreateFeedbackDialog',
  async mounted() {
    await this.getListEvaluationCriterias();
  },
  destroyed() {
    this.reloadData();
  },
})
export default class CreateFeedbackDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop(Object) dataFeedback!: any;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;

  private listEvaluationCriterias: any[] = [];
  private contentFeedback: FeedbackDTO = {
    content: '',
    evaluationCriteriaId: null,
  };

  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private loading: Boolean = false;
  private handleCloseDialog() {
    this.$confirm('Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?', { ...confirmWarningConfig }).then(() => {
      this.syncCreateOkrsDialog = false;
    });
  }

  private createFeedback() {
    this.loading = true;

    (this.$refs.contentFeedback as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        console.log(this.dataFeedback);
        const payload: FeedbackDTO = {
          // Nếu là cấp trên -> Lấy Id của cấp dưới, ngược lại
          receiverId: this.dataFeedback.isSuperior ? this.dataFeedback.user.id : this.dataFeedback.objective.user.id,
          checkinId: this.dataFeedback.id,
          ...this.contentFeedback,
        };
        try {
          await CfrsRepository.postFeedback(payload, this.dataFeedback.type).then(() => {
            this.$notify.success({ ...notificationConfig, message: 'Tạo phản hồi thành công' });
            this.loading = false;
            this.syncCreateOkrsDialog = false;
          });
        } catch (error) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private async getListEvaluationCriterias() {
    try {
      await EvaluationCriteriaRepository.getCombobox(this.dataFeedback.type).then((res) => {
        this.listEvaluationCriterias = Object.freeze(res.data.data);
      });
    } catch (error) {}
  }

  public rules: Maps<Rule[]> = {
    content: [
      { required: true, message: 'Vui lòng nhập nội dung phản hồi', trigger: 'blur' },
      { max: 255, message: 'Vui lòng chỉ nhập không quá 255 ký tự', trigger: 'blur' },
    ],
    evaluationCriteriaId: [{ required: true, message: 'Vui lòng chọn tiêu chí đánh giá', trigger: 'blur' }],
  };
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
  .el-dialog__body {
    padding: $unit-4 $unit-6 0 $unit-6;
    .custom-label {
      label {
        margin-top: -$unit-3;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      &__label {
        font-weight: $font-weight-medium;
      }
      &:nth-child(3) {
        padding-bottom: $unit-3;
      }
      &:nth-child(4) {
        padding-bottom: $unit-7;
      }
      &:nth-child(5) {
        padding-bottom: $unit-8;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
