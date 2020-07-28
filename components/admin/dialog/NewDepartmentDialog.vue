<template>
  <el-dialog title="Thêm mới phòng ban" :visible.sync="syncTeamDialog" width="30%" placement="center" :before-close="handleCloseDialog">
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateDepartment" :model="tempCreateDepartment" :rules="rules">
          <el-form-item label="Tên phòng ban" prop="name" class="custom-label" label-width="120px">
            <el-input v-model="tempCreateDepartment.name" placeholder="Nhập tên phòng ban" />
          </el-form-item>
          <el-form-item label="Mô tả" label-width="120px">
            <el-input v-model="tempCreateDepartment.description" placeholder="Nhập mô tả" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="createTeam">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import TeamRepository from '@/repositories/TeamRepository';
import { TeamDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
@Component<TeamDialog>({
  name: 'TeamDialog',
})
export default class TeamDialog extends Vue {
  @PropSync('teamVisibleDialog', { type: Boolean, required: true }) public syncTeamDialog!: boolean;

  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private tempCreateDepartment: TeamDTO = {
    name: '',
    description: '',
  };

  private rules: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên phòng ban', trigger: 'blur' },
      { min: 3, message: 'Tên phòng ban chứa ít nhất 2 ký tự', trigger: 'change' },
    ],
  };

  private createTeam() {
    this.loading = true;
    (this.$refs.tempCreateDepartment as Form).validate(async (isValid) => {
      try {
        await TeamRepository.post(this.tempCreateDepartment).then((res) => {
          this.$notify({
            title: 'Status',
            message: `Tạo mới thành công chu kỳ ${res.data.data.name}`,
            type: 'success',
            duration: 2000,
          });
        });
        this.loading = false;
        this.syncTeamDialog = false;
      } catch (error) {
        this.$notify({
          title: 'Lỗi',
          message: `Lỗi ${error.message}`,
          type: 'error',
          duration: 2000,
        });
        this.loading = false;
      }
    });
  }

  private handleCloseDialog() {
    (this.$refs.tempCreateDepartment as Form).clearValidate();
    this.syncTeamDialog = false;
  }
}
</script>
<style lang="scss" scoped></style>
