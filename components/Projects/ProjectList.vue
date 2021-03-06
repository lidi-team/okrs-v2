<template>
  <div>
    <div class="box-wrap">
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
        <el-table-column label="Ngày bắt đầu" min-width="100">
          <template v-slot="{ row }">
            <span>{{
              new Date(row.startDate) | dateFormat('DD/MM/YYYY')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ngày kết thúc" min-width="100">
          <template v-slot="{ row }">
            <span>{{ new Date(row.endDate) | dateFormat('DD/MM/YYYY') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Quản lý">
          <template v-slot="{ row }">
            <span>{{ getManager(row.pmId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center" width="150">
          <template slot-scope="{ row }">
            <el-tag :type="row.active | tagActive">
              {{ row.active | textActiveProject }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Độ quan trọng" align="center" width="180">
          <template v-slot="{ row }">
            <el-rate
              class="-mb-3"
              v-model="row.weight"
              disabled
              :icon-classes="[
                'el-icon-success',
                'el-icon-success',
                'el-icon-success',
              ]"
              disabled-void-icon-class="el-icon-success"
              disabled-void-color="#FBCFE8"
              :colors="['#EC4899', '#DB2777', '#BE185D']"
            />
          </template>
        </el-table-column>
        <el-table-column label="Chi tiết" align="center" width="180">
          <template slot-scope="{ row }">
            <el-button
              class="el-button--white w-100"
              @click="handleControlProject(row)"
              >Xem chi tiết</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="Thao tác"
          align="center"
          v-if="user.roles.includes('ROLE_ADMIN')"
          width="120"
        >
          <template slot-scope="{ row }">
            <div>
              <el-tooltip
                class="project-all__icon"
                content="Cập nhật"
                placement="right-end"
              >
                <i
                  class="el-icon-edit icon--info"
                  @click="handleOpenDialogUpdate(row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="project-all__icon"
                :content="row.active ? 'Đóng' : 'Mở'"
                placement="right-end"
              >
                <i
                  :class="
                    row.active
                      ? 'el-icon-lock icon--delete'
                      : 'el-icon-unlock icon--green'
                  "
                  @click="handleCloseProject(row)"
                ></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
              label="Độ quan trọng:"
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
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ProjectDTO } from '@/constants/app.interface';
import { compareTwoDate, formatDateToDD } from '@/utils/dateParser';
import { mapGetters } from 'vuex';
import { GetterState } from '@/constants/app.vuex';
import { confirmWarningConfig } from '@/constants/app.constant';
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
    active: '',
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
      active: row.active,
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
                .catch(() => {
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

  private getPercentage(weight: number): number {
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
    return compareTwoDate(startDate, today.toDateString()) !== 1;
  }

  private sanitizeInput(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (value.length === 0) {
      return callback('Vui lòng nhập tên dự án');
    }
    return callback();
  }

  private endDateOption(endDate: string) {
    const splitDate = endDate.split('/');
    const swapDDtoMM = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    const endTime = !!endDate && new Date(swapDDtoMM).getTime();
    return {
      disabledDate(time) {
        return time.getTime() < endTime;
      },
    };
  }

  private async handleCloseProject(row: ProjectDTO) {
    try {
      await this.$confirm(
        `Bạn có chắc chắn muốn ${row.active ? 'đóng' : 'mở'} dự án này?`,
        {
          ...confirmWarningConfig,
        },
      );
      this.loading = true;
      const id = row.id ? row.id : 0;
      await ProjectRepository.changeState(id);
      await this.getListProject();
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }
}
</script>
