<template>
  <el-col :md="8" :lg="8">
    <div class="history__col">
      <p class="history__col__header">CFRs bạn gửi đi</p>
      <p v-if="!data.length" class="history__col__empty">Không có dữ liệu</p>
      <div v-for="item in data.sent" v-else :key="item.id" class="history-item" @click="detail('feedback', item)">
        <el-avatar :size="40">
          <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
        </el-avatar>
        <div class="history-item__content">
          <p class="history-item__title">{{ item.evaluationCriteria.content }}</p>
          <p class="history-item__description">Gửi đến {{ item.receiver.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
        </div>
      </div>
    </div>
  </el-col>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ItemHistory>({ name: 'ItemHistory' })
export default class ItemHistory extends Vue {}
</script>
<style lang="scss" scoped></style>
