<template>
  <div class="listHistory">
    <el-page-header title="OKRs cấp dưới" @back="goBack" />
    <h1 class="listHistory__title">Lịch sử Check-in</h1>
    <div class="listHistory__content">
      <el-table v-loading="loading" empty-text="Không có dữ liệu" class="myOKRs" :data="historyList" style="width: 100%">
        <el-table-column label="Mục tiêu" min-width="250">
          <template slot-scope="{ row }">
            <span>{{ row.objective.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ngày check-in" min-width="150">
          <template slot-scope="{ row }">
            <span v-if="row.checkinAt">{{ new Date(row.checkinAt) | dateFormat('DD/MM/YYYY') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ngày check-in kế tiếp" min-width="150">
          <template v-slot="{ row }">
            <span>{{ new Date(row.nextCheckinDate) | dateFormat('DD/MM/YYYY') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Trạng thái" min-width="100">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === status.OVERDUE" type="danger">Quá hạn</el-tag>
            <el-tag v-else-if="row.status === status.DRAFT" type="warning">Bản nháp</el-tag>
            <el-tag v-else-if="row.status === status.PENDING" type="info">Đang chờ duyệt</el-tag>
            <el-tag v-else-if="row.status === status.COMPLETED" type="success">Đã hoàn thành</el-tag>
            <el-tag v-else type="success">Đã duyệt</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center" width="180">
          <template slot-scope="{ row }">
            <nuxt-link :to="`/checkin/lich-su-nhan-vien/chi-tiet/${row.id}`">
              <el-button class="el-button--white el-button--checkin">Xem chi tiết</el-button>
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { statusCheckin, notificationConfig } from '@/constants/app.constant';
import CheckinRepository from '@/repositories/CheckinRepository';

@Component<HistoryCheckinEmployee>({
  name: 'HistoryCheckinEmployee',
  head() {
    return {
      title: 'Lịch sử Check-in của nhân viên',
    };
  },
  created() {
    this.getList();
  },
})
export default class HistoryCheckinEmployee extends Vue {
  private loading: boolean = false;
  private historyList: Array<object> = [];
  private status = statusCheckin;
  private goBack() {
    this.$router.go(-1);
  }

  private async getList() {
    this.loading = true;
    await CheckinRepository.getHistory(Number(this.$route.params.id))
      .then((res) => {
        this.historyList = res.data.data;
        this.loading = false;
      })
      .catch((error) => {
        if (error.response.data.statusCode === 470) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Bạn không có quyền truy cập checkin này',
          });
        } else if (error.response.data.statusCode === 404) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Không thể tìm thấy dữ liệu',
          });
        }
        this.$router.push('/checkin');
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.listHistory {
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
  &__content {
    background-color: $white;
    padding: $unit-8;
  }
}
</style>
