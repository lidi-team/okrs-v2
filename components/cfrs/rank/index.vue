<template>
  <div v-loading="loadingTab" class="rank">
    <el-row :gutter="20" class>
      <el-col :span="12">
        <div class="rank__col">
          <p class="rank__col__header">BXH chu kỳ hiện tại</p>
          <p v-if="dataCurrent.length === 0" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="item in dataCurrent" :key="item.id" class="rank-item">
            <div class="rank-item__left">
              <el-avatar :size="50">
                <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
              </el-avatar>
              <p class="rank-item__title">{{ item.user_fullName }}</p>
            </div>
            <div class="rank-item__right">{{ item.sum }} <icon-star style="margin-left: 5px;" /></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="rank__col">
          <p class="rank__col__header">BXH lũy kế</p>
          <p v-if="dataCycle.length === 0" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="item in dataCycle" :key="item.id" class="rank-item">
            <div class="rank-item__left">
              <el-avatar :size="50">
                <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
              </el-avatar>
              <p class="rank-item__title">{{ item.user_fullName }}</p>
            </div>
            <div class="rank-item__right">{{ item.sum }}<icon-star style="margin-left: 5px;" /></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <cfrs-detail-history :visible-dialog.sync="visibleCreateDialog" :data-detail="dataDetail" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CreateFeedback from './Create.vue';
import { CfrsRepository } from '@/repositories/CfrsRepository';
import IconStar from '@/assets/images/admin/star.svg';
@Component<Rank>({
  name: 'Rank',
  components: {
    IconStar,
  },
  async created() {
    const [rankingAllCycle, rankingCurrentCycle] = await Promise.all([CfrsRepository.getRankingCfrs('all'), CfrsRepository.getRankingCfrs('curent')]);
    this.dataCycle = rankingAllCycle.data.data;
    this.dataCurrent = rankingCurrentCycle.data.data;
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  },
})
export default class Rank extends Vue {
  private loadingTab: boolean = false;
  private dataCycle: any = [];
  private dataCurrent: any = [];
  private dataDetail: object = {};
  private visibleCreateDialog = false;
  private detail(type: String, item: any): void {
    let sender = this.$store.state.auth.user.fullName;
    let receiver = this.$store.state.auth.user.fullName;
    if (item.sender) {
      sender = item.sender.fullName;
    }
    if (item.receiver) {
      receiver = item.receiver.fullName;
    }
    this.dataDetail = {
      sender,
      receiver,
      objective: item.objective ? item.objective.title : item.checkin.objective.title,
      createdAt: item.createdAt || new Date(),
      content: item.evaluationCriteria.content || '',
      type: type || 'Feedback',
    };
    this.visibleCreateDialog = true;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.rank {
  color: $neutral-primary-4;
  margin-top: $unit-5;
  @include drop-shadow;
  border-radius: $border-radius-base;
  &__col {
    background-color: $white;
    padding: $unit-8;
    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
  }
}
.rank-item {
  display: flex;
  flex-direction: row;
  padding: $unit-4 0;
  @include box-shadow;
  justify-content: space-between;
  &__left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &__title {
    margin-left: $unit-4;
    font-weight: bold;
    font-size: 1.1rem;
  }
  &__right {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;
  }
}
</style>
