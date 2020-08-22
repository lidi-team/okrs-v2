<template>
  <div v-loading="loadingAdmin" class="checkin-status">
    <div class="checkin-status__top">
      <span class="checkin-status__title">Tình trạng Check-in</span>
    </div>
    <div class="checkin-status__content">
      <div id="chartCheckin"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themesAnimated);
@Component<CheckinStatus>({
  name: 'CheckinStatus',
  mounted() {
    this.chart = this.initPieChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
})
export default class CheckinStatus extends Vue {
  @Prop(Array) readonly dataCheckin;
  @Prop(Boolean) readonly loadingAdmin!: boolean;
  private initPieChart() {
    const chart = am4core.create('chartCheckin', am4charts.PieChart);

    chart.data = this.dataCheckin;

    chart.data[0].color = am4core.color('#32C8FF');
    chart.data[1].color = am4core.color('#FF0064');
    chart.data[2].color = am4core.color('#FFC832');

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    pieSeries.slices.template.propertyFields.fill = 'color';

    // Disable ticks and labels
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    chart.legend = new am4charts.Legend();
    return chart;
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.checkin-status {
  height: 100%;
  &__top {
    height: 20%;
    padding: 0 $unit-4;
    border-bottom: 1px solid #dfe3e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    font-size: $text-base;
    color: $neutral-primary-4;
    font-style: normal;
    font-weight: 600;
    line-height: $unit-6;
  }
  &__content {
    height: 80%;
  }
}
#chartCheckin {
  width: 100%;
  height: 100%;
  font-size: $text-sm;
}
</style>
