<template>
  <el-dialog
    :title="`${!!okr ? 'Cập nhật' : 'Tạo mới'} OKRs Công ty`"
    :visible.sync="isShowDialogOKRs"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="company-okrs"
  >
    <el-form
      ref="tempObjective"
      :model="tempOkrs"
      :rules="rules"
      class="create-objective"
      label-position="top"
    >
      <el-form-item
        prop="title"
        class="custom-label"
        label-width="120px"
        label="Mục tiêu"
      >
        <el-input
          v-model="tempOkrs.title"
          type="textarea"
          placeholder="Nhập mục tiêu"
          :autosize="sizeConfig"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="weight"
        label="Độ quan trọng"
        class="custom-label"
        label-width="120px"
      >
        <el-slider
          v-model="tempOkrs.weight"
          :step="1"
          show-stops
          :min="1"
          :max="5"
        ></el-slider>
      </el-form-item>
    </el-form>
    <div class="add-krs-step">
      <key-result
        v-for="(item, index) in tempOkrs.keyResults"
        :key="index"
        :index-kr-form="index"
        :key-result.sync="item"
        @deleteKr="deleteKrForm($event)"
        :is-root-okr="true"
        ref="krsForm"
      />
      <el-button
        class="el-button el-button--white el-button--small add-krs-step__button"
        @click="addNewKRs"
      >
        <span>Thêm key result</span>
      </el-button>
      <div class="add-krs-step__attention">
        <p class="add-krs-step__attention--title">Lưu ý:</p>
        <div
          v-for="(attention, i) in attentionsText"
          :key="attention[i]"
          class="add-krs-step__attention--content"
        >
          <icon-attention />
          <span>{{ attention }}</span>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button
        class="el-button--white el-button--modal"
        @click="handleCloseDialog"
      >
        Hủy
      </el-button>
      <el-button
        class="el-button--purple el-button--modal"
        :loading="isLoading"
        @click="preCheckObjective"
      >
        {{ !!okr ? 'Cập nhật' : 'Tạo mới' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
import { confirmWarningConfig } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
import IconAttention from '@/assets/images/okrs/attention.svg';
import KeyResult from '@/components/OKRs/OkrsManagement/OkrsManagementStepKeyResult/OkrsManagementStepKeyResultItem.vue';
import OkrsRepository from '@/repositories/OkrsRepository';
import { Form } from 'element-ui';
@Component<RootOKRs>({
  name: 'RootOKRs',
  components: {
    IconAttention,
    KeyResult,
  },
})
export default class RootOKRs extends Vue {
  @PropSync('isVisible', Boolean) private isShowDialogOKRs!: boolean;
  @Prop({ type: Object }) private okr!: any;
  @Prop(Function) private reloadData!: Function;
  private isLoading: boolean = false;
  private sizeConfig = { minRows: 2, maxRows: 2 };
  private attentionsText: string[] = [
    'Nên có ít nhất phải có 2 kết quả then chốt',
    'Không nên quá 5 kết quả then chốt cho 1 mục tiêu',
  ];

  private tempOkrs: any = this.okr
    ? { ...this.okr }
    : {
        title: '',
        weight: 3,
        projectId: null,
        keyResults: [],
      };

  private handleCloseDialog() {
    this.$confirm(
      'Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?',
      { ...confirmWarningConfig },
    )
      .then(() => {
        this.isShowDialogOKRs = false;
      })
      .catch((err) => console.log(err));
  }

  private rules: Maps<Rule[]> = {
    title: [
      {
        type: 'string',
        required: true,
        message: 'Vui lòng nhập mục tiêu',
        trigger: ['blur', 'change'],
      },
      max255Char,
    ],
  };

  private addNewKRs() {
    this.tempOkrs.keyResults.push({
      startValue: 0,
      targetedValue: 100,
      content: '',
      keyResultParentId: null,
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
    });
  }

  private deleteKrForm(indexForm: number) {
    this.tempOkrs.keyResults.splice(indexForm, 1);
  }

  private preCheckObjective() {
    (this.$refs.tempObjective as Form).validate(
      async (isValid: boolean, invalidatedFields: object) => {
        if (isValid) {
          await this.preCheckKs(this.tempOkrs);
        }
      },
    );
  }

  private async preCheckKs(OKRsData: any) {
    this.isLoading = true;
    const krs: any[] = [];
    let validForm: number = 0;
    if (OKRsData.keyResults.length === 0) {
      this.$message.error('Cần có ít nhất 1 kết quả then chốt');
    } else {
      (this.$refs.krsForm as any).forEach((form) => {
        (form.$refs.keyResult as Form).validate(
          (isValid: boolean, invalidatedFields: object) => {
            if (isValid) {
              validForm++;
            }
          },
        );
        krs.push(Object.freeze(form.tempKeyResult));
        this.isLoading = false;
      });
      if (validForm === krs.length) {
        await this.pushOkr(OKRsData);
      } else {
        this.$message.error('Có trường chưa hợp lệ, xin hãy kiểm tra!!!');
      }
    }
    this.isLoading = false;
  }

  private async pushOkr(OKRsData: any) {
    this.isLoading = true;
    try {
      console.log(JSON.stringify(OKRsData));
      await OkrsRepository.createOrUpdateOkrs(OKRsData);
      this.clearTempData();
      this.reloadData();
      this.isShowDialogOKRs = false;
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
    }
  }

  private clearTempData() {
    this.tempOkrs = {
      title: '',
      projectId: null,
      keyResults: [],
    };
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.add-krs-step {
  padding: 0 $unit-5;
  &__objective {
    padding-bottom: $unit-3;
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
  &__button {
    margin-bottom: $unit-5;
    width: calc(100% - 28px);
  }
  &__attention {
    font-size: $unit-3;
    color: $neutral-primary-4;
    padding-bottom: $unit-4;
    &--title {
      font-weight: $font-weight-medium;
    }
    &--content {
      display: flex;
      place-content: center flex-start;
      span {
        padding-left: $unit-3;
        &:first-child {
          padding-bottom: $unit-2;
        }
      }
    }
  }
  &__action {
    @include okrs-button-action;
  }
}
</style>
