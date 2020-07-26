<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="cycle-okrs">
      <el-table-column prop="name" label="Tên chu kỳ"></el-table-column>
      <el-table-column label="Ngày bắt đầu">
        <template slot-scope="{ row }">
          <span>{{ dateParser(row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày kết đầu">
        <template slot-scope="{ row }">
          <span>{{ dateParser(row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
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
    <base-pagination
      class="admin__tab__table__pagination"
      :total="total"
      page.sync="page"
      limit.sync="limit"
      @pagination="handlePagination($event)"
    />
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import vi from 'date-fns/locale/vi';
import { format } from 'date-fns';
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
  private dateParser(date: string, dateFormat: string = 'dd-MM-yyyy'): string {
    const tempDate = new Date(date);
    return format(tempDate, dateFormat);
  }
}
</script>
<style lang="scss" scoped>
.cycle-okrs {
  width: 100%;
}
</style>
