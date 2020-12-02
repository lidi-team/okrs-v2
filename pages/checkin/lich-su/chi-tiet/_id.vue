<template>
  <div v-loading.fullscreen.lock="loading" class="historyDetailPage">
    <el-page-header title="Lịch sử Check-in" @back="goBack" />
    <h1 class="historyDetailPage__title">Chi tiết lịch sử Check-in</h1>
    <div class="top-checkin">
      <el-row>
        <el-col class="top-checkin__left" :sm="24" :lg="10">
          <h2 class="top-checkin__title">Check-in mục tiêu</h2>
          <div class="top-checkin__content content">
            <table class="properties">
              <tbody v-if="checkin">
                <tr>
                  <th scope="row">Mục tiêu</th>
                  <td>{{ checkin.objective.title }}</td>
                </tr>
                <tr>
                  <th scope="row">Trạng thái</th>
                  <td>
                    <el-tag :type="primary">{{ checkin.status }}</el-tag>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Tiến độ thực hiện</th>
                  <td>{{ checkin.progress }} %</td>
                </tr>
                <tr v-if="checkin.checkinAt">
                  <th scope="row">Ngày check-in</th>
                  <td>{{ new Date(checkin.checkinAt) | dateFormat('DD/MM/YYYY') }}</td>
                </tr>
                <tr v-if="checkin.nextCheckinDate">
                  <th scope="row">Ngày check-in kế tiếp</th>
                  <td>{{ new Date(checkin.nextCheckinDate) | dateFormat('DD/MM/YYYY') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :sm="24" :lg="14" class="top-checkin__right">
          <h2 class="top-checkin__title">Tiến độ</h2>
          <div id="chartCheckin" class="top-checkin__chart" />
        </el-col>
      </el-row>
    </div>
    <detail-history v-if="checkin" :checkin-detail="checkin.checkinDetails">
      <!-- <chart-checkin v-if="historyDetail" slot="chartCheckin" :history-detail="historyDetail" /> -->
    </detail-history>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CheckinRepository from '@/repositories/CheckinRepository';
import { notificationConfig } from '@/constants/app.constant';
import DetailHistory from '@/components/checkin/DetailHistory.vue';
@Component({
  name: 'DetailHistoryPage',
  head() {
    return {
      title: 'Chi tiết lịch sử Check-in',
    };
  },
  components: {
    DetailHistory,
  },
  mounted() {
    this.getDetail();
  },
})
export default class DetailHistoryPage extends Vue {
  private loading: boolean = false;
  private checkin: any = null;

  private async getDetail() {
    this.loading = true;
    const { data } = await CheckinRepository.getDetailCheckinByCheckinId(+this.$route.params.id);
    this.checkin = data;
    this.loading = false;
  }

  private goBack() {
    if (this.checkin) {
      this.$router.push(`/checkin/lich-su/${this.checkin.objective.id}`);
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.historyDetailPage {
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
}
.top-checkin {
  margin-bottom: $unit-8;
  background-color: $white;
  &__title {
    font-size: $unit-5;
    font-style: normal;
    font-weight: normal;
    color: #212b36;
    line-height: 28px;
  }
  &__chart {
    width: 100%;
    min-height: 350px;
    font-size: $unit-3;
  }
  &__left {
    padding: $unit-12 $unit-8;
  }

  &__right {
    padding: $unit-4 $unit-6;
  }

  .content {
    th {
      font-size: 14px;
      border-width: 0;
      vertical-align: top;
      text-align: left;
      color: #454f5b;
    }

    td {
      color: #454f5b;
      font-size: 14px;
      border-width: 0;
      vertical-align: top;
      text-align: left;
      padding-left: $unit-2;
      padding-right: $unit-2;
    }
  }
}
</style>
