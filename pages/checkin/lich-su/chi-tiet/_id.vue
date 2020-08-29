<template>
  <div v-loading.fullscreen.lock="loading" class="historyDetailPage">
    <el-page-header title="Lịch sử Check-in" @back="goBack" />
    <h1 class="historyDetailPage__title">Chi tiết lịch sử Check-in</h1>
    <div class="top-checkin">
      <el-row>
        <el-col class="top-checkin__left" :sm="24" :lg="10">
          <h2 class="top-checkin__title">Check-in mục tiêu</h2>
          <div v-if="historyDetail" class="top-checkin__content content">
            <table class="properties">
              <tbody>
                <tr>
                  <th scope="row">Mục tiêu</th>
                  <td>{{ historyDetail.objective.title }}</td>
                </tr>
                <tr>
                  <th scope="row">Tiến độ thực hiện</th>
                  <td>{{ historyDetail.progress }} %</td>
                </tr>
                <tr v-if="historyDetail.checkinAt">
                  <th scope="row">Ngày check-in</th>
                  <td>{{ new Date(historyDetail.checkinAt) | dateFormat('DD/MM/YYYY') }}</td>
                </tr>
                <tr v-if="historyDetail.nextCheckinDate">
                  <th scope="row">Ngày check-in kế tiếp</th>
                  <td>{{ new Date(historyDetail.nextCheckinDate) | dateFormat('DD/MM/YYYY') }}</td>
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
    <detail-history v-if="historyDetail" :history-detail="historyDetail">
      <!-- <chart-checkin v-if="historyDetail" slot="chartCheckin" :history-detail="historyDetail" /> -->
    </detail-history>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import CheckinRepository from '@/repositories/CheckinRepository';
import { notificationConfig } from '@/constants/app.constant';
am4core.useTheme(am4themesAnimated);
@Component({
  name: 'DetailHistoryPage',
  head() {
    return {
      title: 'Chi tiết lịch sử Check-in',
    };
  },
  async mounted() {
    await this.getDetail();
    await this.renderChart();
  },
})
export default class DetailHistoryPage extends Vue {
  private loading: boolean = false;
  private historyDetail: any = null;
  private checkinAt: Array<object> = [];

  private async getDetail() {
    this.loading = true;
    await CheckinRepository.getDetailCheckin(+this.$route.params.id)
      .then((result) => {
        this.historyDetail = result.data.data;
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

  private renderChart() {
    this.checkinAt = this.historyDetail.chart.map(function (item: any) {
      return new Date(item.checkinAt).toLocaleDateString('en');
    });

    for (let i = 0; i < this.historyDetail.chart.length; i++) {
      const chartTotal = { checkinAt: '', progress: 0 };
      chartTotal.checkinAt += this.checkinAt[i];
      chartTotal.progress += this.historyDetail.chart[i].progress;

      this.historyDetail.chart[i] = chartTotal;
    }

    const chart = am4core.create('chartCheckin', am4charts.XYChart);
    chart.numberFormatter.numberFormat = "#.#'%'";
    chart.data = this.historyDetail.chart.reverse();

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.dateFormats.setKey('day', 'dd/MM');
    dateAxis.periodChangeDateFormats.setKey('day', 'dd/MM');
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    function createSeries(this: any, field: string | undefined, color: string) {
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = 'checkinAt';
      series.tooltipText = ' [b]{valueY}[/]';
      series.fill = am4core.color(color);
      series.strokeWidth = 2;
      series.minHeight = 500;
      series.responsive.enabled = true;
      series.stroke = am4core.color(color);
      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.fill = am4core.color(color);
      bullet.circle.radius = 4;
      bullet.circle.strokeWidth = 1;

      return series;
    }
    createSeries('progress', '#9C6ADE');

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.logo.disabled = true;
  }

  private goBack() {
    if (this.historyDetail) {
      this.$router.push(`/checkin/lich-su/${this.historyDetail.objective.id}`);
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
