<template>
  <el-tabs v-model="tabActive" type="border-card">
    <el-tab-pane label="Thiết lập quản lý" name="active">
      <el-form
        ref="controllerProjectForm"
        :hide-required-asterisk="false"
        :status-icon="true"
        :model="projectData"
        style="width: 100%"
      >
        <el-form-item
          label="Tên dự án:"
          prop="name"
          class="custom-label"
          label-width="150px"
        >
          <el-input
            v-model="projectData.name"
            placeholder="Nhập họ và tên"
            disabled
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
            v-model="projectData.startDate"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy"
            type="date"
            placeholder="Chọn ngày bắt đầu"
            disabled
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
            v-model="projectData.endDate"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy"
            type="date"
            placeholder="Chọn ngày kết thúc"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="Trọng số:"
          class="custom-label"
          prop="weight"
          label-width="150px"
        >
          <el-slider
            v-model="projectData.weight"
            :step="1"
            :max="5"
            :min="1"
            show-stops
            disabled
          ></el-slider>
        </el-form-item>
        <el-form-item
          label="Quản lý dự án:"
          class="custom-label"
          prop="pmId"
          label-width="150px"
        >
          <el-select
            v-model="projectData.pm"
            filterable
            placeholder="Chọn người quản lý dự án"
          >
            <el-option
              v-for="item in managers"
              :key="item.id"
              :label="item.name"
              :value="item"
              disabled
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="trạng thái:"
          class="custom-label"
          prop="status"
          label-width="150px"
        >
          <el-radio v-model="projectData.status" :label="1">Hoạt động</el-radio>
          <el-radio v-model="projectData.status" :label="0">Kết thúc</el-radio>
        </el-form-item>
        <el-form-item
          label="Trực thuộc dự án:"
          prop="parentId"
          label-width="150px"
        >
          <el-select
            v-model="projectData.parentId"
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
            v-model="projectData.description"
            placeholder="Nhập mô tả"
            @keyup.enter.native="handleUpdate(projectData)"
          />
        </el-form-item>
        <el-form-item label-width="150px">
          <el-button type="primary" @click="UpdateProject">Cập nhật</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-select
          v-model="selectUsers"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Chọn nhân viên cho dự án"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="UpdateProject">Cập nhật</el-button>
      </div>
      <br />
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
          min-width="150px"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Email" min-width="200" align="center">
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
        <el-table-column label="Vị trí trong dự án" align="center">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-select v-model="value" placeholder="Chọn vị trí thành viên">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >
                cancel
              </el-button>
            </template>
            <el-tag>{{ getPositionById(row.position) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Người Review" align="center">
          <template slot-scope="{ row }">
            <span style="color: green">{{
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
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              Ok
            </el-button>
            <template v-else>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit = !row.edit"
              >
                Edit
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(row, id)"
              >
                Delete
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProjectRepository from '@/repositories/ProjectRepository';
import { ProjectDTO, ProjectStaff } from '@/constants/app.interface';
import TeamRepository from '@/repositories/TeamRepository';
import JobRepository from '@/repositories/JobRepository';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';

@Component<ControlProject>({
  name: 'ControlProject',
  async created() {
    await this.getProject();
    await this.getDataCommon();
    await this.getProjectStaffs();
    await this.getAllActiveStaffs();
  },
})
export default class ControlProject extends Vue {
  private id: any = this.$route.query.id ? this.$route.query.id : 0;
  private managers: Array<any> = [];
  private originalProjects: Array<object> = [];
  private positions: Array<any> = [];
  private departments: Array<any> = [];
  private employees: Array<any> = [];
  private projectStaffs: Array<ProjectStaff> = [];
  private selectUsers: Array<ProjectStaff> = [];
  private textPm: String = '';
  private isloading: boolean = false;
  private tabActive: String = 'active';
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

  private async getProject() {
    try {
      const { data } = await ProjectRepository.getById(this.id);
      this.projectData = data;
    } catch (error) {
      console.log(error);
    }
  }

  private async getProjectStaffs() {
    try {
      const { data } = await ProjectRepository.getStaffsById(this.id);
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

  private async getAllActiveStaffs() {
    try {
      const { data } = await ProjectRepository.getAllActiveStaff();
      this.employees = data;
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
          await this.getProjectStaffs();
        })
        // eslint-disable-next-line handle-callback-err
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

  private getPositionById(id: number) {
    let name = 'Member';
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

  private cancelEdit(row: ProjectStaff) {
    row.department = row.originalDepartment;
    row.reviewerId = row.originalReviewerId;
    row.edit = false;
    this.$notify.warning({
      ...notificationConfig,
      message: 'Hủy',
    });
  }

  private confirmEdit(row: ProjectStaff) {
    row.edit = false;
    // row.originalTitle = row.title;
    this.$message({
      message: 'The title has been edited',
      type: 'success',
    });
  }

  private async UpdateProject() {}
}
</script>
<style lang="scss" scoped></style>
