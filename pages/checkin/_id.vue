<template>
  <div v-loading.fullscreen.lock="loading" class="createCheckinPage">
    <h1 class="createCheckinPage__title">Tạo checkin</h1>
    <create-checkin v-if="checkin" :checkin.sync="checkin" :is-new="isNew">
      <chart-okrs v-if="checkin" slot="chartOKRs" :checkin.sync="checkin" />
    </create-checkin>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CheckinRepository from '@/repositories/CheckinRepository';
import { formatDateToDD } from '@/utils/dateParser';
@Component({
  name: 'CheckinPage',
  created() {
    this.getCheckin();
  },
})
export default class CheckinPage extends Vue {
  private loading: boolean = false;
  private checkin: any = null;
  private isNew: boolean = false;

  private async getCheckin() {
    this.loading = true;
    await CheckinRepository.getDetail(this.$route.params.id).then((res) => {
      if (res.data.data.checkinDetail.length === 0) {
        this.isNew = true;
        res.data.data = Object.assign(res.data.data, {
          confidentLevel: 3,
          status: 'Draft',
          checkinAt: formatDateToDD(res.data.data.checkin.checkinAt),
          nextCheckinDate: formatDateToDD(res.data.data.checkin.nextCheckinDate),
        });
        for (let index = 0; index < res.data.data.keyResults.length; index++) {
          res.data.data.checkinDetail.push({
            valueObtained: 0,
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
          checkinAt: formatDateToDD(res.data.data.checkin.checkinAt),
          nextCheckinDate: formatDateToDD(res.data.data.checkin.nextCheckinDate),
        });
      }
      this.checkin = res.data.data;
      this.loading = false;
    });
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.createCheckinPage {
  padding: $unit-10 $unit-8 0 $unit-10;
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
}
</style>
