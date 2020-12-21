<template>
  <div v-loading.fullscreen.lock="loading" class="-mb-5">
    <el-page-header title="Quay lại" @back="goBack" />
    <h1 class="-title-1">Tạo checkin</h1>
    <div class="top-checkin box-wrap">
      <h2 class="-title-2">Chi tiết check-in</h2>
      <div v-if="checkin" class="top-checkin__content content">
        <table class="properties">
          <tbody>
            <tr>
              <th scope="row">Mục tiêu</th>
              <td>{{ checkin.objective.title }}</td>
            </tr>
            <tr>
              <th scope="row">Tiến độ thực hiện</th>
              <td>{{ checkin.objective.progress }} %</td>
            </tr>
            <tr>
              <th scope="row">Tiến độ gợi ý</th>
              <td>{{ checkin.objective.progressSuggest | verifyProgress }} %</td>
            </tr>
            <tr v-if="checkin.checkin.checkinAt">
              <th scope="row">Ngày check-in</th>
              <td>
                {{
                  new Date(checkin.checkin.checkinAt)
                    | dateFormat('DD/MM/YYYY')
                }}
              </td>
            </tr>
            <tr v-if="checkin.checkin.nextCheckinDate">
              <th scope="row">Ngày check-in kế tiếp</th>
              <td>
                {{
                  new Date(checkin.checkin.nextCheckinDate)
                    | dateFormat('DD/MM/YYYY')
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <checkin-detail-chart
      class="top-checkin"
      v-if="checkin"
      :checkin.sync="checkin.chart"
    />
    <checkin-detail v-if="checkin" :checkin.sync="checkin" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CheckinRepository from '@/repositories/CheckinRepository';
import { formatDateToDD, initNewDate } from '@/utils/dateParser';
import { notificationConfig } from '@/constants/app.constant';
import CheckinDetail from '@/components/Checkins/CheckinDetail/CheckinDetailIndex.vue';
import CheckinDetailChart from '@/components/Checkins/CheckinDetail/CheckinDetailChart.vue';

@Component({
  head() {
    return {
      title: 'Tạo cập nhật tiến độ',
    };
  },
  components: {
    CheckinDetail,
    CheckinDetailChart,
  },
  async mounted() {
    await this.getCheckin();
  },
})
export default class CheckinPage extends Vue {
  private loading: boolean = false;
  private checkin: any = null;

  private goBack() {
    this.$router.go(-1);
  }

  private async getCheckin() {
    this.loading = true;
    const { data } = await CheckinRepository.getDetailCheckInByObjectiveId(
      +this.$route.params.id,
    );
    if (data.checkinDetail.length === 0) {
      data.checkinDetail = data.keyResults.map((item) => {
        return {
          confidentLevel: 1,
          keyResult: item,
          plans: '',
          problems: '',
          progress: '',
        };
      });
    }
    this.checkin = data;
    this.loading = false;
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.top-checkin {
  margin-bottom: $unit-8;
  background-color: $white;
  &__chart {
    width: 100%;
    min-height: 350px;
    font-size: $unit-3;
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
