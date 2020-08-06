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
import IconSetting from '@/assets/images/okrs/setting.svg';
@Component<OkrsActionTooltip>({
  name: 'OkrsActionTooltip',
  components: {
    IconSetting,
  },
})
export default class OkrsActionTooltip extends Vue {
  @PropSync('visibleUpdateDialog', { type: Boolean, required: true, default: false }) private syncVisibleUpdateDialog!: boolean;
  @PropSync('visibleAlignDialog', { type: Boolean, required: true, default: false }) private syncVisibleAlignDialog!: boolean;

  private moveToDetailOkrsPage(id: number) {
    this.$router.push(`/OKRs/chi-tiet/${id}`);
  }

  private openUpdateDialog() {
    this.syncVisibleUpdateDialog = true;
  }

  private openAlignDialog() {
    this.syncVisibleAlignDialog = true;
  }

  private handleDeleteOKrs(id: number) {
    this.$confirm('Bạn có chắc chắn muốn xóa mục tiêu này?', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      // try {
      //   await EmployeeRepository.delete(row.id).then((res: any) => {
      //     Notification.success({
      //       ...notificationConfig,
      //       message: 'Từ chối thành viên thành công',
      //     });
      //   });
      //   this.getListUsers();
      // } catch (error) {}
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
    justify-content: center;
    p {
      padding: $unit-3;
      &:hover {
        background-color: $purple-primary-1;
      }
    }
  }
}
</style>
