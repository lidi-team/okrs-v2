<template>
  <div>
    <div class="box-wrap">
      <el-table
        v-loading="loading"
        :data="checkins"
        empty-text="Không có dữ liệu"
        class="requestCheckin"
        style="width: 100%"
      >
        <el-table-column label="Họ và tên" min-width="150">
          <template slot-scope="{ row }">
            <span>{{ row.objective.user.fullName || '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Mục tiêu" min-width="150">
          <template slot-scope="{ row }">
            <span>{{ row.objective.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Project" min-width="150">
          <template slot-scope="{ row }">
            <span>{{ row.project.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Ngày" min-width="150">
          <template slot-scope="{ row }">
            <span>{{
              new Date(row.createdAt) | dateFormat('DD/MM/YYYY')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center" width="180">
          <template slot-scope="{ row }">
            <nuxt-link :to="`/checkin/chi-tiet/${row.id}`">
              <el-button class="el-button--purple w-100"
                >Duyệt Check-in</el-button
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CheckinRepository from '@/repositories/CheckinRepository';
import Pagination from '@/components/Common/CommonPagination.vue';

@Component<RequestCheckin>({
  name: 'RequestCheckin',
  components: {
    Pagination,
  },
  async mounted() {
    await this.getListCheckin();
  },
})
export default class RequestCheckin extends Vue {
  @Watch('$route.query')
  private watchQuery() {
    this.getListCheckin();
  }

  private loading: Boolean = false;
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
    const { data } = await CheckinRepository.getRequestCheckin({
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
    this.$router.push(
      `?tab=${this.$route.query.tab}&cycleId=${this.$route.query.cycleId}&page=${pagination.page}&projectId=${this.$route.query.projectId}`,
    );
  }
}
</script>
