<template>
  <div v-loading.fullscreen.lock="loading" class="createCheckinPage">
    <el-page-header title="OKRs công ty" @back="goBack" />
    <h1 class="createCheckinPage__title">Tạo checkin</h1>
    <div class="top-checkin">
      <el-row>
        <el-col class="top-checkin__left" :sm="24" :lg="10">
          <h2 class="top-checkin__title">Check-in mục tiêu</h2>
          <div v-if="checkin" class="top-checkin__content content">
            <table class="properties">
              <tbody>
                <tr>
                  <th scope="row">Mục tiêu</th>
                  <td>{{ checkin.title }}</td>
                </tr>
                <tr>
                  <th scope="row">Tiến độ thực hiện</th>
                  <td>{{ checkin.progress }} %</td>
                </tr>
                <tr v-if="checkin.checkin.checkinAt">
                  <th scope="row">Ngày check-in</th>
                  <td>{{ new Date(checkin.checkin.checkinAt) | dateFormat('DD/MM/YYYY') }}</td>
                </tr>
                <tr v-if="checkin.checkin.nextCheckinDate">
                  <th scope="row">Ngày check-in kế tiếp</th>
                  <td>{{ new Date(checkin.checkin.nextCheckinDate) | dateFormat('DD/MM/YYYY') }}</td>
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
    <create-checkin v-if="checkin" :checkin.sync="checkin" :is-new="isNew">
      <!-- <chart-okrs v-if="checkin" slot="chartOKRs" :checkin.sync="checkin" /> -->
    </create-checkin>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import CheckinRepository from '@/repositories/CheckinRepository';
import { formatDateToDD, initNewDate } from '@/utils/dateParser';
import { notificationConfig, statusCheckin } from '@/constants/app.constant';
am4core.useTheme(am4themesAnimated);
@Component({
  name: 'CheckinPage',
  head() {
    return {
      title: 'Tạo Check-in công ty',
    };
  },
  async mounted() {
    await this.getCheckin();
    await this.renderChart();
  },
})
export default class CheckinPage extends Vue {
  private loading: boolean = false;
  private checkin: any = null;
  private checkinAt: Array<object> = [];
  private isNew: boolean = false;
  private goBack() {
    this.$router.push('/checkin?tab=checkin-company');
  }

  private async getCheckin() {
    this.loading = true;
    await CheckinRepository.getDetail(+this.$route.params.id)
      .then((res) => {
        if (res.data.data.checkinDetail.length === 0) {
          this.isNew = true;
          res.data.data = Object.assign(res.data.data, {
            confidentLevel: 3,
            status: 'Draft',
            isCompleted: false,
            checkinAt: formatDateToDD(res.data.data.checkin.checkinAt),
            nextCheckinDate: res.data.data.checkin.nextCheckinDate ? formatDateToDD(res.data.data.checkin.nextCheckinDate) : initNewDate(),
          });
          for (let index = 0; index < res.data.data.keyResults.length; index++) {
            res.data.data.checkinDetail.push({
              valueObtained: res.data.data.keyResults[index].valueObtained,
              confidentLevel: 2,
              progress: '',
              problems: '',
              plans: '',
              keyResult: {
                id: res.data.data.keyResults[index].id,
                targetValue: res.data.data.keyResults[index].targetValue,
                content: res.data.data.keyResults[index].content,
              },
            });
          }
        } else {
          res.data.data = Object.assign(res.data.data, {
            confidentLevel: res.data.data.checkin.confidentLevel,
            status: res.data.data.checkin.status,
            isCompleted: false,
            checkinAt: formatDateToDD(res.data.data.checkin.checkinAt),
            nextCheckinDate: formatDateToDD(res.data.data.checkin.nextCheckinDate),
          });
        }
        this.checkin = res.data.data;
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
    this.checkinAt = this.checkin.chart.map(function (item: any) {
      return new Date(item.checkinAt).toLocaleDateString('en');
    });

    for (let i = 0; i < this.checkin.chart.length; i++) {
      const chartTotal = { checkinAt: '', progress: 0 };
      chartTotal.checkinAt += this.checkinAt[i];
      chartTotal.progress += this.checkin.chart[i].progress;

      this.checkin.chart[i] = chartTotal;
    }

    const chart = am4core.create('chartCheckin', am4charts.XYChart);
    chart.numberFormatter.numberFormat = "#.#'%'";
    chart.data = this.checkin.chart.reverse();

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
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.createCheckinPage {
  padding-bottom: $unit-8;
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
