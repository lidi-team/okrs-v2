<template>
  <el-dialog
    :title="`${tempOKRs.title ? 'Cập nhật' : 'Tạo mới'} OKRs Công ty`"
    :visible.sync="isShowDialogOKRs"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="company-okrs"
  >
    <el-form
      ref="tempObjective"
      :model="tempOKRs"
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
          v-model="tempOKRs.title"
          type="textarea"
          placeholder="Nhập mục tiêu"
          :autosize="sizeConfig"
        ></el-input>
      </el-form-item>
      <div class="add-krs-step">
        <key-result
          v-for="(item, index) in tempOKRs.keyResults"
          :key="index"
          :index-kr-form="index"
          :key-result.sync="item"
          @deleteKr="deleteKrForm($event)"
          :is-root-okr="true"
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
    </el-form>
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
        @click="handleCloseDialog"
      >
        {{ tempOKRs.title ? 'Cập nhật' : 'Tạo mới' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { confirmWarningConfig } from '@/constants/app.constant';
import { DispatchAction } from '@/constants/app.vuex';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
import IconAttention from '@/assets/images/okrs/attention.svg';
import KeyResult from '@/components/okrs/add-update/KeyResult.vue';
@Component<RootOKRs>({
  name: 'RootOKRs',
  components: {
    IconAttention,
    KeyResult,
  },
})
export default class RootOKRs extends Vue {
  @PropSync('isVisible', Boolean) private isShowDialogOKRs!: boolean;
  private isLoading: boolean = false;
  private active: Number = 0;
  private sizeConfig = { minRows: 2, maxRows: 2 };
  private attentionsText: string[] = [
    'Nên có ít nhất phải có 2 kết quả then chốt',
    'Không nên quá 5 kết quả then chốt cho 1 mục tiêu',
  ];

  private tempOKRs: any = {
    title: '',
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
    this.tempOKRs.keyResults.push({
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
    this.tempOKRs.keyResults.splice(indexForm, 1);
  }
}
</script>

<style scoped></style>
