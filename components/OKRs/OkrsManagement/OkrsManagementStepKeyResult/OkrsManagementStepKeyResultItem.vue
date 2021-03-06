<template>
  <div :id="indexKrForm">
    <div
      :class="['control-collapse', hovering ? 'hovering' : '']"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <div class="control-collapse__expand" @click="expandForm">
        <span
          :class="[
            'control-collapse__expand--caret',
            'el-icon-caret-right',
            isExpanded ? 'expanded' : '',
          ]"
        />
        <span
          v-if="tempKeyResult.content.length !== 0"
          class="control-collapse__expand--content"
          >{{ tempKeyResult.content }}</span
        >
        <span
          v-if="tempKeyResult.content.length === 0"
          class="control-collapse__expand--content example"
          >Ấn vào đây để chỉnh sửa</span
        >
      </div>
      <el-popover
        v-model="popoverVisisble"
        placement="top-start"
        width="200"
        trigger="click"
      >
        <div class="control-collapse__popover">
          <p class="control-collapse__popover--title">Bạn muốn xóa KR này?</p>
          <div class="control-collapse__popover--action">
            <el-button
              class="el-button--white el-button--small"
              @click="popoverVisisble = false"
              >Hủy</el-button
            >
            <el-button
              class="el-button--purple el-button--small"
              @click="deleteKr(keyResult)"
              >Xóa bỏ</el-button
            >
          </div>
        </div>
        <el-tooltip slot="reference" content="Xóa" placement="right-start">
          <icon-delete class="control-collapse__delete" />
        </el-tooltip>
      </el-popover>
    </div>
    <transition name="fade">
      <div class="content-collapse" v-show="isExpanded">
        <el-form
          ref="keyResult"
          :model="tempKeyResult"
          :rules="rules"
          label-position="left"
          class="krs-form"
        >
          <el-form-item prop="content">
            <el-input
              v-model="tempKeyResult.content"
              placeholder="Nhập kết quả then chốt"
              tabindex="1"
            />
          </el-form-item>
          <div class="krs-form__detail">
            <div class="krs-form__detail--value">
              <div class="-display-flex">
                <el-form-item label="Đơn vị" class="" label-width="65px">
                  <el-select
                    v-model.number="tempKeyResult.measureUnitId"
                    size="medium"
                    filterable
                    no-match-text="Không tìm thấy kết quả"
                    placeholder="Chọn đơn vị"
                  >
                    <el-option
                      v-for="unit in units"
                      :key="unit.id"
                      :label="unit.name"
                      :value="unit.id"
                      tabindex="2"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  class="-ml-5"
                  prop="startValue"
                  label="Bắt đầu"
                  label-width="70px"
                >
                  <el-input-number
                    class="el-input-number-okr"
                    v-model="tempKeyResult.startValue"
                    controls-position="right"
                    size="medium"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item
                  prop="targetValue"
                  label="Mục tiêu"
                  class="-ml-5"
                  label-width="70px"
                >
                  <el-input-number
                    class="el-input-number-okr"
                    v-model.number="tempKeyResult.targetedValue"
                    controls-position="right"
                    size="medium"
                    :min="1"
                  />
                </el-form-item>
              </div>
            </div>
            <div v-if="!isRootOkr">
              <el-form-item
                v-if="isCreate"
                prop="keyResultParentId"
                label="Liên kết kết quả then chốt "
                class=""
                label-width="190px"
              >
                <el-select
                  v-model="tempKeyResult.keyResultParentId"
                  filterable
                  no-match-text="Không tìm thấy kết quả"
                  placeholder="Chọn kết quả then chốt "
                  :loading="loading"
                  width="100%"
                >
                  <el-option
                    v-for="keyResult in keyResultsParent"
                    :key="keyResult.id"
                    :label="keyResult.name"
                    :value="keyResult.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="krs-form__detail--links">
              <el-form-item
                prop="linkPlans"
                label="Link kế hoạch"
                label-width="120px"
              >
                <el-input
                  v-model.number="tempKeyResult.linkPlans"
                  size="small"
                  type="url"
                  placeholder="Điền link kế hoạch "
                />
              </el-form-item>
              <el-form-item
                prop="linkResults"
                label="Link kết quả"
                label-width="120px"
              >
                <el-input
                  v-model.number="tempKeyResult.linkResults"
                  size="small"
                  type="url"
                  placeholder="Điền link kết quả"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { max255Char } from '@/constants/account.constant';
import { Maps, Rule } from '@/constants/app.type';
import IconDelete from '@/assets/images/common/delete.svg';
import { DispatchAction, GetterState } from '@/constants/app.vuex';
import KeyResultRepository from '@/repositories/KeyResultRepository';

@Component<KeyResult>({
  name: 'KeyResult',
  components: {
    IconDelete,
  },
  computed: {
    ...mapGetters({
      isCreate: GetterState.OKRS_IS_CREATE,
    }),
  },
  async mounted() {
    this.loading = true;
    if (!this.isRootOkr) {
      const { data } = await KeyResultRepository.getKeyResult(
        this.$store.state.okrs.objective.parentId,
      );
      this.keyResultsParent = data;
    }
    this.units = await this.$store.dispatch(DispatchAction.GET_MEASURE);
    this.loading = false;
  },
})
export default class KeyResult extends Vue {
  @PropSync('keyResult', {
    type: Object,
    required: true,
    default: () => ({
      content: '',
      keyResultParentId: null,
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
      startValue: 0,
      targetedValue: 100,
    }),
  })
  private tempKeyResult!: any;
  private keyResultsParent: Array<any> = [];

  @Prop(Number) private indexKrForm!: number;
  @Prop(Boolean) private isRootOkr!: boolean;

  private hovering: Boolean = false;
  private popoverVisisble: Boolean = false;
  private isExpanded: Boolean = true;
  private scrollHeight: Number = 0;
  private tempContentKr: String = 'Ấn vào đây để chỉnh sửa';
  private loading: Boolean = false;

  private units: any[] = [];

  private deleteKr(keyResult: any) {
    if (keyResult.id) {
      if (this.indexKrForm === 0) {
        this.popoverVisisble = false;
        this.$message.error('Cần có ít nhất 1 kết quả then chốt đã được tạo');
      }
    } else {
      this.popoverVisisble = false;
      this.$emit('deleteKr', this.indexKrForm);
    }
  }

  private rules: Maps<Rule[]> = {
    content: [
      {
        type: 'string',
        required: true,
        message: 'Vui lòng nhập kết quả then chốt',
        trigger: 'blur',
      },
      { validator: this.validateContentKrs, trigger: 'blur' },
      max255Char,
    ],
    startValue: [
      {
        type: 'number',
        required: true,
        message: 'Vui lòng nhập giá trị',
        trigger: 'blur',
      },
      { validator: this.validateIsValidNumber, trigger: 'blur' },
      { validator: this.validateStartValue, trigger: 'blur' },
    ],
    targetedValue: [
      {
        type: 'number',
        required: true,
        message: 'Vui lòng nhập giá trị',
        trigger: 'blur',
      },
      { validator: this.validateIsValidNumber, trigger: 'blur' },
      { validator: this.validateTargetValue, trigger: 'blur' },
    ],
    linkPlans: [
      {
        type: 'url',
        message: 'Vui lòng nhập đúng định dạng đường link',
        trigger: 'blur',
      },
      max255Char,
    ],
    linkResults: [
      {
        type: 'url',
        message: 'Vui lòng nhập đúng định dạng đường link',
        trigger: 'blur',
      },
      max255Char,
    ],
    keyResultParentId: [
      {
        type: 'number',
        required: true,
        message: 'Vui lòng chọn OKRs cấp trên',
        trigger: 'blur',
      },
    ],
  };

  private validateIsValidNumber(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (isNaN(value)) {
      return callback('Giá trị phải là số');
    }
    return callback();
  }

  private validateStartValue(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (value < 0) {
      return callback('Giá trị phải là số không âm');
    }
    if (value > this.tempKeyResult.targetedValue) {
      return callback('Giá trị bắt đầu phải nhỏ hơn giá trị mục tiêu');
    }
    return callback();
  }

  private validateTargetValue(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (value <= 0) {
      return callback('Giá trị phải lớn hơn 0');
    }
    if (value < this.tempKeyResult.startValue) {
      return callback('Giá trị mục tiêu phải lớn hơn bắt đầu');
    }
    return callback();
  }

  private validateContentKrs(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (!/\d/.test(value)) {
      return callback('Kết quả then chốt phải chứa số');
    }
    return callback();
  }

  private expandForm() {
    this.isExpanded = !this.isExpanded;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.margin-form {
  margin-bottom: $unit-4;
}
.control-collapse {
  display: flex;
  place-content: center space-between;
  &__expand {
    display: flex;
    width: 100%;
    .example {
      color: $neutral-primary-2;
    }
    &:hover {
      cursor: pointer;
    }
    &--caret {
      display: flex;
      align-self: center;
      margin-right: $unit-2;
      color: $neutral-primary-2;
      transition: transform 0.3s ease-in-out;
    }
    &--content {
      word-break: break-word;
      color: $neutral-primary-4;
      font-weight: $font-weight-medium;
      padding-right: $unit-5;
      line-height: 26px;
    }
  }
  &__delete {
    &:hover {
      cursor: pointer;
    }
  }
  .expanded {
    transform: rotate(90deg);
  }
  &__popover {
    padding: $unit-2;
    &--title {
      text-align: center;
      padding: $unit-4;
    }
    &--action {
      display: flex;
      place-content: center;
    }
  }
}
.content-collapse {
  transition: max-height 0.3s ease-out;
  margin-top: $unit-3;
  border: 1px $neutral-primary-1 solid;
  border-radius: 10px;
  border-radius: $border-radius-base;
  margin-bottom: $unit-2;
  .krs-form {
    padding: $unit-4;
    &__detail {
      margin-bottom: -$unit-6;
      &--value {
        &--start {
          label {
            margin-left: -$unit-2;
            width: unset !important;
          }
          .el-form-item__error {
            left: -106px;
            right: -40px;
          }
        }
        .el-col {
          &:not(:first-child) {
            padding-left: $unit-4;
          }
        }
      }
    }
    .el-form-item__label {
      padding: 0;
    }
  }
}
</style>
