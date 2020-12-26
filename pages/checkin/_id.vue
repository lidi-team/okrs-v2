<template>
  <div v-loading.fullscreen.lock="loading" class="-mb-5">
    <el-page-header title="Quay lại" @back="goBack" />
    <h1 class="-title-1">Tạo checkin</h1>
    <div class="top-checkin box-wrap">
      <h2 class="-title-2">Chi tiết check-in</h2>
      <div v-if="checkin" class="content">
        <el-row>
          <el-col :span="6">
            <p class="-mb-2 -mt-2 label">Mục tiêu:</p>
          </el-col>
          <el-col :span="18">
            <p class="-font-bold -text-italic -mb-2 -mt-2 value">{{ checkin.objective.title }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <p class="-mb-2 label">Trạng thái:</p>
          </el-col>
          <el-col :span="18">
            <p class="-mb-2 value">Chưa check-in</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <p class="-mb-2 label">Tiến độ thực hiện:</p>
          </el-col>
          <el-col :span="18">
            <p class="-mb-2 value">{{checkin.objective.progress}}%</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <p class="-mb-2 label">Tiến độ gợi ý:</p>
          </el-col>
          <el-col :span="18">
            <p class="-mb-2 value">{{ checkin.objective.progressSuggest | round }}%</p>
          </el-col>
        </el-row>
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
}
.label {
  font-size: 14px;
  color: #606266;
  line-height: 23px;
}
.value {
  font-size: 14px;
  line-height: 23px;
}
</style>
