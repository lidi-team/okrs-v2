<template>
  <div>
    <el-table
      v-loading="loadingTable"
      empty-text="Không có dữ liệu"
      class="project-all"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="Tên dự án"
        min-width="150"
      ></el-table-column>
      <el-table-column label="Ngày bắt đầu">
        <template v-slot="{ row }">
          <!-- Vue Fileter Date Plugin -->
          <span>{{ new Date(row.startDate) | dateFormat('DD/MM/YYYY') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày kết thúc">
        <template v-slot="{ row }">
          <!-- Vue Fileter Date Plugin -->
          <span>{{ new Date(row.endDate) | dateFormat('DD/MM/YYYY') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Quản lý">
        <template v-slot="{ row }">
          <span>{{ getManager(row.pmId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="{ row }">
          <span
            :class="
              row.status
                ? 'project-all--status__active'
                : 'project-all--status__deactive'
            "
            >{{ row.status ? 'hoạt động' : 'Đã đóng' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="Trọng số">
        <template v-slot="{ row }">
          <!-- Vue Fileter Date Plugin -->
          <el-rate :value="row.weight" disabled />
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template slot-scope="{ row }">
          <div>
            <el-tooltip
              class="project-all__icon"
              content="Chi tiết"
              placement="left-end"
            >
              <i
                class="el-icon-s-order icon&#45;&#45;info"
                @click="handleControlProject(row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="user.roles.includes('ROLE_ADMIN')"
              class="project-all__icon"
              content="Cập nhật"
              placement="right-end"
            >
              <i
                class="el-icon-edit icon&#45;&#45;info"
                @click="handleOpenDialogUpdate(row)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- update project dialog -->
    <el-dialog
      class="update-employee"
      :visible.sync="dialogUpdateVisible"
      width="45%"
      placement="bottom-start"
      title="Cập nhật thông tin"
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
                placeholder="Nhập họ và tên"
                @keyup.enter.native="handleUpdate(tempUpdateProject)"
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
                :disabled="isEditableStartDate(tempUpdateProject.startDate)"
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
                :picker-options="endDateOption(tempUpdateProject.endDate)"
                format="dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                type="date"
                placeholder="Chọn ngày kết thúc"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="Trọng số:"
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
              label="trạng thái:"
              class="custom-label"
              prop="status"
              label-width="150px"
            >
              <el-radio v-model="tempUpdateProject.status" :label="1"
                >Hoạt động</el-radio
              >
              <el-radio v-model="tempUpdateProject.status" :label="0"
                >Kết thúc</el-radio
              >
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
                @keyup.enter.native="handleUpdate(tempUpdateProject)"
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
          @click="handleUpdate(tempUpdateProject)"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
    <!-- end update project dialog -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ProjectDTO } from '@/constants/app.interface';
import { compareTwoDate, formatDateToDD } from '@/utils/dateParser';
import { mapGetters } from 'vuex';
import { GetterState } from '@/constants/app.vuex';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';
import ProjectRepository from '@/repositories/ProjectRepository';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';

@Component<ProjectAll>({
  name: 'ProjectAll',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    this.loadingTable = true;
    setTimeout(() => {
      this.loadingTable = false;
    }, 500);
  },
})
export default class ProjectAll extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Function) readonly getListProject;
  @Prop(Array) readonly managers!: Array<any>;
  @Prop(Array) readonly originalProjects!: Array<object>;
  private weightColor: string = '#9D174D';

  private loadingTable: boolean = false;
  private loading: boolean = false;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateProject: ProjectDTO = {
    id: 0,
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    description: '',
    pmId: undefined,
    weight: 1,
    parentId: undefined,
  };

  private handleOpenDialogUpdate(row) {
    this.tempUpdateProject = {
      id: row.id,
      name: row.name,
      startDate: row.startDate ? formatDateToDD(row.startDate) : '',
      endDate: row.endDate ? formatDateToDD(row.endDate) : '',
      status: row.status,
      description: row.description,
      pmId: row.pmId,
      weight: row.weight,
      parentId: row.parentId === 0 ? undefined : row.parentId,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(tempUpdateProject: ProjectDTO) {
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
                  this.getListProject();
                  this.dialogUpdateVisible = false;
                })
                .catch((error) => {
                  if (error.response.data.statusCode === 430) {
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
    this.dialogUpdateVisible = false;
  }

  getManager(pmId: number) {
    let pm = '';
    if (this.managers) {
      const manager = this.managers.find((m) => {
        return m.id === pmId;
      });
      pm = manager ? manager.name : '';
    }
    return pm;
  }

  private getPercentage(weight: number) {
    return weight / 0.05;
  }

  private format(percentage: number) {
    return percentage * 0.05 + '/5';
  }

  private handleControlProject(row) {
    this.$router.push('/du-an/quan-ly?id=' + row.id);
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

  private isEditableStartDate(startDate: string) {
    const today = new Date();
    console.log('today: ', today.toDateString());
    return compareTwoDate(startDate, today.toDateString()) !== 1;
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

  private endDateOption(endDate: string) {
    const splitDate = endDate.split('/');
    const swapDDtoMM = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    const endTime = !!endDate && new Date(swapDDtoMM).getTime();
    console.log('endDateOption', endTime);
    return {
      disabledDate(time) {
        return time.getTime() < endTime;
      },
    };
  }
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
