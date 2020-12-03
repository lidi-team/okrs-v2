<template>
  <el-dialog
    :title="`Check-in của ${data.objective.user.fullName}`"
    :visible.sync="syncVisibleDialog"
    width="80%"
    placement="center"
    class="detail-feedback"
  >
    <div v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="6" class="detail-feedback__attribute">Ngày feedback</el-col>
        <el-col :span="18" class="detail-feedback__value">{{ new Date(data.checkinAt) | dateFormat('DD/MM/YYYY') }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="detail-feedback__attribute">Mục tiêu</el-col>
        <el-col :span="18" class="detail-feedback__value">{{ data.objective.title }}</el-col>
      </el-row>
      <el-table :data="data.checkinDetails" style="width: 100%">
        <el-table-column prop="keyResult.content" label="Kết quả then chốt" min-width="300"></el-table-column>
        <el-table-column prop="keyResult.targetValue" label="Mục tiêu" width="100"></el-table-column>
        <el-table-column prop="valueObtained" label="Đạt được" width="100"></el-table-column>
        <el-table-column prop="progress" label="Tiến độ" width="200"></el-table-column>
        <el-table-column prop="problems" label="Vấn đề" width="200"></el-table-column>
        <el-table-column prop="plans" label="Kế hoạch" width="200"></el-table-column>
        <el-table-column label="Mức độ tự tin" width="140">
          <template v-slot="{ row }">
            <el-tag :type="row.confidentLevel | filterConfidentTag">{{ row.confidentLevel | filterConfident }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="detail-feedback__action">
      <el-button class="el-button--white el-button--modal" @click="syncVisibleDialog = false">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="createFeedback">Tạo phản hồi</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { confirmWarningConfig } from '@/constants/app.constant';
import CheckinRepository from '@/repositories/CheckinRepository';
@Component<DetailFeedback>({
  name: 'DetailFeedback',
  created() {
    this.getCheckinDetail();
  },
  filters: {
    filterConfident(value: Number) {
      return value === 1 ? 'Không ổn lắm' : value === 2 ? 'Bình thường' : 'Ổn định';
    },
    filterConfidentTag(value: Number) {
      return value === 1 ? 'danger' : value === 2 ? 'info' : 'success';
    },
  },
})
export default class DetailFeedback extends Vue {
  @Prop({ type: Object, required: true }) private detailCheckinInfo!: any;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncVisibleDialog!: boolean;

  private async getCheckinDetail() {
    if (this.detailCheckinInfo) {
      this.loading = true;
      await CheckinRepository.getDetailCheckinByCheckinId(this.detailCheckinInfo.id).then((res) => {
        this.data = res.data.data;
        this.loading = false;
      });
    }
  }

  private content: String = '';
  private autoSizeConfig = { minRows: 4, maxRows: 6 };
  private loading: Boolean = false;
  private data = {
    confidentLevel: 1,
    checkinAt: '',
    objective: {
      title: '',
      user: {
        fullName: '',
      },
    },
    checkinDetails: [],
  };

  private createFeedback() {
    this.$emit('openFeedbackDialog', this.detailCheckinInfo);
    this.syncVisibleDialog = false;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.detail-feedback {
  padding: $unit-4;
  &__attribute {
    font-weight: bold;
    padding: $unit-3 0;
  }
  &__value {
    padding: $unit-3 0;
  }
  &__action {
    margin-top: $unit-4;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .el-dialog__body {
    padding: $unit-4 $unit-6 $unit-8;
  }
  .el-table {
    td {
      padding: $unit-2 0;
    }
    &__row {
      .cell {
        padding-left: 0;
        padding-right: 0;
        line-height: unset;
      }
    }
  }
  .el-table__header {
    .cell {
      color: #606266;
      padding: 0;
    }
  }
}
</style>
