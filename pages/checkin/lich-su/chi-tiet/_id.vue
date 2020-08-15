<template>
  <div v-loading.fullscreen.lock="loading" class="historyDetailPage">
    <h1 class="historyDetailPage__title">Chi tiết lịch sử check-in</h1>
    <detail-history v-if="historyDetail" :history-detail="historyDetail">
      <chart-checkin v-if="historyDetail" slot="chartCheckin" :history-detail="historyDetail" />
    </detail-history>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CheckinRepository from '@/repositories/CheckinRepository';

@Component({
  name: 'DetailHistoryPage',
  created() {
    this.getList();
  },
})
export default class DetailHistoryPage extends Vue {
  private loading: boolean = false;
  private historyDetail: any = null;

  private async getList() {
    this.loading = true;
    const res = await CheckinRepository.getHistoryDetail(this.$route.params.id);
    this.historyDetail = res.data.data;
    this.loading = false;
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.historyDetailPage {
  padding: $unit-10 $unit-8 0 $unit-10;
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
  &__content {
    background-color: $white;
    padding: $unit-8;
  }
}
</style>
