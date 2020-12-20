  
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { init, registerTheme } from 'echarts'
require('echarts/theme/macarons')
import resize from '@/mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    checkinChart: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    registerTheme('macarons', {
      color: [
        "#32C8FF",
        "#FF106E",
        "#FFC832",
      ]})
  },
  watch: {
    loading: function(value) {
      if(value === false) {
        this.initChart()
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          textStyle: {
            color: 'db2777',
          },
          data: ['Đang chờ duyệt', 'Đang lưu tạm', 'Đã được review']
        },
        series: [
          {
            name: 'TÌNH TRẠNG CẬP NHẬT TIẾN ĐỘ',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.checkinChart,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>