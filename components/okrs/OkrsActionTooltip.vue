<template>
  <el-tooltip class="okrs-tooltip" content="Hành động" placement="right-start" effect="dark">
    <el-popover placement="top" trigger="click">
      <div class="okrs-tooltip__popover">
        <p @click="moveToDetailOkrsPage">Xem chi tiết</p>
        <p @click="openUpdateDialog">Cập nhật</p>
        <p @click="openAlignDialog">Liên kết</p>
        <p @click="handleDeleteOKrs">Xóa</p>
      </div>
      <icon-setting slot="reference" />
    </el-popover>
  </el-tooltip>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Notification } from 'element-ui';
import IconSetting from '@/assets/images/okrs/setting.svg';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import OkrRepository from '@/repositories/OkrsRepository';
@Component<OkrsActionTooltip>({
  name: 'OkrsActionTooltip',
  components: {
    IconSetting,
  },
})
export default class OkrsActionTooltip extends Vue {
  @PropSync('visibleUpdateDialog', { type: Boolean, required: true, default: false }) private syncVisibleUpdateDialog!: boolean;
  @PropSync('visibleAlignDialog', { type: Boolean, required: true, default: false }) private syncVisibleAlignDialog!: boolean;
  @PropSync('okrsId', { type: Number, required: true }) private syncOkrsId!: number;

  private moveToDetailOkrsPage() {
    this.$router.push(`/OKRs/chi-tiet/${this.syncOkrsId}`);
  }

  private openUpdateDialog() {
    this.syncVisibleUpdateDialog = true;
  }

  private openAlignDialog() {
    this.syncVisibleAlignDialog = true;
  }

  private handleDeleteOKrs(id: number) {
    this.$confirm('Bạn có chắc chắn muốn xóa mục tiêu này?', {
      ...confirmWarningConfig,
    }).then(async () => {
      try {
        await OkrRepository.deleteOkrs(+this.syncOkrsId).then((res: any) => {
          Notification.success({
            ...notificationConfig,
            message: 'Xóa OKRs thành công',
          });
        });
        // Reaload page
      } catch (error) {}
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-tooltip {
  margin-left: $unit-10;
  svg {
    &:hover {
      cursor: pointer;
    }
  }
  &__popover {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    place-content: center;
    text-align: center;
    p {
      padding: $unit-2;
      border-bottom: 1px solid $purple-primary-1;
      &:last-child {
        border-bottom: unset;
      }
      &:hover {
        background-color: $purple-primary-1;
      }
    }
  }
}
.el-popover {
  min-width: 120px !important;
  padding: unset !important;
}
</style>
