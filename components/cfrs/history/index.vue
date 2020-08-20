<template>
  <div v-loading="loadingTab" class="history">
    <el-row :gutter="20" class>
      <el-col v-loading="loadingPersonalTab" :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs {{ displayNameCfrs }} gửi đi</p>
          <p v-if="!historyItems.sent.length" class="history__col__empty">Chưa có CFRs</p>
          <div v-for="item in historyItems.sent" v-else :key="`sent-${item.id}`" class="history-item" @click="detail('feedback', item)">
            <div class="history-item__left">
              <div class="item__left--icon">
                <div :class="['icon--type', isFeedback(item.type)]">
                  <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                </div>
                <div>
                  <el-avatar :size="30">
                    <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
                  </el-avatar>
                </div>
              </div>
              <div class="item__left--content">
                <p>
                  ({{ isLeaderToMember(item.evaluationCriteria.type) }}) <span class="content__title"> {{ item.evaluationCriteria.content }}</span>
                </p>
                <p class="content--description">Gửi đến {{ item.receiver.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
              </div>
            </div>
            <div class="item__right">
              <span>{{ item.evaluationCriteria.numberOfStar }}</span>
              <icon-star-dashboard />
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-loading="loadingPersonalTab" :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs {{ displayNameCfrs }} nhận được</p>
          <p v-if="!historyItems.received.length" class="history__col__empty">Chưa có CFRs</p>
          <div v-for="item in historyItems.received" v-else :key="`received-${item.id}`" class="history-item" @click="detail('feedback', item)">
            <div class="item__left">
              <div class="item__left--icon">
                <div :class="['icon--type', isFeedback(item.type)]">
                  <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                </div>
                <div>
                  <el-avatar :size="30">
                    <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
                  </el-avatar>
                </div>
              </div>
              <div class="item__left--content">
                <p>
                  ({{ isLeaderToMember(item.evaluationCriteria.type) }}) <span class="content__title"> {{ item.evaluationCriteria.content }}</span>
                </p>
                <p class="content--description">Gửi bởi {{ item.sender.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
              </div>
            </div>
            <div class="item__right">
              <span>{{ item.evaluationCriteria.numberOfStar }}</span>
              <icon-star-dashboard />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs toàn công ty</p>
          <p v-if="!historyItems.all.length" class="history__col__empty">Chưa có CFRs</p>
          <div v-for="item in historyItems.all" v-else :key="item.id" class="history-item" @click="detail(item.type, item)">
            <div class="item__left">
              <div class="item__left--icon">
                <div :class="['icon__type', isFeedback(item.type)]">
                  <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                </div>
                <div class="icon__avatar">
                  <el-avatar :size="30">
                    <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
                  </el-avatar>
                  <el-avatar :size="30">
                    <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
                  </el-avatar>
                </div>
              </div>
              <div class="item__left--content">
                <p>
                  ({{ isLeaderToMember(item.evaluationCriteria.type) }}) <span class="content__title"> {{ item.evaluationCriteria.content }}</span>
                </p>
                <p class="content__description">
                  {{ takeTwoLastNameUser(item.sender.fullName) }} đến {{ takeTwoLastNameUser(item.receiver.fullName) }} -
                  {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}
                </p>
              </div>
            </div>
            <div class="item__right">
              <span>{{ item.evaluationCriteria.numberOfStar }}</span>
              <icon-star-dashboard />
            </div>
          </div>
        </div>
        <!-- Phân trang -->
        <!-- <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" /> -->
      </el-col>
    </el-row>
    <cfrs-detail-history :visible-dialog.sync="visibleCreateDialog" :data-detail="dataDetail" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CreateFeedback from './Create.vue';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';
import { CfrsRepository } from '@/repositories/CfrsRepository';
@Component<History>({
  name: 'History',
  components: {
    IconStarDashboard,
  },
  created() {
    this.getListDataHistory(this.$store.state.cycle.cycle.id);
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 1000);
  },
})
export default class History extends Vue {
  private loadingTab: boolean = false;
  private loadingPersonalTab: boolean = false;
  private historyItems: any = {
    sent: [],
    received: [],
    all: [],
  };

  private cycleTempId: number = this.$store.state.cycle.cycle.id;
  private dataDetail: object = {};
  private visibleCreateDialog = false;

  @Watch('$store.state.cycle.cycleTemp')
  private async changeListDataOnCycle(cycleTemp: number) {
    this.loadingTab = true;
    await this.getListDataHistory(cycleTemp);
    setTimeout(() => {
      this.loadingTab = false;
    }, 300);
  }

  @Watch('$store.state.user.tempUser.id')
  private async changeListDataOnUser(tempUserId: number) {
    this.loadingPersonalTab = true;
    await this.getListDataHistory(this.$store.state.cycle.cycleTemp, tempUserId);
    setTimeout(() => {
      this.loadingPersonalTab = false;
    }, 300);
  }

  private async getListDataHistory(cycleId: number, userId: number = this.$store.state.auth.user.id) {
    try {
      const { data } = await CfrsRepository.getHistoryCfrs(cycleId, userId);
      this.historyItems = Object.freeze(data.data);
    } catch (error) {}
  }

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
      content: item.content || '',
      criteria: item.evaluationCriteria.content || '',
      type: type || 'Feedback',
    };
    this.visibleCreateDialog = true;
  }

  private isFeedback(type: string): String | null {
    return type !== 'recognition' ? 'is-feedback' : null;
  }

  private get displayNameCfrs(): String {
    if (!this.$store.state.user.tempUser) {
      return 'bạn';
    }
    if (this.$store.state.user.tempUser.id !== this.$store.state.auth.user.id) {
      return this.takeTwoLastNameUser(this.$store.state.user.tempUser.fullName);
    } else {
      return 'bạn';
    }
  }

  private isLeaderToMember(type: string): string {
    if (type === 'LEADER_TO_MEMBER') {
      return 'Leader đánh giá thành viên';
    } else {
      return 'Thành viên đánh giá Leader';
    }
  }

  private takeTwoLastNameUser(userName: string): string {
    const arr = userName.split(' ');
    return arr.slice(Math.max(arr.length - 2, 1)).join(' ');
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.history {
  color: $neutral-primary-4;
  margin-top: $unit-5;
  @include drop-shadow;
  border-radius: $border-radius-base;
  &__col {
    background-color: $white;
    padding: $unit-6 0 $unit-4;
    border-radius: $border-radius-base;
    @include box-shadow;
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
      padding-left: $unit-4;
    }
  }
}
.history-item {
  display: flex;
  flex-direction: row;
  place-content: center space-between;
  padding: $unit-2 0;
  @include box-shadow;
  cursor: pointer;
  .item__left {
    display: flex;
    padding-left: $unit-4;
    &--icon {
      display: flex;
      flex-direction: column;
      .icon__type {
        color: $white;
        background-color: $purple-primary-3;
        font-weight: $font-weight-bold;
        display: flex;
        place-content: center;
        align-self: center;
        @include circle($unit-8);
        text-align: center;
        padding-top: 0.15rem;
        span {
          align-self: center;
          font-size: $unit-4;
        }
      }
      .is-feedback {
        background-color: $orange-primary-1;
      }
      .icon__avatar {
      }
    }
    &--content {
      display: flex;
      flex-direction: column;
      align-self: center;
      margin-left: $unit-4;
      p {
        @include text-ellipsis(1);
        display: flex;
      }
      .content__title {
        padding-left: $unit-1;
        font-weight: bold;
        @include text-ellipsis(1);
      }
      .content__description {
        @include text-ellipsis(1);
        margin: unset;
        white-space: normal;
      }
    }
  }
  .item__right {
    display: flex;
    place-content: center;
    align-self: center;
    padding-right: $unit-4;
    font-weight: $font-weight-medium;
    font-size: $unit-5;
    svg {
      display: flex;
      align-self: center;
    }
  }
}
</style>
