<template>
  <div v-loading.fullscreen.lock="loading" class="createCheckinPage">
    <el-page-header title="Yêu cầu checkin" @back="goBack" />
    <h1 class="createCheckinPage__title">Duyệt Check-in</h1>
    <checkin-request v-if="checkin" :checkin.sync="checkin">
      <chart-checkin v-if="checkin" slot="chartOKRs" :history-detail="chart" />
    </checkin-request>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Notification } from 'element-ui';
import CheckinRepository from '@/repositories/CheckinRepository';
import { formatDateToDD } from '@/utils/dateParser';
import { notificationConfig } from '@/constants/app.constant';
@Component({
  name: 'RequestPage',
  created() {
    this.getCheckin();
  },
})
export default class RequestPage extends Vue {
  private loading: boolean = false;
  private checkin: any = null;
  private chart: any = null;

  private goBack() {
    this.$router.push('/checkin?tab=request-checkin');
  }

  private async getCheckin() {
    this.loading = true;
    await CheckinRepository.getDetailCheckin(this.$route.params.id)
      .then((res) => {
        this.chart = Object.assign({}, res.data.data);
        res.data.data = Object.assign(res.data.data, {
          isCompleted: false,
        });
        res.data.data.checkinAt = formatDateToDD(res.data.data.checkinAt);
        res.data.data.nextCheckinDate = formatDateToDD(res.data.data.nextCheckinDate);
        this.checkin = res.data.data;
        this.loading = false;
      })
      .catch((error) => {
        if (error.response.data.statusCode === 470) {
          Notification.error({
            ...notificationConfig,
            message: 'Bạn không có quền truy cập checkin này',
          });
        } else if (error.response.data.statusCode === 404) {
          Notification.error({
            ...notificationConfig,
            message: 'Không thể tìm thấy dữ liệu',
          });
        } else if (error.response.data.statusCode === 475) {
          Notification.error({
            ...notificationConfig,
            message: 'Bạn chỉ có thể checkin những form mà member gửi lên',
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
.createCheckinPage {
  padding: $unit-10 $unit-8 0 $unit-10;
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
}
</style>
