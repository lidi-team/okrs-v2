<template>
  <div v-loading="loadingTab" class="history">
    <el-row :gutter="20" class>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs bạn gửi đi</p>
          <p v-if="!dataExample.sent.length" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="item in data.sent" v-else :key="item.id" class="history-item" @click="detail('feedback', item)">
            <el-avatar :size="40">
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
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs bạn nhận được</p>
          <p v-if="!dataExample.received.length" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="(item, index) in data.received" v-else :key="`receive-${index}`" class="history-item" @click="detail('feedback', item)">
            <el-avatar :size="40">
              <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
            </el-avatar>
            <div class="history-item__content">
              <p class="history-item__title">{{ item.evaluationCriteria.content }}</p>
              <p class="history-item__description">Gửi bởi {{ item.sender.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs toàn công ty</p>
          <p v-if="!dataExample.all.length" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="(item, index) in data.CFRs" v-else :key="`cfrs-${index}`" class="history-item" @click="detail(item.type, item)">
            <el-avatar :size="40">
              <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
            </el-avatar>
            <el-avatar :size="40">
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
import { CfrsRepository } from '@/repositories/CfrsRepository';
import { GetterState, MutationState } from '@/constants/app.enum';
@Component<History>({
  name: 'History',
  async created() {
    await this.getListDataHistory(this.$store.state.cycle.cycle.id);
    this.$store.commit(MutationState.SET_TEMP_CYCLE, this.$store.state.cycle.cycle.id);
    this.$watchAll(['$store.state.cycle.cycleTemp', 'state.amount'], this.onStateChange);
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  },
})
export default class History extends Vue {
  private loadingTab: boolean = false;
  private data: any = [
    { type: 1, items: [] },
    { type: 2, items: [] },
    { type: 3, items: [] },
  ];

  private dataExample: any = {
    // Truyền API kèm User ID - Cycle ID
    sent: [
      {
        id: 1,
        type: 'recognition',
        content: 'Bạn làm rất tốt',
        createdAt: '2020-08-18T11:33:40.898Z',
        evaluationCriteria: {
          id: 1,
          star: 50,
          content: 'Bạn làm việc tốt',
        },
        receiver: {
          fullName: 'Diệu Linh',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          objective: {
            id: 10,
            title: 'Cải thiện sự gắn kết nhân viên nội bộ và sự hài lòng trong công việc',
          },
        },
      },
      {
        id: 1,
        type: 'feedback',
        star: 50,
        content: 'Bạn làm rất tốt',
        createdAt: '2020-08-18T11:33:40.898Z',
        objectives: [
          {
            id: 1,
            title: 'zxczxczxczxc',
            changeValue: 3,
          },
          {
            id: 2,
            title: 'zczxc',
            changeValue: 4,
          },
        ],
        evaluationCriteria: {
          id: 1,
          content: 'Bạn làm việc tốt',
        },
        receiver: {
          fullName: 'Diệu Linh',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          objective: {
            id: 10,
            title: 'Cải thiện sự gắn kết nhân viên nội bộ và sự hài lòng trong công việc',
            changeValue: 7,
          },
        },
      },
    ],
    received: [],
    all: [
      {
        id: 1,
        type: 'recognition',
        star: 50,
        content: 'Bạn làm rất tốt',
        createdAt: '2020-08-18T11:33:40.898Z',
        evaluationCriteria: {
          id: 1,
          content: 'Bạn làm việc tốt',
        },
        sender: {
          fullName: 'Hữu Lợi',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/52c17264e02258faa8e4b9d98d0af3cbb86cf1935d1cddd5633a7cf6fd0df46c1246ec162a28c698ed88230c01d1963300fb566d2f2527c3603e8a67cc85c82a?s=200&d=retro',
        },
        receiver: {
          fullName: 'Diệu Linh',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          objective: {
            id: 10,
            title: 'Cải thiện sự gắn kết nhân viên nội bộ và sự hài lòng trong công việc',
            changeValue: 7,
          },
        },
      },
      {
        id: 1,
        type: 'recognition',
        star: 30,
        content: 'Bạn làm tốt hơn rồi đấy',
        createdAt: '2020-08-18T11:33:40.898Z',
        evaluationCriteria: {
          id: 1,
          content: 'Bạn làm việc tốt',
        },
        sender: {
          id: 1,
          fullName: 'Hữu Lợi',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/52c17264e02258faa8e4b9d98d0af3cbb86cf1935d1cddd5633a7cf6fd0df46c1246ec162a28c698ed88230c01d1963300fb566d2f2527c3603e8a67cc85c82a?s=200&d=retro',
        },
        receiver: {
          id: 2,
          fullName: 'Diệu Linh',
          avatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          gravatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          objective: null,
        },
      },
      {
        id: 1,
        type: 'feedback',
        star: 5,
        content: 'Sếp chỉ dạy em rất tốt',
        createdAt: '2020-08-18T11:33:40.898Z',
        objectives: [
          {
            id: 1,
            title: 'zxczxczxczxc',
            changeValue: 3,
          },
          {
            id: 2,
            title: 'zczxc',
            changeValue: 4,
          },
        ],
        evaluationCriteria: {
          id: 1,
          content: 'Bạn làm việc tốt',
        },
        sender: {
          id: 1,
          fullName: 'Hữu Lợi',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/52c17264e02258faa8e4b9d98d0af3cbb86cf1935d1cddd5633a7cf6fd0df46c1246ec162a28c698ed88230c01d1963300fb566d2f2527c3603e8a67cc85c82a?s=200&d=retro',
        },
        receiver: {
          id: 2,
          fullName: 'Diệu Linh',
          avatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          gravatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
        },
      },
      {
        id: 1,
        type: 'feedback',
        star: 3,
        content: 'Em làm được có 70% tiến đô',
        createdAt: '2020-08-18T11:33:40.898Z',
        evaluationCriteria: {
          id: 1,
          content: 'Nhân viên làm việc tốt',
        },
        sender: {
          id: 1,
          fullName: 'Diệu Linh',
          avatarURL: null,
          gravatarURL:
            'https://gravatar.com/avatar/52c17264e02258faa8e4b9d98d0af3cbb86cf1935d1cddd5633a7cf6fd0df46c1246ec162a28c698ed88230c01d1963300fb566d2f2527c3603e8a67cc85c82a?s=200&d=retro',
        },
        receiver: {
          id: 2,
          fullName: 'Hữu Lợi',
          avatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
          gravatarURL:
            'https://gravatar.com/avatar/882ea16b62f875eaae5eab32de8988b27001a556d40d32e86df208981f94b7e456fd9b0b55f221c3c3b4f0cd1bb723b7d4e8d2a8743c53d2032da5f55ccbb155?s=200&d=retro',
        },
      },
    ],
  };

  private dataDetail: object = {};
  private visibleCreateDialog = false;

  @Watch('$store.state.cycle.cycleTemp')
  private async changeListDataHistory(cycleTemp: number) {
    console.log(cycleTemp);
    this.loadingTab = true;
    await this.getListDataHistory(cycleTemp);
    setTimeout(() => {
      this.loadingTab = false;
    }, 300);
  }

  private async getListDataHistory(cycleId: number, userId: number = this.$store.state.auth.user.id) {
    try {
      const { data } = await CfrsRepository.getHistoryCfrs(userId, cycleId);
      this.data = data.data;
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
    padding: $unit-8;
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }
  }
}
.history-item {
  display: flex;
  flex-direction: row;
  padding: $unit-4 0;
  @include box-shadow;
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
