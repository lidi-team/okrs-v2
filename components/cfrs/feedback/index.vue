<template>
  <div class="feedback">
    <el-row :gutter="20" class>
      <el-col v-show="data.list1.list" :span="12">
        <div class="feedback__col">
          <p class="feedback__col__header">{{ data.list1.name }}</p>
          <div v-for="item in data.list1.list" :key="item.id" class="cfr">
            <div class="cfr__left" @click="viewDetail(item.id)">
              <el-avatar :size="50">
                <img :src="item.objective.user.avatarUrl ? item.objective.user.avatarUrl : item.objective.user.gravatarURL" alt="avatar" />
              </el-avatar>
              <div class="cfr__left__content">
                <p class="cfr__left__title">{{ item.objective.title }}</p>
                <p class="cfr__left__description">{{ item.objective.user.fullName }} - {{ new Date(item.checkinAt) | dateFormat('DD/MM/YYYY') }}</p>
              </div>
            </div>
            <div class="cfr__right">
              <el-button class="el-button el-button--purple el-button-medium" @click="showDialog(item.id)">Tạo Feedback</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-show="data.list2.list" :span="12">
        <div class="feedback__col">
          <p class="feedback__col__header">{{ data.list2.name }}</p>
          <div v-for="item in data.list2.list" :key="item.id" class="cfr">
            <div class="cfr__left" @click="viewDetail(item.id)">
              <el-avatar :size="50">
                <img :src="item.objective.user.avatarUrl ? item.objective.user.avatarUrl : item.objective.user.gravatarURL" alt="avatar" />
              </el-avatar>
              <div class="cfr__left__content">
                <p class="cfr__left__title">{{ item.objective.title }}</p>
                <p class="cfr__left__description">{{ item.objective.user.fullName }} - {{ new Date(item.checkinAt) | dateFormat('DD/MM/YYYY') }}</p>
              </div>
            </div>
            <div class="cfr__right">
              <el-button class="el-button el-button--purple el-button-medium" @click="showDialog(item.id)">Tạo Feedback</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <cfrs-create-feedback :visible-dialog.sync="visibleCreateDialog" :data-feedback="dataFeedback" />
    <cfrs-detail-feedback :visible-dialog.sync="visibleDetailDialog" :detail-id="detailId" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CreateFeedback from './Create.vue';
import { CfrsRepository } from '@/repositories/CfrsRepository';
@Component<Feedback>({
  name: 'Feedback',
  async mounted() {
    const {
      data: { data },
    } = await CfrsRepository.get();
    this.data = data;
  },
})
export default class Feedback extends Vue {
  private data: any = {
    list1: [],
    list2: [],
  };

  private dataFeedback: any = {
    objective: {
      id: 0,
      name: '',
      cycle: {
        id: 0,
        name: '',
      },
      user: {
        id: 0,
        fullName: '',
      },
    },
  };

  private visibleCreateDialog: Boolean = false;
  private visibleDetailDialog: Boolean = false;
  private detailId: Number = 0;
  private showDialog(id: Number): void {
    this.dataFeedback = this.data.list1.list.concat(this.data.list2.list).find((item) => item.id === id);
    this.visibleCreateDialog = true;
  }

  private viewDetail(id: Number): void {
    this.detailId = id;
    this.visibleDetailDialog = true;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.feedback {
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
      margin-bottom: $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
  }
}
.cfr {
  display: flex;
  flex-direction: row;
  padding: $unit-4 0;
  @include box-shadow;
  justify-content: space-between;
  &__left {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    &__content {
      margin: 0 $unit-4;
    }
    &__title {
      font-weight: bold;
      font-size: 1.1rem;
      @include text-ellipsis(1);
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
}
</style>
