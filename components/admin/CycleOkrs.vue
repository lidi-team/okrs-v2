<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="cycle-okrs">
      <el-table-column prop="id" label="STT" width="50"></el-table-column>
      <el-table-column prop="name" label="Tên" width="200"></el-table-column>
      <el-table-column prop="startDate" label="Ngày bắt đầu" width="250"></el-table-column>
      <el-table-column prop="endDate" label="Ngày kết đầu" width="250"></el-table-column>
      <el-table-column label="Thao tác" align="center" width="150">
        <template slot-scope="{ row }">
          <el-tooltip class="cycle-okrs__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="cycle-okrs__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="handleDelete(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="admin__tab__table__pagination" :total="100" page.sync="5" limit.sync="20" @pagination="handlePagination($event)" />
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Maps, Rule } from '@/constants/app.type';
@Component<ManageCycleOkrs>({ name: 'ManageCycleOkrs' })
export default class ManageCycleOkrs extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop() public total!: number;
  @Prop() public page!: number;
  @Prop() public limit!: number;

  private dialogUpdateVisible: boolean = false;
  private temporaryCycleOKRs: object = {};
  private rules: Maps<Rule[]> = {};

  private handleOpenDialogUpdate(row: object): void {}
  private handleDelete(row: object): void {}
}
</script>
<style lang="scss" scoped>
.cycle-okrs {
  width: 100%;
}
</style>
