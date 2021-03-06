<template>
  <div>
    <el-page-header title="Quay lại" @back="goBack" />
    <h1 class="-title-1">Chi tiết dự án</h1>
    <div
      v-if="!!projectData"
      class="box-wrap"
      v-loading.fullscreen.lock="isloading"
    >
      <h2 class="-title-2">
        {{ projectData.name }}
      </h2>
      <table>
        <tbody>
          <tr>
            <th scope="row" class="-text-left label" width="250">
              Độ quan trọng:
            </th>
            <td class="value">
              <el-rate
                :value="projectData.weight"
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
            </td>
          </tr>
          <tr>
            <th scope="row" class="-text-left label">Ngày bắt đầu:</th>
            <td class="value">
              {{ new Date(projectData.startDate) | dateFormat('DD/MM/YYYY') }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="-text-left label">Ngày kết thúc:</th>
            <td class="value">
              {{ new Date(projectData.startDate) | dateFormat('DD/MM/YYYY') }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="-text-left label">Quản lý:</th>
            <td class="value">
              {{ projectData.pm && projectData.pm.name }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="-text-left label">Trạng thái:</th>
            <td class="value">
              {{ projectData.active ? 'Hoạt động' : 'Đã đóng' }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="-text-left label">Tổng số thành viên:</th>
            <td class="value">
              {{ projectStaffs.length }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="-text-left label">Mô tả:</th>
            <td class="value">
              {{ projectData.description }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="box-wrap">
      <div class="-display-flex -justify-content-between">
        <h2 class="-title-2">Thành viên dự án</h2>
        <div class="-display-flex -justify-content-between">
          <div class="-mr-2">
            <el-button
              v-if="isProjectPm(user.projects, projectData.active)"
              class="el-button--purple el-button--modal el-button--invite"
              @click="handleShowAddMember"
            >
              {{ isAddingMember ? 'Hủy' : 'Thêm mới thành viên' }}
            </el-button>
          </div>
          <div class="-mb-2">
            <el-input
              v-model="searchText"
              class="header-project__input"
              placeholder="Nhập tên thành viên tìm kiếm"
              prefix-icon="el-icon-search"
              @keyup.enter.native="handleSearch(searchText)"
            />
            <el-button
              class="el-button--white el-button--search -ml-2"
              @click="handleSearch(searchText)"
            >
              Tìm kiếm
            </el-button>
          </div>
        </div>
      </div>
      <div class="-mb-2 -display-flex" v-if="isAddingMember">
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
            :label="item.name + ' (' + item.email + ')'"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          class="el-button el-button--purple el-button--default -ml-2"
          :disabled="!selectUsers.length"
          @click="handleAddStaff"
          >Thêm
        </el-button>
      </div>
      <el-table
        v-loading="isloading"
        :data="handleSearch(searchText)"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="ID" prop="id" align="center" min-width="50">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tên thành viên" min-width="150" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Email" min-width="200" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Phòng ban" min-width="150" align="center">
          <template slot-scope="{ row }">
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
            <span v-if="getPositionById(row.position) && !row.edit"
              >{{ getPositionById(row.position) }}
            </span>
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
          v-if="isProjectPm(user.projects, projectData.active)"
          label="Thao tác"
          align="center"
          min-width="100"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-tooltip content="Đồng ý" placement="left-end">
                <i
                  class="el-icon-circle-check icon--info icon-default--s -mr-2"
                  @click="confirmEdit(row)"
                ></i>
              </el-tooltip>
              <el-tooltip content="Hủy" placement="right-end">
                <i
                  class="el-icon-circle-close icon-default--s icon--delete"
                  @click="cancelEdit(row)"
                ></i>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip content="Cập nhật" placement="left-end">
                <i
                  class="el-icon-edit icon--info -mr-2"
                  @click="handleEditRow(row)"
                ></i>
              </el-tooltip>
              <el-tooltip content="xóa" placement="right-end">
                <i
                  class="el-icon-delete icon--delete"
                  @click="handleDelete(row, id)"
                ></i>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { confirmWarningConfig } from '@/constants/app.constant';
import { mapGetters } from 'vuex';
import { GetterState } from '@/constants/app.vuex';
import { formatDateToDD } from '@/utils/dateParser';
import { removeVietnameseTones } from '@/utils/format';

@Component<ControlProject>({
  name: 'ControlProject',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  async created() {
    await Promise.all([
      this.getDataCommon(),
      this.getProject(this.id),
      this.getProjectStaffs(this.id),
      this.getActiveCandidates(this.id),
    ]);
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
  private searchText: String = '';
  private isloading: boolean = false;
  private isAddingMember: boolean = false;
  private tabActive: String = 'manage';
  private activeNames: string[] = ['1'];
  private projectData: ProjectDTO = {
    id: this.id,
    name: '',
    startDate: '',
    endDate: '',
    active: '',
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
      console.log('positions.data: ', positions.data);
      const memberPositions = positions.data
        ? positions.data.filter((value) => value.id !== 1)
        : [];
      this.positions = memberPositions;
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
          await this.getProjectStaffs(this.id);
        })
        .catch((err) => {
          console.log(err);
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
      await ProjectRepository.postStaffsById(this.id, this.selectUsers);
      this.selectUsers = [];
      await this.getProjectStaffs(this.id);
      await this.getActiveCandidates(this.id);
    } catch (e) {}
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
  }

  private async confirmEdit(row: ProjectStaff) {
    try {
      if (
        !!this.draftEditStaff.positionId &&
        !!this.draftEditStaff.reviewerId
      ) {
        await ProjectRepository.putStaffsById(this.id, [this.draftEditStaff]);
        row.edit = false;
        this.draftEditStaff.reviewerId = undefined;
        this.draftEditStaff.positionId = undefined;
        await this.getProjectStaffs(this.id);
      }
    } catch (e) {}
  }

  private handleEditRow(row: ProjectStaff) {
    row.edit = !row.edit;
    this.draftEditStaff.userId = row.id;
    this.draftEditStaff.reviewerId = row.reviewerId;
    this.draftEditStaff.positionId = row.position ? row.position : undefined;
  }

  private goBack() {
    this.$router.push('/du-an');
  }

  private handleChangeTab(tab, event) {
    this.tabActive = tab.name;
  }

  private isProjectPm(userProjects: any, projectStatus: number | string) {
    const dataInProject = userProjects.find(
      (value) => value.id + '' === this.id,
    );
    if (dataInProject && projectStatus) {
      return dataInProject.pm;
    } else {
      return false;
    }
  }

  private convertToTableData(projectData: ProjectDTO) {
    return [
      {
        label: 'Ngày bắt đầu',
        data: !!projectData.startDate && formatDateToDD(projectData.startDate),
      },
      {
        label: 'Ngày kết thúc',
        data: !!projectData.endDate && formatDateToDD(projectData.endDate),
      },
      { label: 'Quản lý', data: projectData.pm && projectData.pm.name },
      { label: 'Trang thái', data: projectData.active },
      { label: 'Mô tả', data: projectData.description },
    ];
  }

  private handleShowAddMember() {
    this.selectUsers = [];
    this.isAddingMember = !this.isAddingMember;
  }

  private handleSearch(userName: string) {
    return this.projectStaffs
      .filter((value1) =>
        removeVietnameseTones(value1.name)
          .toLowerCase()
          .includes(removeVietnameseTones(userName).toLowerCase()),
      )
      .sort((a, b) => a.id - b.id);
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: 14px;
  color: #606266;
  line-height: 23px;
}
.value {
  font-size: 14px;
  line-height: 23px;
}
</style>
