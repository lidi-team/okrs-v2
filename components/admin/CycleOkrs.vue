<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="cycle-okrs">
      <el-table-column prop="id" label="STT" width="50"></el-table-column>
      <el-table-column prop="name" label="Tên" width="200"></el-table-column>
      <el-table-column prop="startDate" label="Ngày bắt đầu" width="250"></el-table-column>
      <el-table-column prop="endDate" label="Ngày kết đầu" width="250"></el-table-column>
      <el-table-column label="Thao tác" align="center" width="150">
        <template slot-scope="{ row }">
          <el-tooltip class="employee-active__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="employee-active__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="handleDelete(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Maps, Rule } from '@/constants/app.type';
@Component<CycleOKRsComponent>({ name: 'CycleOKRsComponent' })
export default class CycleOKRsComponent extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  private dialogUpdateVisible: boolean = false;
  private temporaryCycleOKRs: object = {};
  private rules: Maps<Rule[]> = {};

  private handleOpenDialogUpdate(row: object): void {}
  private handleDelete(row: object): void {}
}
</script>
<style lang="scss" scoped></style>
