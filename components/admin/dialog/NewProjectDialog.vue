<template>
  <div>
    <!-- create project dialog -->
    <el-dialog
      class="update-employee"
      :visible.sync="syncProjectDialog"
      width="45%"
      placement="bottom-start"
      title="Thông tin dự án"
      :before-close="handleCloseDialog"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form
            ref="updateEmployeeForm"
            :hide-required-asterisk="false"
            :status-icon="true"
            :rules="rules"
            :model="tempUpdateProject"
            style="width: 100%"
          >
            <el-form-item
              label="Tên dự án:"
              prop="name"
              class="custom-label"
              label-width="150px"
            >
              <el-input
                v-model="tempUpdateProject.name"
                placeholder="Nhập tên dự án"
                @keyup.enter.native="handleCreate(tempUpdateProject)"
              />
            </el-form-item>
            <el-form-item
              v-if="true"
              label="Ngày bắt đầu:"
              class="custom-label"
              prop="startDate"
              label-width="150px"
            >
              <el-date-picker
                v-model="tempUpdateProject.startDate"
                format="dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                type="date"
                placeholder="Chọn ngày bắt đầu"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              v-if="true"
              label="Ngày kết thúc:"
              class="custom-label"
              prop="endDate"
              label-width="150px"
            >
              <el-date-picker
                v-model="tempUpdateProject.endDate"
                format="dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                type="date"
                placeholder="Chọn ngày kết thúc"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="trọng số:"
              class="custom-label"
              prop="weight"
              label-width="150px"
            >
              <el-slider
                v-model="tempUpdateProject.weight"
                :step="1"
                :max="5"
                :min="1"
                show-stops
              ></el-slider>
            </el-form-item>
            <el-form-item
              label="Quản lý dự án:"
              class="custom-label"
              prop="pmId"
              label-width="150px"
            >
              <el-select
                v-model="tempUpdateProject.pmId"
                filterable
                placeholder="Chọn người quản lý dự án"
              >
                <el-option
                  v-for="item in managers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Trực thuộc dự án:"
              prop="parentId"
              label-width="150px"
            >
              <el-select
                v-model="tempUpdateProject.parentId"
                clearable
                placeholder="Chọn dự án"
              >
                <el-option
                  v-for="item in originalProjects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Mô tả:" prop="description" label-width="150px">
              <el-input
                type="textarea"
                v-model="tempUpdateProject.description"
                placeholder="Nhập mô tả"
                @keyup.enter.native="handleCreate(tempUpdateProject)"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="el-button&#45;&#45;white el-button&#45;&#45;modal"
          @click="handleCloseDialog"
          >Hủy</el-button
        >
        <el-button
          class="el-button&#45;&#45;purple el-button&#45;&#45;modal"
          :loading="loading"
          @click="handleCreate(tempUpdateProject)"
          >Tạo mới</el-button
        >
      </span>
    </el-dialog>
    <!-- end create project dialog -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator';
import { ProjectDTO } from '@/constants/app.interface';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';
import ProjectRepository from '@/repositories/ProjectRepository';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
import { compareTwoDate } from '@/utils/dateParser';

@Component<ProjectDialog>({
  name: 'ProjectDialog',
})
export default class ProjectDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop(Array) readonly managers!: Array<any>;
  @Prop(Array) readonly originalProjects!: Array<object>;
  @PropSync('visibleDialog', { type: Boolean, required: true })
  public syncProjectDialog!: boolean;

  private loading: boolean = false;
  private tempUpdateProject: ProjectDTO = {
    name: '',
    startDate: '',
    endDate: '',
    status: 1,
    description: '',
    pmId: undefined,
    weight: 1,
    parentId: undefined,
  };

  private handleCreate(tempUpdateProject: ProjectDTO) {
    console.log('before update: ', tempUpdateProject);

    this.loading = true;
    (this.$refs.updateEmployeeForm as Form).validate(
      (isValid: boolean, invalidFields: object) => {
        if (isValid) {
          this.$confirm(`Bạn có chắc chắn muốn cập nhật dự án này?`, {
            ...confirmWarningConfig,
          })
            .then(async () => {
              await ProjectRepository.update(tempUpdateProject)
                .then((res) => {
                  setTimeout(() => {
                    this.loading = false;
                  }, 300);
                  this.reloadData();
                  this.syncProjectDialog = false;
                })
                .catch((error) => {
                  if (error.response.data.statusCode === 430) {
                    this.$notify.error({
                      ...notificationConfig,
                      message: 'Team Leader đã tồn tại',
                    });
                  }
                  setTimeout(() => {
                    this.loading = false;
                  }, 300);
                });
            })
            .catch(() => {
              setTimeout(() => {
                this.loading = false;
              }, 300);
            });
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      },
    );
  }

  private handleCloseDialog() {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.clearValidate();
    this.syncProjectDialog = false;
  }

  private rules: Maps<Rule[]> = {
    name: [
      { validator: this.sanitizeInput, trigger: ['change', 'blur'] },
      max255Char,
    ],
    pmId: [
      {
        required: true,
        message: 'Vui lòng chọn người quản lý',
        trigger: 'blur',
      },
    ],
    startDate: [
      {
        required: true,
        message: 'Vui lòng chọn ngày bắt đầu',
        trigger: 'blur',
      },
    ],
    endDate: [
      {
        required: true,
        message: 'Vui lòng chọn ngày kết thúc',
        trigger: 'blur',
      },
      { validator: this.validateEndDate, trigger: ['blur', 'change'] },
    ],
  };

  private validateEndDate(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (compareTwoDate(value, this.tempUpdateProject.startDate) === 1) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu');
    }
    return callback();
  }

  private sanitizeInput(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên dự án');
    }
    return callback();
  }

  // private deactiveUser(row) {
  //   this.tempUpdateProject = {
  //     id: row.id,
  //     name: row.name,
  //     startDate: row.startDate,
  //     endDate: row.endDate,
  //     status: row.status,
  //     description: row.description,
  //     pm: row.pmi,
  //   };
  //   this.$confirm('Bạn có chắc chắn muốn deactive user này?', {
  //     confirmButtonText: 'Đồng ý',
  //     cancelButtonText: 'Hủy bỏ',
  //     type: 'warning',
  //   }).then(async () => {
  //     try {
  //       await EmployeeRepository.update(this.tempUpdateProject).then((res: any) => {
  //         this.$notify.success({
  //           ...notificationConfig,
  //           message: 'Cập nhật thành viên thành công',
  //         });
  //       });
  //       this.getListUsers();
  //     } catch (error) {}
  //   });
  // }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

.project-all {
  &__icon {
    cursor: pointer;
    margin: 0 $unit-1;
  }
  &--status {
    &__active {
      color: #27ae60;
    }

    &__deactive {
      color: #dd1100;
    }
  }
}
</style>
