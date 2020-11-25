<template>
  <div>
    <!-- create project dialog -->
    <el-dialog
      class="update-project"
      :visible.sync="syncProjectDialog"
      width="40%"
      placement="bottom-start"
      title="Cập nhật thông tin"
      :before-close="handleCloseDialog"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form
            ref="updateProjectForm"
            :hide-required-asterisk="false"
            :status-icon="true"
            :rules="rules"
            :model="tempUpdateProject"
            style="width: 100%"
          >
            <el-form-item label="Tên dự án:" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateProject.name" placeholder="Nhập họ và tên" @keyup.enter.native="handleUpdate(tempUpdateProject)" />
            </el-form-item>
            <el-form-item v-if="true" label="Ngày bắt đầu:" class="custom-label" prop="startDate" label-width="120px">
              <el-date-picker
                v-model="tempUpdateProject.startDate"
                format="dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                :picker-options="pickerOptions"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
            <el-form-item v-if="true" label="Ngày kết thúc:" class="custom-label" prop="endDate" label-width="120px">
              <el-date-picker
                v-model="tempUpdateProject.endDate"
                format="dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                :picker-options="pickerOptions"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Mô tả:" prop="description" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateProject.description" placeholder="Nhập mô tả" @keyup.enter.native="handleUpdate(tempUpdateProject)" />
            </el-form-item>
            <el-form-item label="trạng thái:" class="custom-label" prop="status" label-width="120px">
              <el-radio v-model="tempUpdateProject.status" :label="1">Hoạt động</el-radio>
              <el-radio v-model="tempUpdateProject.status" :label="0">Đóng</el-radio>
            </el-form-item>
            <!--<el-form-item v-if="true" label="Phòng ban:" class="custom-label" prop="departmentId">
              <el-select
                v-model="tempUpdateProject.departmentId"
                class="custom-label"
                placeholder="Chọn phòng ban"
                @keyup.enter.native="handleUpdate(tempUpdateProject)"
              >
                <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            &lt;!&ndash;
            <el-form-item label="Vị trí công việc:" class="custom-label" prop="jobPositionId">
              <el-select
                v-model="tempUpdateProject.jobPositionId"
                class="custom-label"
                placeholder="Chọn vị trí công việc"
                @keyup.enter.native="handleUpdate(tempUpdateProject)"
              >
                <el-option v-for="item in jobs" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item> &ndash;&gt;
            &lt;!&ndash;
            <el-form-item v-if="tempUpdateProject.roleId !== Number(1)" label="Vai trò:" class="custom-label"
                          prop="roleId">
              <el-select
                v-model="tempUpdateProject.roleId"
                class="custom-label"
                placeholder="Chọn vai trò"
                @keyup.enter.native="handleUpdate(tempUpdateProject)"
              >
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            &ndash;&gt; &lt;!&ndash;
            <el-checkbox v-if="tempUpdateProject.roleId !== Number(1)" v-model="tempUpdateProject.isLeader">Trưởng nhóm
            </el-checkbox> &ndash;&gt;-->
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <!--<el-button class="el-button&#45;&#45;white el-button&#45;&#45;modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button&#45;&#45;purple el-button&#45;&#45;modal" :loading="loading"
                   @click="handleUpdate(tempUpdateProject)">
          Cập nhật
        </el-button>-->
      </span>
    </el-dialog>
    <!-- end update user dialog -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ProjectDTO } from '@/constants/app.interface';
import { mapGetters } from 'vuex';
import { GetterState } from '@/constants/app.vuex';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import ProjectRepository from '@/repositories/ProjectRepository';
import { Form } from 'element-ui';

@Component<ProjectDialog>({
  name: 'ProjectDialog',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    console.log(this.syncProjectDialog);
  },
})
export default class ProjectDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  // @PropSync('visibleDialog', { type: Boolean, required: true }) public syncProjectDialog!: boolean;
  private syncProjectDialog: boolean = true;
  private loadingTable: boolean = false;
  private loading: boolean = false;
  private tempUpdateProject: ProjectDTO = {
    id: 0,
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    description: '',
    pm: '',
    weight: 0,
  };

  private handleUpdate(tempUpdateProject: ProjectDTO) {
    this.loading = true;
    (this.$refs.updateEmployeeForm as Form).validate((isValid: boolean, invalidFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật user này?`, {
          ...confirmWarningConfig,
        })
          .then(async () => {
            await ProjectRepository.update(tempUpdateProject)
              .then((res) => {
                setTimeout(() => {
                  console.log('aa');
                  this.loading = false;
                }, 300);
                this.$notify.success({
                  ...notificationConfig,
                  message: 'Cập nhật thành viên thành công',
                });
                // this.getListUsers();
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
    });
  }

  private handleCloseDialog() {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.clearValidate();
    this.syncProjectDialog = false;
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };

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
}
</style>
