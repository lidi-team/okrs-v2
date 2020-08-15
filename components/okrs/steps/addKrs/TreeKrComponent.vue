<template>
  <div :class="['control-collapse', hovering ? 'hovering' : '']" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <el-form ref="tempKeyResult" :model="tempKeyResult" :rules="rules" label-position="left">
      <el-form-item prop="content">
        <el-input v-model="tempKeyResult.content" placeholder="Nhập kết quả then chốt" tabindex="1" />
      </el-form-item>
      <div class="tree-krs__detail">
        <div class="tree-krs__detail--value">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="unit" label="Đơn vị" class="custom-label" label-width="70px">
                <el-select
                  v-model.number="tempKeyResult.measureUnitId"
                  size="medium"
                  filterable
                  no-match-text="Không tìm thấy kết quả"
                  placeholder="Chọn đơn vị"
                >
                  <el-option v-for="unit in units" :key="unit.id" :label="unit.type" :value="unit.id" tabindex="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="startValue" label="Giá trị bắt đầu" label-width="100px">
                <el-input v-model.number="tempKeyResult.startValue" size="medium" tabindex="2" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="targetValue" label="Mục tiêu" class="custom-label" label-width="70px">
                <el-input v-model.number="tempKeyResult.targetValue" size="medium" tabindex="2" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="tree-krs__detail--links">
          <el-form-item prop="linkPlans" label="Link kế hoạch" label-width="100px">
            <el-input v-model.number="tempKeyResult.linkPlans" size="small" type="url" placeholder="Điền link kế hoạch " />
          </el-form-item>
          <el-form-item prop="linkResults" label="Link kết quả" label-width="100px">
            <el-input v-model.number="tempKeyResult.linkResults" size="small" type="url" placeholder="Điền link kết quả" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { KeyResultDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';

const id = 2;
@Component<TreeKrComponent>({
  name: 'TreeKrComponent',
  created() {
    this.getListUnit();
  },
})
export default class TreeKrComponent extends Vue {
  private hovering: boolean = false;
  private units: any[] = [];
  private tempKeyResult: KeyResultDTO = {
    content: 'Vui lòng nhập kết quả then chốt',
    startValue: 0,
    targetvalue: 100,
    measureUnitId: 1,
    linkPlans: '',
    linkResults: '',
  };

  private async getListUnit() {
    try {
      const { data } = await MeasureUnitRepository.get({ page: 1, limit: 20 });
      Object.freeze(data.data.items).forEach((item) => {
        this.units.push(item);
      });
    } catch (error) {}
  }

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
    return callback();
  }

  private validateContentKrs(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (!/\d/.test(value)) {
      return callback('Kết quả then chốt phải chứa số');
    }
    return callback();
  }

  public clearObjectiveForm() {
    (this.$refs.tempKeyResult as Form).clearValidate();
    this.tempKeyResult.content = '';
    this.tempKeyResult.targetvalue = 1;
    this.tempKeyResult.linkPlans = '';
    this.tempKeyResult.linkResults = '';
    this.tempKeyResult.measureUnitId = 1;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.tree-krs {
  margin-top: $unit-8;
  width: 100%;
  form {
    padding-right: $unit-8;
  }
  &__detail {
    display: flex;
    flex-direction: column;
    &--value {
      display: flex;
      flex-direction: row;
      place-content: center space-between;
      .el-row {
        width: 100%;
        .el-col {
          &:nth-child(3) {
            display: flex;
            place-content: center flex-start;
            .el-form-item {
              width: 100%;
            }
          }
        }
        .el-form-item {
          &:first-child {
            width: 200px;
          }
        }
      }
    }
    &--links {
      display: flex;
      flex-direction: column;
      place-content: center flex-start;
      width: 100%;
    }
  }
}
</style>
