<template>
  <div class="project-detail">
    <el-page-header title="Projects Dashboard" @back="goToProjectDashboard" />
    <div class="okrs-detail--top-action">
      <span class="okrs-detail--top-action__title">Quản lý nhân sự</span>
    </div>
    <el-card class="project-detail__content">
      <div slot="header" class="project-detail__content--name">
        <span>{{ projectData.name }}</span>
      </div>
      <div>
        <span>
          Ngày bắt đầu:
          {{ new Date(projectData.startDate) | dateFormat('DD/MM/YYYY') }}
        </span>
      </div>
      <div>
        <span>
          Ngày kết thúc:
          {{ new Date(projectData.endDate) | dateFormat('DD/MM/YYYY') }}
        </span>
      </div>
      <div>
        <span>
          Trọng số:
          {{ projectData.weight + '/5' }}
        </span>
      </div>
      <div>
        <span>
          Quản lý dự án:
          {{ projectData.pm && projectData.pm.name }}
        </span>
      </div>
      <div>
        <span>
          Trạng thái: {{ projectData.status == 1 ? 'Hoạt động' : '' }}
        </span>
      </div>
      <div>
        <span> Mô Tả: {{ projectData.description }} </span>
      </div>
      <div v-if="projectData.parentId">
        <span> Dự án quản lý: {{ projectData.parentId }} </span>
      </div>
    </el-card>
    <el-tabs
      v-model="tabActive"
      type="border-card"
      @tab-click="handleChangeTab"
    >
      <el-tab-pane label="Quản lý" name="manage">
        <el-table
          v-loading="isloading"
          :data="projectStaffs"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            label="ID"
            prop="id"
            sortable="custom"
            align="center"
            width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Tên thành viên"
            min-width="150"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Email" min-width="160" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Phòng ban" align="center">
            <template slot-scope="{ row }">
              <!--<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
              <el-tag>{{ getDepartmentById(row.department) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="Vị trí trong dự án"
            align="center"
            min-width="150"
          >
            <template slot-scope="{ row }">
              <template v-if="row.edit">
                <el-select
                  v-model="draftEditStaff.positionId"
                  placeholder="Chọn vị trí thành viên"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
              <el-tag v-if="getPositionById(row.position) && !row.edit"
                >{{ getPositionById(row.position) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Người Review" align="center" min-width="130">
            <template slot-scope="{ row }">
              <template v-if="row.edit">
                <el-select
                  v-model="draftEditStaff.reviewerId"
                  placeholder="Chọn người quản lý"
                >
                  <el-option
                    v-for="item in getReviewers(row.id)"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
              <span v-else style="color: green">{{
                getReviewerById(row.reviewerId)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Actions"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <template v-if="row.edit">
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-circle-check-outline"
                  @click="confirmEdit(row)"
                >
                  Đồng ý
                </el-button>
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)"
                >
                  Hủy
                </el-button>
              </template>
              <template v-else>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="handleEditRow(row)"
                >
                  Cập nhật
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(row, id)"
                >
                  Xóa
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Thêm nhân sự" name="extend">
        <el-select
          v-model="selectUsers"
          multiple
          filterable
          default-first-option
          placeholder="Chọn nhân viên cho dự án"
        >
          <el-option
            v-for="item in candidates"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          v-if="selectUsers.length"
          type="primary"
          @click="handleAddStaff"
          >Thêm mới thành viên
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProjectRepository from '@/repositories/ProjectRepository';
import {
  IProjectStaffState,
  ProjectDTO,
  ProjectStaff,
} from '@/constants/app.interface';
import TeamRepository from '@/repositories/TeamRepository';
import JobRepository from '@/repositories/JobRepository';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';

@Component<ControlProject>({
  name: 'ControlProject',
  async created() {
    await this.getDataCommon();
    await this.getProject(this.id);
    await this.getProjectStaffs(this.id);
    await this.getActiveCandidates(this.id);
  },
})
export default class ControlProject extends Vue {
  private id: any = this.$route.query.id ? this.$route.query.id : 0;
  private managers: Array<any> = [];
  private originalProjects: Array<object> = [];
  private positions: Array<any> = [];
  private departments: Array<any> = [];
  private candidates: Array<any> = [];
  private projectStaffs: Array<ProjectStaff> = [];
  private selectUsers: Array<number> = [];
  private textPm: String = '';
  private isloading: boolean = false;
  private tabActive: String = 'manage';
  private projectData: ProjectDTO = {
    id: this.id,
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    description: '',
    parentId: undefined,
    pm: undefined,
    weight: 1,
  };
  private draftEditStaff: IProjectStaffState = {
    userId: 0,
    positionId: undefined,
    reviewerId: undefined,
  };

  private async getProject(id: number) {
    try {
      this.isloading = true;
      const { data } = await ProjectRepository.getById(id);
      this.projectData = data;
      this.isloading = false;
    } catch (error) {
      console.log(error);
      this.isloading = false;
    }
  }

  private async getProjectStaffs(id: number) {
    try {
      const { data } = await ProjectRepository.getStaffsById(id);
      if (!!data && data.length > 0) {
        this.projectStaffs = data.map((v) => {
          this.$set(v, 'edit', false);
          v.originalDepartment = v.department;
          v.originalReviewerId = v.reviewerId;
          return v;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async getActiveCandidates(id: number) {
    try {
      const { data } = await ProjectRepository.getActiveCandidates(id);
      this.candidates = data;
    } catch (error) {
      console.log(error);
    }
  }

  private async getDataCommon() {
    try {
      const [
        managers,
        originalProjects,
        departments,
        positions,
      ] = await Promise.all([
        ProjectRepository.getManagers({ text: this.textPm }),
        ProjectRepository.getOriginalProjects(),
        TeamRepository.getMetaData(),
        JobRepository.getMetaData(),
      ]);
      this.managers = managers.data;
      this.originalProjects = originalProjects.data;
      this.departments = departments.data;
      this.positions = positions.data;
    } catch (e) {
      console.log(e);
    }
  }

  private handleDelete(row: ProjectStaff, projectId: number) {
    try {
      this.$confirm(`Bạn có chắc chắn muốn cập nhật dự án này?`, {
        ...confirmWarningConfig,
      })
        .then(() => ProjectRepository.deleteStaffById(projectId, row.id))
        .then(async (res) => {
          setTimeout(() => {
            this.isloading = false;
          }, 300);
          this.$notify.success({
            ...notificationConfig,
            message: 'Cập nhật dự án thành công',
          });
          await this.getProjectStaffs(this.id);
        })
        .catch((err) => {
          console.log(err);
          // this.$notify.error({
          //   ...notificationConfig,
          //   message: '',
          // });
        });
    } catch (error) {
      console.log(error);
    }
  }

  private async handleAddStaff() {
    try {
      await this.$confirm(`Bạn có chắc chắn muốn thêm những nhân viên này?`, {
        ...confirmWarningConfig,
      });
      const data = await ProjectRepository.postStaffsById(
        this.id,
        this.selectUsers,
      );
      this.selectUsers = [];
      await this.getProjectStaffs(this.id);
      this.$notify.success({
        ...notificationConfig,
        message: 'Thêm mới nhân viên thành công',
      });
    } catch (e) {
      this.$notify.warning({
        ...notificationConfig,
        message: 'Thêm mới nhân viên thất bại',
      });
    }
  }

  private getPositionById(id: number) {
    let name = null;
    const a = this.positions.find((value) => value.id === id);
    if (a) {
      name = a.name;
    }
    return name;
  }

  private getDepartmentById(id: number) {
    let name = 'Unknown';
    const a = this.departments.find((value) => value.id === id);
    if (a) {
      name = a.name;
    }
    return name;
  }

  private getReviewerById(id: number) {
    let name = 'Unknown';
    const a = this.projectStaffs.find((value) => value.id === id);
    if (a) {
      name = a.name;
    } else if (
      this.projectData.pm?.id &&
      this.projectData.pm.name &&
      this.projectData.pm.id === id
    )
      name = this.projectData.pm.name;
    return name;
  }

  private getReviewers(id: number) {
    const data: any = this.projectStaffs.filter((value) => value.id !== id);
    this.projectData.pm?.id &&
      this.projectData.pm?.name &&
      data.push({ id: this.projectData.pm.id, name: this.projectData.pm.name });
    return data;
  }

  private cancelEdit(row: ProjectStaff) {
    row.department = row.originalDepartment;
    row.reviewerId = row.originalReviewerId;
    row.edit = false;
    this.$notify.warning({
      ...notificationConfig,
      message: 'Hủy bỏ',
    });
  }

  private async confirmEdit(row: ProjectStaff) {
    try {
      if (
        !!this.draftEditStaff.positionId &&
        !!this.draftEditStaff.reviewerId
      ) {
        const { data } = await ProjectRepository.putStaffsById(this.id, [
          this.draftEditStaff,
        ]);
        row.edit = false;
        this.draftEditStaff.reviewerId = undefined;
        this.draftEditStaff.positionId = undefined;
        this.$notify.success({
          ...notificationConfig,
          message: 'Cập nhật nhân viên thành công',
        });
        await this.getProjectStaffs(this.id);
      } else {
        this.$notify.warning({
          ...notificationConfig,
          message: 'Vui lòng chọn vị trí và quản lý cho nhân viên.',
        });
      }
    } catch (e) {
      this.$notify.warning({
        ...notificationConfig,
        message: 'Cập nhật nhân viên thất bại',
      });
    }
  }

  private handleEditRow(row: ProjectStaff) {
    row.edit = !row.edit;
    this.draftEditStaff.userId = row.id;
  }

  private async UpdateProject() {}

  private goToProjectDashboard() {
    this.$router.push('/du-an');
  }

  private handleChangeTab(tab, event) {
    this.tabActive = tab.name;
  }
}
</script>
<style lang="scss" scoped>
.project-detail {
  &__content {
    width: 480px;
    background-color: white;

    &--name {
      clear: both;
    }
  }
}
</style>
