<template>
  <div>
    <el-page-header title="Quay lại" @back="goBack" />
    <h1 class="-title-1">Chi tiết cập nhật tiến độ</h1>
    <el-row :gutter="32">
      <el-col :sm="24" :lg="8">
        <div class="box-wrap height-detail">
          <h2 class="-title-2 -border-header">Thông tin chi tiết</h2>
          <div class="top-checkin__content">
            <div v-if="checkin">
              <div class="-mt-3 -mb-2 -display-flex">
                <span class="-w-19 -font-bold"> Mục tiêu: </span>
                <span>
                  {{ checkin.objective.title }}
                </span>
              </div>
              <div class="-mb-2 -display-flex">
                <span class="-w-19 -font-bold"> Trạng thái: </span>
                <span>
                  {{ checkin.checkin.status }}
                </span>
              </div>
              <div class="-mb-2 -display-flex">
                <span class="-w-19 -font-bold"> Tiến độ: </span>
                <span>
                  {{ checkin.progress }}
                </span>
              </div>
              <div class="-mb-2 -display-flex">
                <span class="-w-19 -font-bold">Ngày check-in gần nhất: </span>
                <span>
                  {{
                    new Date(checkin.checkin.checkinAt)
                      | dateFormat('DD/MM/YYYY')
                  }}
                </span>
              </div>
              <div class="-mb-2 -display-flex">
                <span class="-w-19 -font-bold">Ngày check-in tiếp theo: </span>
                <span>
                  {{
                    new Date(checkin.checkin.nextCheckinDate)
                      | dateFormat('DD/MM/YYYY')
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :lg="16">
        <checkin-detail-chart
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
import CheckinDetail from '@/components/Checkins/CheckinDetail/CheckinDetailIndex.vue';
import CheckinDetailChart from '@/components/Checkins/CheckinDetail/CheckinDetailChart.vue';

@Component({
  head() {
    return {
      title: 'Chi tiết lịch sử cập nhật tiến độ',
    };
  },
  components: {
    CheckinDetail,
    CheckinDetailChart,
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
}
</style>
