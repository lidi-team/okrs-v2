<template>
  <el-tree
    :data="defaultKrs"
    :props="defaultProps"
    node-key="id"
    :default-expand-all="false"
    :expand-on-click-node="true"
    :node-expand="nodeExpand"
    icon-class="el-icon-caret-right"
  >
    <div slot-scope="{}" class="tree-krs">
      <el-form ref="tempKeyResult" :model="tempKeyResult" :rules="rules" label-position="left">
        <el-form-item prop="content">
          <el-input v-model="tempKeyResult.content" type="textarea" :autosize="autoSizeConfig" placeholder="Nhập tên tiêu chí" />
        </el-form-item>
        <div class="tree-krs__value">
          <el-form-item prop="targetValue" label="Mục tiêu" class="custom-label">
            <el-input v-model.number="tempKeyResult.targetValue" size="medium" placeholder="Nhập giá trị mục tiêu" class="custom-label" />
          </el-form-item>
          <el-form-item prop="unit" label="Đơn vị" class="custom-label">
            <el-select
              v-model.number="tempKeyResult.measureUnitId"
              size="medium"
              filterable
              no-match-text="Không tìm thấy kết quả"
              placeholder="Chọn đơn vị"
            >
              <el-option v-for="unit in units" :key="unit.id" :label="unit.type" :value="unit.id" />
            </el-select>
          </el-form-item>
        </div>
        <div class="tree-krs__links">
          <el-form-item prop="linkPlans" label="Link kế hoạch" label-width="120px">
            <el-input v-model.number="tempKeyResult.linkPlans" size="small" type="url" placeholder="Điền link kế hoạch " />
          </el-form-item>
          <el-form-item prop="linkResults" label="Link kết quả" label-width="120px">
            <el-input v-model.number="tempKeyResult.linkResults" size="small" type="url" placeholder="Điền link kết quả" />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-tree>
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
  private defaultKrs: any[] = [{ content: '', startValue: 0, targetvalue: 1, measureUnitId: 1, linkPlans: '', linkResults: '' }];
  private defaultProps: object = {
    label: (data, node) => {
      console.log('content data' + data.content);
      return data.content;
    },
    isLeaf: (data, node) => {
      console.log('Left');
      console.log(node);
      return node.level === 1;
    },
  };

  private units: any[] = [];
  private autoSizeConfig = { minRows: 2, maxRows: 2 };
  private tempKeyResult: KeyResultDTO = {
    content: '',
    startValue: 0,
    targetvalue: 1,
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

  private nodeExpand(node, openedNode, treeNode) {
    console.log(node);
    console.log(openedNode);
    console.log(treeNode);
  }

  public clearObjectiveForm() {
    (this.$refs.tempKeyResults as Form).clearValidate();
    this.tempKeyResult.content = '';
    this.tempKeyResult.startValue = 0;
    this.tempKeyResult.targetvalue = 1;
    this.tempKeyResult.linkPlans = '';
    this.tempKeyResult.linkResults = '';
    this.tempKeyResult.measureUnitId = 1;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.el-tree {
  .el-tree-node {
    &__content {
      height: auto;
      .el-tree-node__expand-icon {
        font-size: $unit-5;
      }
    }
  }
}
.tree-krs {
  width: 100%;
  &__value {
    display: flex;
    place-content: center flex-start;
    .el-form-item {
      &:nth-child(2) {
        padding-left: $unit-32;
      }
    }
  }
  &__links {
    display: flex;
    place-content: center flex-start;
    .el-form-item {
      &:nth-child(2) {
        padding-left: $unit-32;
      }
    }
  }
}
</style>
