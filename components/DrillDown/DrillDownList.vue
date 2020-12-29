<template>
  <div class="item">
    <div class="box-wrap">
      <h2 class="-title-2">Mục tiêu công ty</h2>
      <el-table
        :data="dataObjectives"
        style="width: 100%"
        header-row-class-name="item__table-header"
      >
        <el-table-column label="Mục tiêu" min-width="300">
          <template v-slot="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="author"
          label="Kết quả then chốt"
          width="100"
          align="center"
        >
          <template v-slot="{ row }">
            <p
              v-if="row.keyResults.length"
              class="item__krs el-link"
              @click="showKeyResult(row.keyResults)"
            >
              {{ row.keyResults | filterKeyresults }}
            </p>
            <p v-else style="color: #212b36">
              {{ row.keyResults | filterKeyresults }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="author"
          label="Tiến độ"
          width="180"
          align="center"
        >
          <template v-slot="{ row }">
            <div class="item__progress">
              <el-progress
                :percentage="+row.progress | round"
                :color="+row.progress | customColors"
                :text-inside="true"
                :stroke-width="26"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Thay đổi" width="100" align="center">
          <template v-slot="{ row }">
            <div class="item__action">
              <p :class="row.changing | statusProgress">
                {{ row.changing | round }}%
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Loại"
          width="200"
          prop="type"
          align="center"
        ></el-table-column>
        <el-table-column label="Hành động" align="right" :width="80">
          <template v-slot="{ row }">
            <el-button
              icon="el-icon-arrow-right"
              class="el-button--purple el-button--small"
              @click="drillDown(row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer :visible.sync="selected" size="80%" :append-to-body="true">
      <drill-down-item :id-selected="idSelected" :width="80" :count="0" />
    </el-drawer>
    <transition name="el-zoom-in-center">
      <detail-keyresult
        v-if="isShowKeyResult"
        :list-krs="keyResults"
        :visible-detail-krs.sync="isShowKeyResult"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import DrillDownItem from '@/components/DrillDown/DrillDownItem.vue';
import DrillDownRepository from '@/repositories/DrillDownRepository';
import { filterKeyresults } from '@/utils/filters';
import KeyResult from '@/components/OKRs/OkrsManagement/OkrsManagementStepKeyResult/OkrsManagementStepKeyResultItem.vue';
import DetailKeyresult from '@/components/OKRs/OkrsDialog/OkrsDialogKeyresult.vue';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
  components: {
    DrillDownItem,
    KeyResult,
    DetailKeyresult,
  },
  filters: {
    filterKeyresults,
  },
  mounted() {
    const currentCycleId =
      this.$route.query.cycleId || String(this.$store.state.cycle.cycleCurrent);
    this.getDrillDown(currentCycleId);
  },
})
export default class DrillDownPage extends Vue {
  private selected: boolean = false;
  private idSelected: Number = 0;
  private isShowKeyResult: Boolean = false;
  private keyResults: Array<any> = [];
  private title: String = '';
  private dataObjectives: any = [];

  @Watch('$route.query')
  private getData(query: any) {
    this.getDrillDown(query.cycleId);
  }

  private async getDrillDown(currentCycleId) {
    const { data } = await DrillDownRepository.get(currentCycleId, 0);
    this.title = data.title;
    this.dataObjectives = data.childObjectives;
  }

  private showKeyResult(keyResults: any) {
    this.isShowKeyResult = true;
    this.keyResults = keyResults;
  }

  private drillDown(id) {
    this.selected = true;
    this.idSelected = id;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.happy {
  color: $green-primary-1;
}
.sad {
  color: $red-primary-1;
}
.item {
  background: $white;
  color: $neutral-primary-4;
  &__table-header {
    > th {
      font-weight: $font-weight-medium;
      color: $neutral-primary-4;
      padding-left: $unit-5;
    }
  }
  &__progress {
    width: 170px;
  }
  &__action {
    display: flex;
    justify-content: center;
  }
  &__expand {
    display: flex;
    place-content: center space-between;
    padding-bottom: $unit-5;
    &:last-child {
      padding-bottom: 0;
    }
    .expand__objective {
      display: flex;
      place-content: center flex-start;
      align-items: center;
      padding-right: $unit-8;
      span {
        padding-left: $unit-5;
      }
    }
  }
}
</style>
