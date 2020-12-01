<template>
  <div>
    <!-- create project dialog -->
    <el-dialog
      class="update-employee"
      visible="true"
      width="45%"
      placement="bottom-start"
      title="Cập nhật thông tin"
      :before-close="handleCloseDialog"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <span>oke</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <!--<el-button class="el-button&#45;&#45;white el-button&#45;&#45;modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button&#45;&#45;purple el-button&#45;&#45;modal" :loading="loading" @click="handleCreate(tempUpdateProject)"
          >Cập nhật</el-button
        >-->
      </span>
    </el-dialog>
    <!-- end create project dialog -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator';
import { ProjectDTO } from '@/constants/app.interface';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import ProjectRepository from '@/repositories/ProjectRepository';
import { Form } from 'element-ui';

@Component<ProjectDialog>({
  name: 'ProjectDialog',
})
export default class ProjectDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop(Array) readonly managers!: Array<any>;
  @Prop(Array) readonly originalProjects!: Array<object>;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncProjectDialog!: boolean;

  private loading: boolean = false;
  private tempUpdateProject: ProjectDTO = {
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    description: '',
    pmId: 0,
    weight: 1,
    parentId: 0,
  };

  private handleCreate(tempUpdateProject: ProjectDTO) {
    this.loading = true;
    (this.$refs.updateEmployeeForm as Form).validate((isValid: boolean, invalidFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn tạo mới project này?`, {
          ...confirmWarningConfig,
        })
          .then(async () => {
            await ProjectRepository.update(tempUpdateProject)
              .then((res) => {
                setTimeout(() => {
                  this.loading = false;
                }, 300);
                this.$notify.success({
                  ...notificationConfig,
                  message: 'Khởi tạo project thành công',
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
