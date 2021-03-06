<template>
  <div>
    <div class="my-okrs box-wrap">
      <el-table
        v-loading="loading"
        empty-text="Không có dữ liệu"
        :data="checkins"
        style="width: 100%"
      >
        <el-table-column label="Mục tiêu" min-width="250">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả then chốt" min-width="150">
          <template slot-scope="{ row }">
            <span class="el-link" @click="showKRs(row.keyResults)"
              >{{ row.keyResults ? row.keyResults.length : 0 }} kết quả</span
            >
          </template>
        </el-table-column>
        <el-table-column label="Tiến độ" min-width="180">
          <template v-slot="{ row }">
            <el-progress
              :percentage="+row.progress | round"
              :color="+row.progress | customColors"
              :text-inside="true"
              :stroke-width="26"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="Thay đổi" min-width="100">
          <template slot-scope="{ row }">
            <span :style="`color: ${customColorsChanging(row.change)}`"
              >{{ row.change }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="Dự án" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.project.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Lịch sử" min-width="150">
          <template slot-scope="{ row }">
            <nuxt-link :to="`/checkin/lich-su/${row.id}`">
              <span class="el-link">Xem lịch sử</span>
            </nuxt-link>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center" width="180">
          <template slot-scope="{ row }">
            <nuxt-link
              v-if="row.status === status.OVERDUE"
              :to="`/checkin/${row.id}`"
            >
              <el-button type="danger" class="w-100">Quá hạn</el-button>
            </nuxt-link>
            <nuxt-link
              v-else-if="row.status === status.DRAFT"
              :to="`/checkin/chi-tiet/${row.checkinId}`"
            >
              <el-button type="warning" class="w-100">Sửa bản nháp</el-button>
            </nuxt-link>
            <nuxt-link
              v-else-if="row.status === status.PENDING"
              :to="`/checkin/chi-tiet/${row.checkinId}`"
            >
              <el-button type="primary" class="w-100">Đang chờ duyệt</el-button>
            </nuxt-link>
            <el-button
              v-else-if="row.status === status.COMPLETED"
              type="success"
              disabled
              class="w-100"
              >Đã hoàn thành</el-button
            >
            <nuxt-link v-else :to="`/checkin/${row.id}`">
              <el-button class="el-button--purple w-100"
                >Tạo Check-in</el-button
              >
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      class="feedback__col__pagination"
      :total="pagination.totalItems"
      :page.sync="pagination.currentPage"
      :limit.sync="pagination.limit"
      @pagination="handlePagination($event)"
    />

    <el-dialog
      v-if="showDialogKRs"
      :visible.sync="showDialogKRs"
      width="90%"
      placement="bottom-start"
      title="Kết quả then chốt"
      :before-close="handleCloseDialog"
    >
      <el-row>
        <el-col :span="24">
          <el-table
            empty-text="Không có dữ liệu"
            class="myOKRs"
            :data="keyResults"
            style="width: 100%"
          >
            <el-table-column label="Kết quả chính" min-width="150">
              <template slot-scope="{ row }">
                <span>{{ row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="Giá trị bắt đầu"
              min-width="100"
            >
              <template slot-scope="{ row }">
                <span>{{ row.startValue }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Mục tiêu" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.targetedValue }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Đạt được" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.valueObtained }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Đơn vị" min-width="100">
              <template v-slot="{ row }">
                <span>{{ row.measureUnitId }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Tiến độ" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.progress | round }} %</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="el-button--purple el-button--modal"
          @click="handleCloseDialog"
          >OK</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { statusCheckin } from '@/constants/app.constant';
import CheckinRepository from '@/repositories/CheckinRepository';
import Pagination from '@/components/Common/CommonPagination.vue';
import { ROUTER_CHECKIN } from './constants.enum';

@Component<MyOkrsCheckin>({
  name: 'MyOkrsCheckin',
  components: {
    Pagination,
  },
  async mounted() {
    await this.getListCheckin();
  },
})
export default class MyOkrsCheckin extends Vue {
  @Watch('$route.query')
  private watchQuery() {
    this.getListCheckin();
  }

  private loading: Boolean = false;
  private status = statusCheckin;
  private keyResults: any = {};
  private showDialogKRs: boolean = false;
  private checkins: any[] = [];
  private pagination = {
    totalItems: 0,
    currentPage: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: 10,
  };

  private async getListCheckin() {
    this.loading = true;
    const page = this.$route.query.page ? this.$route.query.page : 1;
    const cycleId = this.$route.query.cycleId
      ? this.$route.query.cycleId
      : this.$store.state.cycle.cycleCurrent;
    const limit = this.$route.query.limit ? this.$route.query.limit : 10;
    const projectId = this.$route.query.projectId
      ? this.$route.query.projectId
      : 0;
    const { data } = await CheckinRepository.getMyCheckin({
      projectId,
      page,
      limit,
      cycleId,
    });
    this.checkins = data.items || [];
    this.pagination.totalItems = data.meta.totalItems;
    this.loading = false;
  }

  private handlePagination(pagination: any) {
    const cycleId = this.$route.query.cycleId
      ? this.$route.query.cycleId
      : this.$store.state.cycle.cycleCurrent;
    this.$router.push(
      `?tab=${
        this.$route.query.tab || ROUTER_CHECKIN.MyOkrs
      }&cycleId=${cycleId}&page=${pagination.page}&projectId=${
        this.$route.query.projectId || 0
      }`,
    );
  }

  private customColorsChanging(change: number) {
    if (change > 0) {
      return '#27ae60';
    } else {
      return '#eb5757';
    }
  }

  private showKRs(keyResults) {
    this.keyResults = keyResults;
    this.showDialogKRs = true;
  }

  private handleCloseDialog() {
    this.showDialogKRs = false;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.my-okrs {
  &__header {
    font-size: $text-xl;
    padding: $unit-5 0 $unit-2 $unit-5;
    @include box-shadow;
    border-radius: $border-radius-base $border-radius-base 0px 0px;
  }
  .el-progress {
    .el-progress-bar {
      &__outer {
        background-color: $purple-primary-2;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
  }
}
</style>
