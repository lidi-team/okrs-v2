<template>
  <div>
    <el-page-header title="Quay lại" @back="goBack" />
    <h1 class="-title-1">Chi tiết Check-in</h1>
    <el-row :gutter="32">
      <el-col :sm="24" :lg="8">
        <div class="box-wrap height-detail">
          <h2 class="-title-2 -border-header">Thông tin chi tiết</h2>
          <div v-if="checkin">
            <el-row>
              <el-col :span="8">
                <p class="-mt-2 -mb-2 label">Mục tiêu:</p>
              </el-col>
              <el-col :span="16">
                <p class="-mt-2 -mb-2 -font-bold -text-italic value">
                  {{ checkin.objective.title }}
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p class="-mb-2 label">Trạng thái:</p>
              </el-col>
              <el-col :span="16">
                <p class="-mb-2 value">{{ checkin.checkin.status }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p class="-mb-2 label">Tiến độ:</p>
              </el-col>
              <el-col :span="16">
                <p class="-mb-2 value">{{ checkin.progress }}%</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p class="-mb-2 label">Ngày check-in gần nhất:</p>
              </el-col>
              <el-col :span="16">
                <p class="-mb-2 value">
                  {{
                    new Date(checkin.checkin.checkinAt)
                      | dateFormat('DD/MM/YYYY')
                  }}
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p class="-mb-2 label">Ngày check-in kế tiếp:</p>
              </el-col>
              <el-col :span="16">
                <p class="-mb-2 value">
                  {{
                    new Date(checkin.checkin.nextCheckinDate)
                      | dateFormat('DD/MM/YYYY')
                  }}
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p class="-mb-2 label">Người review:</p>
              </el-col>
              <el-col :span="16">
                <p class="-mb-2 value">{{ checkin.checkin.reviewer }}</p>
              </el-col>
            </el-row>
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
import CheckinDetail from '@/components/Checkin/CheckinDetail/CheckinDetailIndex.vue';
import CheckinDetailChart from '@/components/Checkin/CheckinDetail/CheckinDetailChart.vue';

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
.height-detail {
  height: 500px;
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
