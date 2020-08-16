<template>
  <div class="history">
    <el-row :gutter="20" class>
      <el-col :span="8">
        <div class="history__col">
          <p class="history__col__header">Feedback gửi đi</p>
          <p v-if="data.sent.length === 0" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="item in data.sent" v-else :key="item.id" class="history-item" @click="detail('feedback', item)">
            <el-avatar :size="50">
              <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
            </el-avatar>
            <div class="history-item__content">
              <p class="history-item__title">{{ item.evaluationCriteria.content }}</p>
              <p class="history-item__description">
                Gửi đến {{ item.receiver.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}
              </p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="history__col">
          <p class="history__col__header">Feedback nhận được</p>
          <p v-if="data.received.length === 0" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="(item, index) in data.received" v-else :key="`receive-${index}`" class="history-item" @click="detail('feedback', item)">
            <el-avatar :size="50">
              <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
            </el-avatar>
            <div class="history-item__content">
              <p class="history-item__title">{{ item.evaluationCriteria.content }}</p>
              <p class="history-item__description">Gửi bởi {{ item.sender.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="history__col">
          <p class="history__col__header">CFRs toàn công ty</p>
          <p v-if="data.CFRs.length === 0" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="(item, index) in data.CFRs" v-else :key="`cfrs-${index}`" class="history-item" @click="detail(item.type, item)">
            <el-avatar :size="50">
              <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
            </el-avatar>
            <el-avatar :size="50" style="margin-left: 10px;">
              <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
            </el-avatar>
            <div class="history-item__content">
              <p class="history-item__title">{{ item.evaluationCriteria.content }}</p>
              <p class="history-item__description">
                {{ item.sender.fullName }} đến {{ item.receiver.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}
              </p>
            </div>
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
import { HistoryRepository } from '@/repositories/CfrsRepository';
@Component<History>({
  name: 'History',
  async mounted() {
    const {
      data: { data },
    } = await HistoryRepository.get(3);
    this.data = data;
  },
})
export default class History extends Vue {
  private data: any = {
    sent: [],
    received: [],
    CFRs: [],
  };

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
    console.log(item);
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
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.history {
  color: $neutral-primary-4;
  margin-top: $unit-5;
  filter: drop-shadow(0px 0px 0px rgba(63, 63, 68, 0.05)), drop-shadow(0px 1px 3px rgba(63, 63, 68, 0.15));
  border-radius: $border-radius-base;
  &__col {
    background-color: $white;
    padding: $unit-8;
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4;
      box-shadow: inset 0px -1px 0px #dfe3e8;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }
  }
}
.history-item {
  display: flex;
  flex-direction: row;
  padding: $unit-4 0;
  box-shadow: inset 0px -1px 0px #dfe3e8;
  cursor: pointer;
  &__content {
    margin: 0 $unit-4;
  }
  &__title {
    font-weight: bold;
    font-size: 1.1rem;
  }
  &__description {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
  }
}
</style>
