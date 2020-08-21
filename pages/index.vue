<template>
  <div v-if="user" class="dashboard">
    <el-select v-model="idCycle" no-match-text="Không tìm thấy chu kỳ" filterable placeholder="Chọn chu kỳ" @change="handleSelectCycle(idCycle)">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <dashboard-progress-bar :loading="loading" :data-okrs-progress="dataOkrsProgress" />
    <el-row :gutter="10">
      <el-col :sm="24" :md="8">
        <dashboard-okrs-status :data-progress="dataProgress" :loading-admin="loadingAdmin" />
      </el-col>
      <el-col :sm="24" :md="8">
        <dashboard-checkin-status :data-checkin="dataCheckin" :loading-admin="loadingAdmin" />
      </el-col>
      <el-col :sm="24" :md="8">
        <dashboard-cfr-status :data-cfr="dataCfr" :loading-admin="loadingAdmin" />
      </el-col>
    </el-row>
    <dashboard-star-rank :loading="loading" :data-star-in-come="dataStarInCome" :data-star-out-come="dataStarOutCome" />
    <!-- <div id="chartdiv"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import CycleRepository from '@/repositories/CycleRepository';
import DashboardRepository from '@/repositories/DashboardRepository';
import { GetterState } from '@/constants/app.enum';
import { SelectOptionDTO } from '@/constants/app.interface';
am4core.useTheme(am4themesAnimated);
@Component<HomePage>({
  name: 'HomePage',
  async created() {
    await this.getAllCycles();
    this.getDataAdmin();
    await this.getData();
  },
  mounted() {
    this.initPieChart();
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class HomePage extends Vue {
  private idCycle: number = this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id;
  private loading: boolean = false;
  private loadingAdmin: boolean = false;
  private options: Array<any> = [];
  private initPieChart() {
    const chart = am4core.create('chartdiv', am4charts.PieChart);

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

  private dataStarInCome: Array<object> = [];
  private dataStarOutCome: Array<object> = [];
  private dataOkrsProgress: object = {};
  private dataProgress: Array<object> = [];
  private dataCheckin: Array<object> = [];
  private dataCfr: Array<object> = [];

  private params = {
    cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
  };

  private async getDataAdmin() {
    this.loadingAdmin = true;
    await Promise.all([DashboardRepository.getOKRsStatus(), DashboardRepository.getCheckinStatus(), DashboardRepository.getCfrStatus()])
      .then((result) => {
        this.dataProgress = result[0].data.data;
        this.dataCheckin = result[1].data.data;
        this.dataCfr = result[2].data.data;
        setTimeout(() => {
          this.loadingAdmin = false;
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    await CycleRepository.get({ page: 1, limit: 8 })
      .then((result) => {
        this.options = result.data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
            value: item.id,
            startDate: item.startDate,
            endDate: item.endDate,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @Watch('$route.query')
  private async getData() {
    this.loading = true;
    await Promise.all([
      DashboardRepository.getTopIncome(this.params.cycleId, 1),
      DashboardRepository.getTopIncome(this.params.cycleId, 2),
      DashboardRepository.getOKRsProgress(this.params),
    ])
      .then((result) => {
        const tempCycle = this.options.find((item) => item.id === Number(this.params.cycleId));
        this.dataOkrsProgress = Object.assign(
          {},
          {
            startDate: tempCycle.startDate,
            endDate: tempCycle.endDate,
          },
        );
        this.dataStarInCome = result[0].data.data;
        this.dataStarOutCome = result[1].data.data;
        this.dataOkrsProgress = Object.assign(this.dataOkrsProgress, result[2].data.data);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private handleSelectCycle(idCycle) {
    this.params.cycleId = idCycle;
    this.$router.push(`?cycleId=${idCycle}`);
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
