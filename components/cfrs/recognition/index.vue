<template>
  <el-dialog
    title="Tạo ghi nhận"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    class="create-recognition-dialog"
  >
    <el-form
      ref="recognition"
      v-loading="loadingForm"
      :model="recognition"
      label-width="180px"
      :rules="rules"
      label-position="left"
      class="create-recognition-dialog__form"
    >
      <el-form-item
        prop="receiverId"
        label="Người được ghi nhận"
        class="custom-label user"
      >
        <el-select
          v-model="recognition.receiverId"
          filterable
          placeholder="Chọn người đươc ghi nhận"
          @change="handleSelectUser()"
        >
          <el-option
            v-for="user in optionsMetadata.users"
            :key="user.id"
            :label="user.fullName"
            :value="user.id"
          >
            <div style="display: flex">
              <el-avatar :size="25" style="align-self: center">
                <img
                  :src="user.avatarUrl ? user.avatarUrl : user.gravatarURL"
                  alt="avatar"
                />
              </el-avatar>
              <span style="margin-left: 0.5rem">{{ user.fullName }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mục tiêu" class="objective">
        <el-select
          v-model="recognition.objectiveId"
          filterable
          placeholder="Chọn mục tiêu"
          :disabled="!recognition.receiverId"
        >
          <el-option
            v-for="okrs in optionsMetadata.objectives"
            :key="okrs.id"
            :label="okrs.name"
            :value="okrs.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="evaluationCriteriaId"
        label="Tiêu chí"
        class="custom-label criteria"
      >
        <el-select
          v-model="recognition.evaluationCriteriaId"
          placeholder="Lựa chọn tiêu chí đánh giá"
        >
          <el-option
            v-for="criteria in optionsMetadata.criteria"
            :key="criteria.id"
            :label="criteria.name"
            :value="criteria.id"
          >
            <div class="item-criteria">
              <div class="item-criteria__icon">
                <span>{{ criteria.numberOfStar }}</span>
                <icon-star-dashboard class="item-criteria__icon--star" />
              </div>
              <span class="item-criteria__content">{{ criteria.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="content" label="Nội dung" class="custom-label">
        <el-input
          v-model="recognition.content"
          type="textarea"
          placeholder="Nhập nội dung feedback"
          :autosize="autoSizeConfig"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="create-recognition-dialog__action">
      <el-button
        class="el-button--white el-button--modal"
        @click="handleCloseDialog"
        >Hủy
      </el-button>
      <el-button
        class="el-button--purple el-button--modal"
        :loading="loading"
        @click="createRecognition"
        >Tạo ghi nhận
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';
import { confirmWarningConfig } from '@/constants/app.constant';
import EvaluationCriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
import CfrsRepository from '@/repositories/CfrsRepository';
import UserRepository from '@/repositories/UserRepository';
import { EvaluationCriteriaEnum } from '@/constants/app.enum';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
import { CfrsDTO } from '@/constants/app.interface';
import { mapGetters } from 'vuex';
import { GetterState } from '@/constants/app.vuex';

@Component<CreateRecongnitionDialog>({
  name: 'CreateRecongnitionDialog',
  async created() {
    await this.getMetaDataRecognition(this.user);
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  components: {
    IconStarDashboard,
  },
  mounted() {
    this.loadingForm = true;
    setTimeout(() => {
      this.loadingForm = false;
    }, 300);
  },
  async beforeDestroy() {
    this.clearForm();
    if (this.isCreating) {
      await this.reloadHistoryCfrs();
    }
  },
})
export default class CreateRecongnitionDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false })
  public syncCreateOkrsDialog!: boolean;
  private optionsMetadata: any = {
    criteria: [],
    users: [],
    objectives: [],
  };

  private recognition: CfrsDTO = {
    receiverId: null,
    content: '',
    evaluationCriteriaId: null,
    objectiveId: null,
    checkinId: null,
  };

  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private loading: Boolean = false;
  private loadingForm: Boolean = false;
  private isCreating: Boolean = false;

  public rules: Maps<Rule[]> = {
    content: [
      {
        type: 'string',
        required: true,
        message: 'Vui lòng nhập nội dung phản hồi',
        trigger: 'blur',
      },
      {
        type: 'string',
        min: 50,
        message: 'Nội dung ghi nhận ít nhất phải chứa 50 ký tự',
        trigger: 'blur',
      },
      max255Char,
    ],
    evaluationCriteriaId: [
      {
        required: true,
        message: 'Vui lòng chọn tiêu chí đánh giá',
        trigger: 'blur',
      },
    ],
    receiverId: [
      {
        required: true,
        message: 'Vui lòng chọn người được ghi nhận',
        trigger: 'blur',
      },
    ],
  };

  private handleCloseDialog() {
    this.$confirm(
      'Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?',
      { ...confirmWarningConfig },
    ).then(() => {
      this.syncCreateOkrsDialog = false;
    });
  }

  private async getMetaDataRecognition(user: any) {
    try {
      const [evaluationCriteria, allUsers] = await Promise.all([
        EvaluationCriteriaRepository.getCombobox(
          EvaluationCriteriaEnum.RECOGNITION,
        ),
        UserRepository.getAllUsers(),
      ]);
      this.optionsMetadata.criteria = Object.freeze(evaluationCriteria.data);
      const usersData = allUsers.data
        ? allUsers.data.filter((value) => value.id !== user.id)
        : [];
      this.optionsMetadata.users = Object.freeze(usersData);
    } catch (error) {
      console.log(error);
    }
  }

  private async handleSelectUser() {
    this.loadingForm = true;
    try {
      const { data } = await CfrsRepository.getUserObjectives(
        Number(this.recognition.receiverId),
      );
      this.optionsMetadata.objectives = data;
      setTimeout(() => {
        this.loadingForm = false;
      }, 500);
    } catch (error) {
      this.loadingForm = false;
    }
  }

  private createRecognition() {
    this.loading = true;
    (this.$refs.recognition as Form).validate(
      async (isValid: boolean, invalidatedFields: object) => {
        if (isValid) {
          try {
            const data: any = await CfrsRepository.postRecognition(
              this.recognition,
            );

            this.isCreating = true;
            this.syncCreateOkrsDialog = false;
            setTimeout(() => {
              this.loading = false;
            }, 300);
          } catch (error) {
            this.loading = false;
          }
        }
        if (invalidatedFields) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      },
    );
  }

  private reloadHistoryCfrs() {
    if (this.$route.query.tab === 'history') {
      // @ts-ignore
      const historyComponent: any = this.$parent.$children[1].$children[4];
      const cycleId = this.$store.state.cycle.cycleTemp
        ? this.$store.state.cycle.cycleTemp
        : this.$store.state.cycle.cycle.id;
      historyComponent.loadingTab = true;
      historyComponent.changeListDataOnCycle(cycleId);
      setTimeout(() => {
        historyComponent.loadingTab = false;
      }, 500);
    }
  }

  private clearForm(): void {
    this.recognition.receiverId = null;
    this.recognition.content = '';
    this.recognition.evaluationCriteriaId = null;
    this.recognition.objectiveId = null;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';

.item-criteria {
  display: flex;
  place-content: center flex-start;
  align-items: center;

  &__icon {
    display: flex;
    margin-right: $unit-4;
    width: $unit-10;

    &--star {
      align-self: center;
    }
  }
}

.create-recognition-dialog {
  padding: $unit-4;

  &__form {
    margin-top: $unit-4;
  }

  &__attribute {
    font-weight: bold;
    padding: $unit-3 0;
  }

  &__value {
    padding: $unit-3 0;
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .el-form-item {
    &__label {
      font-weight: $font-weight-medium;
      margin-top: -$unit-3;
    }
  }

  .el-form {
    .user {
      .el-select {
        width: 250px;
      }

      &__info {
        display: flex;
      }
    }

    .objective {
      .el-select {
        width: 100%;
      }
    }

    .criteria {
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
