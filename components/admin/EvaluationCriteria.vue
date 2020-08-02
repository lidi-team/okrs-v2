<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="criteria-admin">
      <el-table-column prop="content" label="Tiêu chí đánh giá"></el-table-column>
      <el-table-column label="Số sao">
        <template v-slot="{ row }">
          <span>{{ row.numberOfStar }} <star-icon /></span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Kiểu" :formatter="typeFormatter" />
      <el-table-column label="Ngày cập nhật">
        <template v-slot="{ row }">
          <span>{{ new Date(row.updatedAt) | dateFormat('DD/MM/YYYY') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="criteria-admin__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="criteria-admin__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" />
    <el-dialog
      title="Cập nhật tiêu chí"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="criteria-admin-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="tempUpdateCriteria" :model="tempUpdateCriteria" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên tiêu chí" prop="content" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateCriteria.content" placeholder="Nhập tên tiêu chí" @keyup.enter.native="handleUpdate(tempUpdateCriteria)" />
            </el-form-item>
            <el-form-item label="Số sao" prop="numberOfStar" class="custom-label" label-width="120px">
              <el-input
                v-model.number="tempUpdateCriteria.numberOfStar"
                placeholder="Nhập số sao"
                @keyup.enter.native="handleUpdate(tempUpdateCriteria)"
              />
            </el-form-item>
            <el-form-item prop="type" label="Kiểu" class="custom-label" label-width="120px">
              <el-select v-model="tempUpdateCriteria.type" placeholder="Chọn kiểu">
                <el-option v-for="item in typeCriterias" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" @click="handleUpdate">Cập nhật</el-button>
      </span>
    </el-dialog>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';

import { notificationConfig } from '../../constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { EvaluationCriteriorDTO } from '@/constants/app.interface';
import { EvaluationCriteriaEnum, AdminTabsEn } from '@/constants/app.enum';
import EvaluationCriteriorRepository from '@/repositories/EvaluationCriteriaRepository';
import StarIcon from '@/assets/images/common/star.svg';

@Component<ManageEvaluationCriteria>({
  name: 'ManageEvaluationCriteria',
  components: {
    StarIcon,
  },
})
export default class ManageEvaluationCriteria extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop(Function) public reloadData!: Function;
  @Prop({ type: Number, required: true }) public total!: number;
  @PropSync('page', { type: Number, required: true }) public syncPage!: number;
  @PropSync('limit', { type: Number, required: true }) public syncLimit!: number;

  private typeCriterias: object[] = [
    { label: 'Sếp đánh giá nhân viên', value: EvaluationCriteriaEnum.LEADER_TO_MEMBER },
    { label: 'Nhân viên đánh giá sếp', value: EvaluationCriteriaEnum.MEMBER_TO_LEADER },
  ];

  private dateFormat: string = 'dd/MM/yyyy';
  private dialogUpdateVisible: boolean = false;
  private tempUpdateCriteria: EvaluationCriteriorDTO = {
    content: '',
    numberOfStar: 1,
    type: null,
  };

  private rules: Maps<Rule[]> = {
    content: [{ validator: this.sanitizeInput, trigger: 'change' }],
    numberOfStar: [{ type: 'number', min: 1, required: true, message: 'Số sao phải là 1 số nguyên không âm', trigger: 'blur' }],
    type: [{ type: 'string', required: true, message: 'Vui lòng chọn kiểu của tiêu chí', trigger: 'change' }],
  };

  private sanitizeInput(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên tiêu chí');
    }
    if (isEmpty(value)) {
      return callback('Tên tiêu chí không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private handleOpenDialogUpdate(row: EvaluationCriteriorDTO): void {
    this.tempUpdateCriteria = {
      id: row.id,
      content: row.content,
      numberOfStar: row.numberOfStar,
      type: row.type,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.tempUpdateCriteria as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật tiêu chí này không?`, {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
        }).then(async () => {
          try {
            await EvaluationCriteriorRepository.update(this.tempUpdateCriteria).then((res) => {
              Notification.success({
                ...notificationConfig,
                message: 'Cập nhật tiêu chí thành công',
              });
            });
            this.reloadData();
            this.dialogUpdateVisible = false;
          } catch (error) {}
        });
      }
    });
  }

  private deleteRow(row: EvaluationCriteriorDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa tiêu chí ${row.content}?`, {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await EvaluationCriteriorRepository.delete(row.id).then((res) => {
          Notification.success({
            ...notificationConfig,
            message: 'Xóa tiêu chí thành công',
          });
        });
        this.reloadData();
      } catch (error) {}
    });
  }

  private handlePagination(pagination: any) {
    this.$router.push(`?tab=${AdminTabsEn.EvaluationCriterial}&page=${pagination.page}`);
  }

  private handleCloseDialog(): void {
    (this.$refs.tempUpdateCriteria as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }

  private typeFormatter(row, column, cellValue, index) {
    return cellValue === EvaluationCriteriaEnum.LEADER_TO_MEMBER ? 'Sếp đánh giá nhân viên' : 'Nhân viên đánh giá sếp';
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.criteria-admin {
  width: 100%;
}
.pagination-bottom {
  margin-top: 2rem;
}
.criteria-admin-dialog {
  .el-select {
    width: 100%;
  }
}
</style>
