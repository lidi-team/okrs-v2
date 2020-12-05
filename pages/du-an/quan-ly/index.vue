<template>
  <el-tabs v-model="tabActive" type="border-card">
    <el-tab-pane label="Thiết lập quản lý" name="active">
      <el-form ref="controllerProjectForm" :hide-required-asterisk="false" :status-icon="true" :model="projectData" style="width: 100%">
        <el-form-item label="Tên dự án:" prop="name" class="custom-label" label-width="150px">
          <el-input v-model="projectData.name" placeholder="Nhập họ và tên" disabled />
        </el-form-item>
        <el-form-item v-if="true" label="Ngày bắt đầu:" class="custom-label" prop="startDate" label-width="150px">
          <el-date-picker
            v-model="projectData.startDate"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy"
            type="date"
            placeholder="Chọn ngày bắt đầu"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="true" label="Ngày kết thúc:" class="custom-label" prop="endDate" label-width="150px">
          <el-date-picker
            v-model="projectData.endDate"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy"
            type="date"
            placeholder="Chọn ngày kết thúc"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Trọng số:" class="custom-label" prop="weight" label-width="150px">
          <el-slider v-model="projectData.weight" :step="1" :max="5" :min="1" show-stops disabled></el-slider>
        </el-form-item>
        <el-form-item label="Quản lý dự án:" class="custom-label" prop="pmId" label-width="150px">
          <el-select v-model="projectData.pm" filterable placeholder="Chọn người quản lý dự án">
            <el-option v-for="item in managers" :key="item.id" :label="item.name" :value="item" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="trạng thái:" class="custom-label" prop="status" label-width="150px">
          <el-radio v-model="projectData.status" :label="1">Hoạt động</el-radio>
          <el-radio v-model="projectData.status" :label="0">Kết thúc</el-radio>
        </el-form-item>
        <el-form-item label="Trực thuộc dự án:" prop="parentId" label-width="150px">
          <el-select v-model="projectData.parentId" clearable placeholder="Chọn dự án">
            <el-option v-for="item in originalProjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Mô tả:" prop="description" label-width="150px">
          <el-input type="textarea" v-model="projectData.description" placeholder="Nhập mô tả" @keyup.enter.native="handleUpdate(projectData)" />
        </el-form-item>
        <el-form-item label="Thành viên:" prop="description" label-width="150px">
          <el-select v-model="value" multiple filterable allow-create default-first-option placeholder="Chọn nhân viên cho đự án">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="150px">
          <el-button type="primary" @click="UpdateProject">Cập nhật</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProjectRepository from '@/repositories/ProjectRepository';
import { ProjectDTO } from '@/constants/app.interface';

@Component<ControlProject>({
  name: 'ControlProject',
  async created() {
    await this.getProject();
    await this.getDataCommon();
  },
})
export default class ControlProject extends Vue {
  private id: any = this.$route.query.id ? this.$route.query.id : 0;
  private managers: Array<any> = [];
  private originalProjects: Array<object> = [];
  private textPm: String = '';
  private tabActive: String = 'active';
  private projectData: ProjectDTO = {
    id: this.id,
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    description: '',
    parentId: '',
    pm: '',
    staffs: [],
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

  private async getDataCommon() {
    try {
      const [managers, originalProjects] = await Promise.all([
        ProjectRepository.getManagers({ text: this.textPm }),
        ProjectRepository.getOriginalProjects(),
      ]);
      this.managers = managers.data;
      this.originalProjects = originalProjects.data;
    } catch (e) {
      console.log(e);
    }
  }

  private async UpdateProject() {}
}
</script>
<style lang="scss" scoped></style>
