<template>
  <fragment>
    <el-table v-loading="loading" empty-text="Không có dữ liệu" class="myOKRs" :data="tableData" style="width: 100%;">
      <el-table-column label="Mục tiêu" width="400">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Kết quả then chốt" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.keyResults ? row.keyResults.length : 0 }} kết quả</span>
        </template>
      </el-table-column>
      <el-table-column label="Tiến độ" width="250">
        <template v-slot="{ row }">
          <el-progress :percentage="row.progress" :color="customColors(row.change)" :text-inside="true" :stroke-width="26" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Thay đổi" width="150">
        <template slot-scope="{ row }">
          <span :style="`color: ${customColors(row.change)}`">{{ row.change }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Lịch sử" width="180">
        <template slot-scope="{ row }">
          <span>Xem lịch sử {{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hành động" align="center" width="180">
        <template slot-scope="{ row }">
          <el-button v-if="row.status === status.OVERDUE" type="danger" class="el-button--checkin">Quá hạn</el-button>
          <el-button v-else-if="row.status === status.DRAFT" type="warning" class="el-button--checkin">Edit bản nháp</el-button>
          <el-button v-else-if="row.status === status.PENDING" type="info" disabled class="el-button--checkin">Đang chờ duyệt</el-button>
          <el-button v-else-if="row.status === status.COMPLETED" type="success" disabled class="el-button--checkin">Đã hoàn thành</el-button>
          <el-button v-else class="el-button--purple el-button--checkin">Tạo Checkin</el-button>
        </template>
      </el-table-column>
    </el-table>
  </fragment>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { statusCheckin } from '@/constants/app.constant';

@Component<MyOkrs>({
  name: 'MyOkrs',
})
export default class MyOkrs extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
  @Prop(Function) readonly getListUsers;

  private status = statusCheckin;
  private customColors(percentage: number) {
    if (percentage < 30) {
      return '#e3d0ff';
    } else if (percentage < 70) {
      return '#9c6ade';
    } else {
      return '#50248f';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.myOKRs {
  .el-button {
    &--checkin {
      width: 100%;
    }
  }
}
</style>
