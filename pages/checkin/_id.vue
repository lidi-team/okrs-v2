<template>
  <div v-loading.fullscreen.lock="loading" class="createCheckinPage">
    <el-page-header title="OKRs của tôi" @back="goBack" />
    <h1 class="createCheckinPage__title">Tạo checkin</h1>
    <div class="top-checkin">
      <div class="top-checkin__left">
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
              <tr>
                <th scope="row">Tiến độ gợi ý</th>
                <td>{{ checkin.progressSuggest }} %</td>
              </tr>
              <tr v-if="checkin.checkin.checkinAt">
                <th scope="row">Ngày check-in</th>
                <td>
                  {{
                    new Date(checkin.checkin.checkinAt)
                      | dateFormat('DD/MM/YYYY')
                  }}
                </td>
              </tr>
              <tr v-if="checkin.checkin.nextCheckinDate">
                <th scope="row">Ngày check-in kế tiếp</th>
                <td>
                  {{
                    new Date(checkin.checkin.nextCheckinDate)
                      | dateFormat('DD/MM/YYYY')
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <chart-checkin class="top-checkin" :checkin.sync="checkin" />
    <create-checkin v-if="checkin" :checkin="checkin" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import CheckinRepository from '@/repositories/CheckinRepository';
import { formatDateToDD, initNewDate } from '@/utils/dateParser';
import { notificationConfig } from '@/constants/app.constant';
import CreateCheckin from '@/components/checkin/CreateCheckin.vue';
import ChartCheckin from '@/components/checkin/ChartCheckin.vue';

@Component({
  name: 'CheckinPage',
  head() {
    return {
      title: 'Tạo Check-in',
    };
  },
  components: {
    CreateCheckin,
    ChartCheckin,
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
          confidentLevel: 2,
          keyResult: item,
          plans: '',
          problems: '',
          progress: '',
        };
      });
    }
    console.log('hello', data);
    this.checkin = data;
    this.loading = false;
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
    font-weight: bold;
    margin-bottom: 1.5rem;
    font-size: $unit-5;
    font-style: normal;
    color: #212b36;
    line-height: 28px;
  }
  &__chart {
    width: 100%;
    min-height: 350px;
    font-size: $unit-3;
  }
  &__left {
    padding: $unit-8;
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
