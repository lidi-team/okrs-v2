<template>
  <el-dialog
    :title="dialogTitle(itemData, type)"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    class="detail-history"
  >
    <el-row :gutter="20">
      <el-col :span="7" class="detail-history__attribute">Ngày Check-in</el-col>
      <el-col :span="17" class="detail-history__value">{{
        new Date(itemData.createAt) | dateFormat('DD/MM/YYYY')
      }}</el-col>
    </el-row>
    <!-- Nếu là Recognition -->
    <el-row v-if="itemData.objective" :gutter="20">
      <el-col :span="7" class="detail-history__attribute">Mục tiêu</el-col>
      <el-col :span="17" class="detail-history__value">
        <nuxt-link :to="`/okrs/chi-tiet/${itemData.objective.id}`">
          {{ itemData.objective.title }}
        </nuxt-link>
      </el-col>
    </el-row>
    <!-- Nếu là feedback -->
    <el-row
      v-if="itemData.type === 'feedback' && itemData.checkin.objective.title"
      :gutter="20"
    >
      <el-col :span="7" class="detail-history__attribute">Mục tiêu</el-col>
      <el-col :span="17" class="detail-history__value">
        <a
          target="_blank"
          :href="`${$config.baseURL}/okrs/chi-tiet/${itemData.checkin.objective.id}`"
        >
          {{ itemData.checkin.objective.title }}
        </a>
      </el-col>
    </el-row>
    <div v-if="type === 'sent'">
      <el-row :gutter="20">
        <el-col :span="7" class="detail-history__attribute"
          >Người {{ displayNameCfrs }} {{ itemData.type }}</el-col
        >
        <el-col :span="17" class="detail-history__value">{{
          itemData.receiver.fullName
        }}</el-col>
      </el-row>
    </div>
    <div v-if="type === 'received'">
      <el-row :gutter="20">
        <el-col :span="7" class="detail-history__attribute"
          >Người {{ itemData.type }} tới {{ displayNameCfrs }}</el-col
        >
        <el-col :span="17" class="detail-history__value">{{
          itemData.sender.fullName
        }}</el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="7" class="detail-history__attribute"
        >Nội dung {{ itemData.type }}</el-col
      >
      <el-col :span="17" class="detail-history__value">
        {{ itemData.content }}
      </el-col>
    </el-row>
    <div class="create-feedback-dialog__action">
      <el-button
        class="el-button--white el-button--modal"
        @click="closeDetailDialog"
        >Đóng</el-button
      >
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
@Component<DetailHistory>({
  name: 'DetailHistory',
})
export default class DetailHistory extends Vue {
  @Prop(Object) itemData!: any;
  @Prop(String) type!: String;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false })
  public syncCreateOkrsDialog!: boolean;
  private content: String = '';
  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private closeDetailDialog(): void {
    this.syncCreateOkrsDialog = false;
  }

  private dialogTitle(itemData: any, type: string): String {
    if (type === 'sent') {
      return `${this.upFirst(itemData.type)} đến ${itemData.receiver.fullName}`;
    } else if (type === 'all') {
      return `${this.upFirst(itemData.type)} từ ${
        itemData.sender.fullName
      } đến ${itemData.receiver.fullName}`;
    } else {
      return `${this.upFirst(itemData.type)} bởi ${itemData.sender.fullName}`;
    }
  }

  private upFirst(data: String): String {
    return data ? data.charAt(0).toUpperCase() + data.slice(1) : 'Feedback';
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

  private takeTwoLastNameUser(userName: string): string {
    const arr = userName.split(' ');
    return arr.slice(Math.max(arr.length - 2, 1)).join(' ');
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.detail-history {
  padding: $unit-4;
  &__attribute {
    font-weight: bold;
    padding: $unit-3 0;
    word-break: break-word;
  }
  &__value {
    padding: $unit-3 0;
  }
  &__action {
    margin-top: $unit-4;
    margin-bottom: $unit-1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: -$unit-2;
  }
  .el-dialog__body {
    padding: $unit-4 $unit-5;
  }
}
</style>
