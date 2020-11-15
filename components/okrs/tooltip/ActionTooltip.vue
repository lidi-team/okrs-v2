<template>
  <el-tooltip class="okrs-tooltip" content="Hành động" placement="right-start" effect="dark">
    <el-popover placement="top" trigger="click">
      <div class="okrs-tooltip__popover">
        <p @click="viewDetailOkrs">Xem chi tiết</p>
        <div v-if="isManage">
          <p @click="updateOKRs">Cập nhật</p>
          <p style="color: #e53e3e" v-if="canDelete" @click="handleDeleteOKrs">Xóa</p>
        </div>
      </div>
      <i slot="reference" class="el-icon-more okrs-tooltip__icon"></i>
    </el-popover>
  </el-tooltip>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import IconSetting from '@/assets/images/okrs/setting.svg';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import { DialogTooltipAction } from '@/constants/app.interface';

import ObjectiveRepository from '@/repositories/ObjectiveRepository';

@Component<OkrsActionTooltip>({
  name: 'OkrsActionTooltip',
  components: {
    IconSetting,
  },
})
export default class OkrsActionTooltip extends Vue {
  @Prop({ type: Number, required: true }) private id!: Number;
  @Prop(Boolean) private isManage!: Boolean;
  @Prop(Boolean) private canDelete!: Boolean;

  private viewDetailOkrs() {
    this.$router.push(`/OKRs/chi-tiet/${this.id}`);
  }

  private updateOKRs() {
    this.$emit('updateOKRs');
  }

  private handleDeleteOKrs() {
    this.$confirm('Bạn có chắc chắn muốn xóa mục tiêu này?', {
      ...confirmWarningConfig,
    }).then(async () => {
      await ObjectiveRepository.deleteObjective(this.id).then((res: any) => {
        this.$notify.success({
          ...notificationConfig,
          message: 'Xóa OKRs thành công',
        });
      });
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-tooltip {
  margin-left: $unit-10;
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
  &__icon {
    cursor: pointer;
  }
}
.el-popover {
  min-width: 120px !important;
  padding: unset !important;
}
</style>
