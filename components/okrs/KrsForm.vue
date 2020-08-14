<template>
  <div :id="indexKrForm">
    <div :class="['control-collapse', hovering ? 'hovering' : '']" @mouseenter="hovering = true" @mouseleave="hovering = false">
      <div class="control-collapse__expand" @click="expandForm">
        <span :class="['control-collapse__expand--caret', 'el-icon-caret-right', isExpanded ? 'expanded' : '']" />
        <span v-if="keyResult.content !== 'Xin vui lòng nhập kết quả then chốt'" class="control-collapse__expand--content">
          {{ keyResult.content }}
        </span>
        <span v-else class="control-collapse__expand--content example">{{ keyResult.content }}</span>
      </div>
      <el-popover v-model="popoverVisisble" placement="top-start" width="200" trigger="click">
        <div class="control-collapse__popover">
          <p class="control-collapse__popover--title">Bạn muốn xóa KR này?</p>
          <div class="control-collapse__popover--action">
            <el-button class="el-button--white el-button--small" @click="popoverVisisble = false">Không</el-button>
            <el-button class="el-button--purple el-button--small" @click="deleteKr(keyResult)">Xóa bỏ</el-button>
          </div>
        </div>
        <el-tooltip slot="reference" content="Xóa" placement="right-start">
          <icon-delete class="control-collapse__delete" />
        </el-tooltip>
      </el-popover>
    </div>
    <div :class="['content-collapse', isExpanded ? 'margin-form' : '']" :style="isExpanded ? `max-height: ${scrollHeight}px` : 'max-height: 0'">
      <el-form ref="keyResult" :model="keyResult" :rules="rules" label-position="left" class="krs-form">
        <el-form-item prop="content">
          <el-input v-model="keyResult.content" placeholder="Nhập kết quả then chốt" tabindex="1" />
        </el-form-item>
        <div class="krs-form__detail">
          <div class="krs-form__detail--value">
            <el-row>
              <el-col :span="7">
                <el-form-item label="Đơn vị" class="custom-label" label-width="65px">
                  <el-select
                    v-model.number="keyResult.measureUnitId"
                    size="medium"
                    filterable
                    no-match-text="Không tìm thấy kết quả"
                    placeholder="Chọn đơn vị"
                  >
                    <el-option v-for="unit in units" :key="unit.id" :label="unit.type" :value="unit.id" tabindex="3" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="startValue" label="Giá trị bắt đầu" label-width="100px">
                  <el-input v-model.number="keyResult.startValue" size="medium" tabindex="2" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="targetValue" label="Mục tiêu" class="custom-label" label-width="80px">
                  <el-input v-model.number="keyResult.targetValue" size="medium" tabindex="2" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="krs-form__detail--links">
            <el-form-item prop="linkPlans" label="Link kế hoạch" label-width="120px">
              <el-input v-model.number="keyResult.linkPlans" size="small" type="url" placeholder="Điền link kế hoạch " />
            </el-form-item>
            <el-form-item prop="linkResults" label="Link kết quả" label-width="120px">
              <el-input v-model.number="keyResult.linkResults" size="small" type="url" placeholder="Điền link kết quả" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import IconDelete from '@/assets/images/common/delete.svg';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';
import OkrsRepository from '@/repositories/OkrsRepository';
import { notificationConfig } from '@/constants/app.constant';

@Component<KrsForm>({
  name: 'KrsForm',
  components: {
    IconDelete,
  },
  created() {
    this.units = Object.freeze(this.$store.state.measureUnit.measureUnits);
  },
  beforeMount() {
    this.keyResult = this.temporaryKeyResult;
  },
})
export default class KrsForm extends Vue {
  @Prop({
    type: Object,
    required: true,
    default: () => ({
      startValue: 0,
      targetValue: 100,
      content: 'Xin vui lòng nhập kết quả then chốt',
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
    }),
  })
  private temporaryKeyResult!: any;

  @Prop(Number) private indexKrForm!: number;

  private hovering: boolean = false;
  private popoverVisisble: boolean = false;
  private isExpanded: boolean = false;
  private keyResult: any = {};
  private scrollHeight: number = 0;

  private units: any[] = [];

  private async deleteKr(keyResult: any): Promise<any> {
    if (keyResult.id) {
      try {
        await OkrsRepository.deleteKr(keyResult.id).then((res) => {
          if (res.data.statusCode === 404) {
            Notification.success({
              ...notificationConfig,
              message: res.data.message,
            });
            this.popoverVisisble = false;
          }
          if (res.data.statusCode === 480) {
            Notification.success({
              ...notificationConfig,
              message: res.data.message,
            });
            this.popoverVisisble = false;
          }
          if (res.data.statusCode === 200) {
            Notification.success({
              ...notificationConfig,
              message: 'Xóa KR thành công',
            });
            this.popoverVisisble = false;
          }
          this.$emit('deleteKr', this.indexKrForm);
        });
      } catch (error) {}
    } else {
      this.popoverVisisble = false;
      this.$emit('deleteKr', this.indexKrForm);
    }
  }

  private rules: Maps<Rule[]> = {
    content: [
      { type: 'string', required: true, message: 'Vui lòng nhập kết quả then chốt', trigger: 'blur' },
      { validator: this.validateContentKrs, trigger: 'blur' },
    ],
    // unit: [{ type: 'number', required: true, message: 'Vui lòng chọn đơn vị tính', trigger: 'change' }],
    startValue: [
      { validator: this.validateIsValidNumber, trigger: 'blur' },
      { validator: this.validateStartValue, trigger: 'blur' },
    ],
    targetValue: [
      { validator: this.validateIsValidNumber, trigger: 'blur' },
      { validator: this.validateTargetValue, trigger: 'blur' },
    ],
    linkPlans: [{ type: 'url', message: 'Vui lòng nhập đúng định dạng đường link', trigger: 'blur' }],
    linkResults: [{ type: 'url', message: 'Vui lòng nhập đúng định dạng đường link', trigger: 'blur' }],
  };

  private validateIsValidNumber(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (isNaN(value)) {
      return callback('Giá trị phải là số');
    }
    if (value < 0) {
      return callback('Giá trị phải lớn hơn 0');
    }
    return callback();
  }

  private validateStartValue(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value > this.keyResult.targetValue) {
      return callback('Giá trị bắt đầu đang lớn hơn giá trị mục tiêu');
    }
    return callback();
  }

  private validateTargetValue(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value === 0) {
      return callback('Giá trị mục tiêu phải lớn hơn 0');
    }
    if (value < this.keyResult.startValue) {
      return callback('Giá trị mục tiêu phải lớn hơn bắt đầu');
    }
    return callback();
  }

  private validateContentKrs(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (!/\d/.test(value)) {
      return callback('Kết quả then chốt phải chứa số');
    }
    return callback();
  }

  public clearForm() {
    (this.$refs.keyResult as Form).clearValidate();
    this.keyResult.content = '';
    this.keyResult.targetvalue = 1;
    this.keyResult.linkPlans = '';
    this.keyResult.linkResults = '';
    this.keyResult.measureUnitId = 1;
  }

  private expandForm() {
    this.isExpanded = !this.isExpanded;
    const contents = document.getElementsByClassName('content-collapse');
    // @ts-ignore
    this.scrollHeight = contents.item(0).scrollHeight;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.hovering {
  background-color: $purple-primary-1;
}
.margin-form {
  margin-bottom: $unit-4;
}
.control-collapse {
  display: flex;
  place-content: center space-between;
  &:hover {
    box-shadow: $box-shadow-default;
  }
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
      color: $neutral-primary-4;
      font-weight: $font-weight-medium;
      padding-right: $unit-5;
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
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  background-color: #f1f1f1;
  margin-top: $unit-3;
  &:not(:last-child) {
    margin-bottom: $unit-2;
  }
  border-radius: $border-radius-base;
  background-color: $purple-primary-1;
  .krs-form {
    padding: $unit-4;
    &__detail {
      margin-bottom: -$unit-6;
      &--value {
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
