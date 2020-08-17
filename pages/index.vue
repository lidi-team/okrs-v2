<template>
  <div class="dashboard">
    <dashboard-progress-bar />
    <dashboard-star-rank />
    <!-- <div id="chartdiv"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);
@Component<HomePage>({
  name: 'HomePage',
  mounted() {
    this.initPieChart();
  },
})
export default class HomePage extends Vue {
  private initPieChart() {
    const chart = am4core.create('chartdiv', am4charts.PieChart);

    // Add data
    chart.data = [
      {
        country: 'Lithuania',
        litres: 501.9,
      },
      {
        country: 'Czech Republic',
        litres: 301.9,
      },
      {
        country: 'Ireland',
        litres: 201.1,
      },
      {
        country: 'Germany',
        litres: 165.8,
      },
      {
        country: 'Australia',
        litres: 139.9,
      },
      {
        country: 'Austria',
        litres: 128.3,
      },
      {
        country: 'UK',
        litres: 99,
      },
      {
        country: 'Belgium',
        litres: 60,
      },
      {
        country: 'The Netherlands',
        litres: 50,
      },
    ];

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
#chartdiv {
  width: 100%;
  height: 400px;
}
.dashboard {
  color: $neutral-primary-4;
  margin-top: $unit-10;
  margin-right: $unit-5;
}
</style>
