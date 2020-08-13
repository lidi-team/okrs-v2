<template>
  <fragment>
    <el-table v-loading="loading" empty-text="Không có dữ liệu" class="myOKRs" :data="tableData" style="width: 100%;">
      <el-table-column label="Mục tiêu" min-width="250">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Kết quả then chốt" min-width="150">
        <template slot-scope="{ row }">
          <span class="myOKRs__txtBlue" @click="showKRs(row)">{{ row.keyResults ? row.keyResults.length : 0 }} kết quả</span>
        </template>
      </el-table-column>
      <el-table-column label="Tiến độ" min-width="150">
        <template v-slot="{ row }">
          <el-progress :percentage="row.progress" :color="customColors(row.change)" :text-inside="true" :stroke-width="26" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Thay đổi" min-width="100">
        <template slot-scope="{ row }">
          <span :style="`color: ${customColors(row.change)}`">{{ row.change }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Lịch sử" min-width="150">
        <template slot-scope="{ row }">
          <nuxt-link :to="`/checkin/lich-su/${row.id}`">
            <span class="myOKRs__txtBlue">Xem lịch sử</span>
          </nuxt-link>
        </template>
      </el-table-column>
      <el-table-column label="Hành động" align="center" width="180">
        <template slot-scope="{ row }">
          <el-button v-if="row.status === status.OVERDUE" type="danger" class="el-button--checkin">Quá hạn</el-button>
          <el-button v-else-if="row.status === status.DRAFT" type="warning" class="el-button--checkin">Edit bản nháp</el-button>
          <el-button v-else-if="row.status === status.PENDING" type="info" disabled class="el-button--checkin">Đang chờ duyệt</el-button>
          <el-button v-else-if="row.status === status.COMPLETED" type="success" disabled class="el-button--checkin">Đã hoàn thành</el-button>
          <el-button v-else class="el-button--purple el-button--checkin">Tạo Checkin</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- show dialog KRs -->
    <el-dialog :visible.sync="showDialogKRs" width="90%" placement="bottom-start" :title="keyResults.title" :before-close="handleCloseDialog">
      <el-row>
        <el-col :span="24">
          <el-table empty-text="Không có dữ liệu" class="myOKRs" :data="keyResults.keyResults" style="width: 100%;">
            <el-table-column label="Kết quả chính" min-width="150">
              <template slot-scope="{ row }">
                <span>{{ row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Mục tiêu" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.targetValue }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Đơn vị" min-width="100">
              <template v-slot="{ row }">
                <span>{{ row.measureUnit.type }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Đạt được" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.valueObtained }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Tiến độ" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ krschange(row) }} %</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--purple el-button--modal" @click="handleCloseDialog">OK</el-button>
      </span>
    </el-dialog>
    <!-- end dialog KRs -->
  </fragment>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { statusCheckin } from '@/constants/app.constant';

@Component<MyOkrs>({
  name: 'MyOkrs',
})
export default class MyOkrs extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
  @Prop(Function) readonly getListUsers;

  private status = statusCheckin;
  private keyResults: object = {};
  private showDialogKRs: boolean = false;
  private customColors(percentage: number) {
    if (percentage < 30) {
      return '#e3d0ff';
    } else if (percentage < 70) {
      return '#9c6ade';
    } else {
      return '#50248f';
    }
  }

  private krschange(row) {
    return (row.valueObtained / row.targetValue) * 100;
  }

  private showKRs(row) {
    this.keyResults = Object.assign({}, row);
    this.showDialogKRs = true;
  }

  private handleCloseDialog() {
    this.showDialogKRs = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.myOKRs {
  .el-button {
    &--checkin {
      width: 100%;
    }
  }
  &__txtBlue,
  &__txtBlue:focus {
    color: #337ab7;
    cursor: pointer;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}
</style>
