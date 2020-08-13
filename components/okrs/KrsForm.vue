<template>
  <fragment>
    <div class="control-collapse">
      <div class="control-collapse__expand">
        <span :class="['control-collapse__expand--caret', 'el-icon-caret-right', isExpanded ? 'expanded' : '']" @click="expandForm" />
        <span class="control-collapse__expand--content">{{ keyResult.content }}</span>
      </div>
      <icon-delete class="control-collapse__delete" />
    </div>
    <div class="content">
      <el-form ref="keyResult" :model="keyResult" :rules="rules" label-position="left" class="krs-form">
        <el-form-item prop="content">
          <el-input v-model="keyResult.content" placeholder="Nhập kết quả then chốt" tabindex="1" />
        </el-form-item>
        <div class="krs-form__detail">
          <div class="krs-form__detail--value">
            <el-row>
              <el-col :span="7">
                <el-form-item prop="unit" label="Đơn vị" class="custom-label" label-width="65px">
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
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import IconDelete from '@/assets/images/common/delete.svg';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';

@Component<KrsForm>({
  name: 'KrsForm',
  components: {
    IconDelete,
  },
  created() {
    this.units = Object.freeze(this.$store.state.measureUnit.measureUnits);
  },
})
export default class KrsForm extends Vue {
  @Prop({ type: Object, required: true })
  private temporaryKeyResult!: any;

  private isExpanded: boolean = false;
  private keyResult: any = this.temporaryKeyResult;

  private units: any[] = [];

  private rules: Maps<Rule[]> = {
    content: [
      { type: 'string', required: true, message: 'Vui lòng nhập kết quả then chốt', trigger: 'blur' },
      { validator: this.validateContentKrs, trigger: 'change' },
    ],
    unit: [{ type: 'string', required: true, message: 'Vui lòng chọn đơn vị tính', trigger: 'blur' }],
    startValue: [{ validator: this.validateIsValidNumber, trigger: 'blur' }],
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
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.control-collapse {
  display: flex;
  place-content: center flex-start;
  &__expand {
    display: flex;
    &--caret {
      display: flex;
      align-self: center;
      margin-right: $unit-2;
      color: $neutral-primary-2;
      transition: transform 0.3s ease-in-out;
      &:hover {
        cursor: pointer;
      }
    }
    &--content {
      color: $neutral-primary-4;
      font-weight: $font-weight-medium;
      padding-right: $unit-5;
    }
  }
  &__delete {
  }
  .expanded {
    transform: rotate(90deg);
  }
}

.krs-form {
  &__detail {
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
</style>
