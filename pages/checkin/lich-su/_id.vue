<template>
  <div>
    <el-page-header title="Quay lại" @back="goBack" />
    <h1 class="-title-1">Lịch sử cập nhật tiến độ</h1>
      <el-table
        v-loading="loading"
        empty-text="Không có dữ liệu"
        class="box-wrap"
        :data="historyList"
        style="width: 100%"
      >
        <el-table-column label="Mục tiêu">
          <template slot-scope="{ row }">
            <span>{{ row.objective.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ngày check-in" width="200" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.checkinAt">{{
              new Date(row.checkinAt) | dateFormat('DD/MM/YYYY')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ngày check-in kế tiếp" width="200" align="center">
          <template v-slot="{ row }">
            <span>{{
              new Date(row.nextCheckinDate) | dateFormat('DD/MM/YYYY')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Trạng thái" width="150">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === status.OVERDUE" type="danger"
              >Quá hạn</el-tag
            >
            <el-tag v-else-if="row.status === status.DRAFT" type="warning"
              >Bản nháp</el-tag
            >
            <el-tag v-else-if="row.status === status.PENDING" type="info"
              >Đang chờ duyệt</el-tag
            >
            <el-tag v-else-if="row.status === status.COMPLETED" type="success"
              >Đã hoàn thành</el-tag
            >
            <el-tag v-else type="success">Đã duyệt</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center" width="180">
          <template slot-scope="{ row }">
            <nuxt-link :to="`/checkin/chi-tiet/${row.id}`">
              <el-button class="el-button--white el-button--checkin"
                >Xem chi tiết</el-button
              >
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { statusCheckin } from '@/constants/app.constant';
import CheckinRepository from '@/repositories/CheckinRepository';

@Component<HistoryCheckin>({
  name: 'HistoryCheckin',
  head() {
    return {
      title: 'Lịch sử cập nhật tiến độ',
    };
  },
  created() {
    this.getList();
  },
})
export default class HistoryCheckin extends Vue {
  private loading: boolean = false;
  private historyList: Array<object> = [];
  private status = statusCheckin;

  private goBack() {
    this.$router.go(-1);
  }

  private async getList() {
    this.loading = true;
    const { data }  = await CheckinRepository.getHistory(Number(this.$route.params.id))
    this.historyList = data;
    this.loading = false;
  }
}
</script>

