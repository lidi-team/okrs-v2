<template>
  <div class="chart-container">
    <div :id="id" class="chart" :style="{ height: '100%', width: '100%' }" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { statusCheckin } from '@/constants/app.constant';
import { init } from 'echarts';
import resize from '@/mixins/resize';

@Component<ChartCheckin>({
  name: 'ChartCheckin',
  mixins: [resize],
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
})
export default class ChartCheckin extends Vue {
  private chart: any = null;
  private id: any = 'chart';

  private initChart() {
    this.chart = init(document.getElementById(this.id) as any);
    const xData = (function () {
      const data: Array<String> = [];
      for (let i = 1; i < 13; i++) {
        data.push(i + 'month');
      }
      return data;
    })();
    this.chart.setOption({
      backgroundColor: 'white',
      title: {
        text: 'Tiến độ',
        x: '25',
        top: '30',
        textStyle: {
          color: '#212b36',
          fontSize: '20',
        },
        subtextStyle: {
          color: '#90979c',
          fontSize: '16',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          textStyle: {
            color: '#fff',
          },
        },
      },
      grid: {
        left: '7%',
        right: '7%',
        borderWidth: 0,
        top: 95,
        bottom: 95,
        textStyle: {
          color: '#230051',
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
          data: xData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#90979c',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
          splitArea: {
            show: false,
          },
        },
      ],
      dataZoom: [
        {
          show: true,
          height: 30,
          xAxisIndex: [0],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon:
            'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5',
          },
          textStyle: {
            color: '#fff',
          },
          borderColor: '#90979c',
        },
        {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35,
        },
      ],
      series: [
        {
          name: 'average',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#230051',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : '';
                },
              },
            },
          },
          data: [
            1036,
            3693,
            2962,
            3810,
            2519,
            1915,
            1748,
            4675,
            6209,
            4323,
            2865,
            4298,
          ],
        },
      ],
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.chart-container {
  position: relative;
  width: 100%;
  height: 500px;
}
</style>
