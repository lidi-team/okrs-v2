<template>
  <div>
    <div>
      <div class="box-wrap">
        <el-table
          v-loading="loading"
          empty-text="Không có dữ liệu"
          class="inferiorOKRs"
          :data="employees"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            align="center"
            label="STT"
          ></el-table-column>
          <el-table-column label="Họ và tên">
            <template slot-scope="{ row }">
              <div class="inferiorOKRs__info">
                <img
                  :src="row.avatarURL | filterImage"
                  class="inferiorOKRs__avatar"
                  alt="avatar"
                />
                <span>{{ row.fullName || '' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Dự án" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.project.name || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="{ row }">
              <el-button
                class="el-button--purple"
                @click="showOKRs(row.id, row.project.id)"
                >Xem OKRs</el-button
              >
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
    </div>
    <el-dialog
      :visible.sync="showDialogKRs"
      width="90%"
      placement="bottom-start"
      title="Danh sách OKRs"
      :before-close="handleCloseDialog"
    >
      <el-row v-loading="loadingDialogKRs">
        <el-col :span="24">
          <el-table
            empty-text="Không có dữ liệu"
            class="myOKRs"
            :data="tempOKRs"
            style="width: 100%"
          >
            <el-table-column label="Mục tiêu" min-width="180">
              <template slot-scope="{ row }">
                <span>{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Tiến độ" min-width="150">
              <template v-slot="{ row }">
                <el-progress
                  :percentage="+row.progress | round"
                  :color="+row.progress | customColors"
                  :text-inside="true"
                  :stroke-width="26"
                />
              </template>
            </el-table-column>
            <el-table-column label="Ngày tạo">
              <template slot-scope="{ row }">
                <span>{{
                  new Date(row.createAt) | dateFormat('DD/MM/YYYY')
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Lịch sử">
              <template slot-scope="{ row }">
                <nuxt-link :to="`/checkin/lich-su-nhan-vien/${row.id}`">
                  <span class="el-link">Xem lịch sử</span>
                </nuxt-link>
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ROUTER_CHECKIN } from '@/components/Checkins/constants.enum';
import CheckinRepository from '@/repositories/CheckinRepository';
import Pagination from '@/components/Commons/CommonPagination.vue';

@Component<Inferior>({
  name: 'Inferior',
  components: {
    Pagination,
  },
  async mounted() {
    await this.getListCheckin();
  },
})
export default class Inferior extends Vue {
  @Watch('$route.query')
  private watchQuery() {
    this.getListCheckin();
  }

  @Prop(Number) readonly currentCycleId!: number;
  private showDialogKRs: boolean = false;
  private loadingDialogKRs: boolean = false;

  private tempOKRs: Array<object> = [];
  private employees: Array<object> = [];
  private loading: Boolean = false;

  private pagination = {
    totalItems: 0,
    currentPage: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: 10,
  };

  private async getListCheckin() {
    this.loading = true;
    const tab = this.$route.query.tab
      ? this.$route.query.tab
      : ROUTER_CHECKIN.MyOkrs;
    const page = this.$route.query.page ? this.$route.query.page : 1;
    const cycleId = this.$route.query.cycleId
      ? this.$route.query.cycleId
      : this.$store.state.cycle.cycleCurrent;
    const limit = this.$route.query.limit ? this.$route.query.limit : 10;
    const projectId = this.$route.query.projectId
      ? this.$route.query.projectId
      : 0;
    const { data } = await CheckinRepository.getInferiorCheckin({
      projectId,
      page,
      limit,
      cycleId,
    });
    this.employees = data.items || [];
    this.pagination.totalItems = data.meta.totalItems;
    this.loading = false;
  }

  private handlePagination(pagination: any) {
    this.$router.push(
      `?tab=${this.$route.query.tab}&cycleId=${this.$route.query.cycleId}&page=${pagination.page}&projectId=${this.$route.query.projectId}`,
    );
  }

  private async showOKRs(id: Number, projectId: Number) {
    this.showDialogKRs = true;
    this.loadingDialogKRs = true;
    const userId = id;
    const cycleId = this.$route.query.cycleId
      ? this.$route.query.cycleId
      : this.$store.state.cycle.cycleCurrent;
    const { data } = await CheckinRepository.getListObjectiveInferior({
      userId,
      cycleId,
      projectId,
    });
    this.tempOKRs = data;
    this.loadingDialogKRs = false;
  }

  private handleCloseDialog() {
    this.showDialogKRs = false;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.inferiorOKRs {
  &__info {
    display: flex;
    align-items: center;
  }
  &__avatar {
    margin-right: $unit-2;
    cursor: pointer;
    width: $unit-8;
    height: $unit-8;
    border-radius: $border-radius-large;
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
