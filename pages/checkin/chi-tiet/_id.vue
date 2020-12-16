<template>
  <div>
    <el-page-header title="Quay lại" @back="goBack" />
    <h1>Chi tiết Check-in</h1>
    <el-row :gutter="32">
      <el-col :sm="24" :lg="8">
        <div class="box-wrap height-detail">
          <h2 class="-title-2 -border-header">Thông tin chi tiết</h2>
          <div class="top-checkin__content content">
            <table class="properties">
              <tbody v-if="checkin">
                <tr>
                  <th scope="row" class="-text-left">Mục tiêu: </th>
                  <td>{{ checkin.objective.title }}</td>
                </tr>
                <tr>
                  <th scope="row" class="-text-left">Trạng thái:</th>
                  <td>
                    {{ checkin.status }}
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="-text-left">Tiến độ thực hiện: </th>
                  <td>{{ checkin.progress }} %</td>
                </tr>
                <tr v-if="checkin.checkinAt">
                  <th scope="row">Ngày check-in: </th>
                  <td>
                    {{ new Date(checkin.checkinAt) | dateFormat('DD/MM/YYYY') }}
                  </td>
                </tr>
                <tr v-if="checkin.nextCheckinDate">
                  <th scope="row" class="-text-left">Ngày check-in kế tiếp</th>
                  <td>
                    {{
                      new Date(checkin.nextCheckinDate)
                        | dateFormat('DD/MM/YYYY')
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :lg="16">
        <checkin-chart-process
          class="top-checkin"
          v-if="checkin"
          :checkin.sync="checkin.chart"
        />
      </el-col>
    </el-row>
    <checkin-detail v-if="checkin" :checkin.sync="checkin" read-only />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CheckinRepository from '@/repositories/CheckinRepository';
import { notificationConfig } from '@/constants/app.constant';
import CheckinDetail from '@/components/checkin/CheckinDetail.vue';
import CheckinChartProcess from '@/components/checkin/CheckinChartProcess.vue';

@Component({
  name: 'DetailHistoryPage',
  head() {
    return {
      title: 'Chi tiết lịch sử Check-in',
    };
  },
  components: {
    CheckinDetail,
    CheckinChartProcess,
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
    const { data } = await CheckinRepository.getDetailCheckinByCheckinId(
      +this.$route.params.id,
    );
    this.checkin = data;
    this.loading = false;
  }

  private goBack() {
    this.$router.go(-1);
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.height-detail {
  height: 500px;
}
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
