<template>
  <div class="item">
    <div class="box-wrap">
      <h2 class="-title-2">{{ title }}</h2>
      <el-table
        :data="dataObjectives"
        style="width: 100%"
        header-row-class-name="item__table-header"
      >
        <el-table-column label="Mục tiêu">
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
              class="el-link"
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
            <p :class="row.changing | statusProgress">
              {{ row.changing | round }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column label="Loại" width="150" prop="type" align="center">
        </el-table-column>
        <el-table-column
          label="Hành động"
          align="right"
          :width="80"
          v-if="count !== 1"
        >
          <template v-slot="{ row }">
            <el-button
              icon="el-icon-arrow-right"
              class="el-button el-button--purple el-button--small"
              @click="drillDown(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :visible.sync="selected"
      :append-to-body="true"
      :size="`${width - 10}%`"
    >
      <DrawerObjective
        :id-selected="idSelectedChild"
        :width="width - 10"
        :count="count + 1"
      />
    </el-drawer>
    <transition name="el-zoom-in-center">
      <el-dialog
        class="krs-detail"
        title="Danh sách kết quả then chốt"
        :visible.sync="isShowKeyResult"
        width="50%"
        @close="isShowKeyResult = false"
      >
        <KeyResult :key-results="keyResults" />
      </el-dialog>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import DrawerObjective from '@/components/DrillDown/DrillDownItem.vue';
import DrillDownRepository from '@/repositories/DrillDownRepository';
import { filterKeyresults } from '@/utils/filters';
import KeyResult from '@/components/okrs/OkrsKeyResult/OkrsKeyResultTableOverview.vue';

@Component<DrillDownObject>({
  name: 'DrawerObjective',
  components: {
    DrawerObjective,
    KeyResult,
  },
  filters: {
    filterKeyresults,
  },
  async mounted() {
    this.currentCycleId =
      this.$route.query.cycleId || String(this.$store.state.cycle.cycleCurrent);
    this.getDrillDown(this.currentCycleId, this.idSelected);
  },
})
export default class DrillDownObject extends Vue {
  @Prop(Number) public idSelected!: 0;
  @Prop(Number) public width!: 0;
  @Prop(Number) public count!: 0;
  private selected: Boolean = false;
  private idSelectedChild: Number = 0;
  private isShowKeyResult: Boolean = false;
  private keyResults: Array<any> = [];
  private title: String = '';
  private dataObjectives: any = [];
  private currentCycleId: string = '0';

  @Watch('idSelected')
  private async change(id: any) {
    this.getDrillDown(this.currentCycleId, id);
  }

  private async getDrillDown(currentCycleId, parentId) {
    const { data } = await DrillDownRepository.get(currentCycleId, parentId);
    this.title = data.title;
    this.dataObjectives = data.childObjectives;
  }

  private showKeyResult(keyResults: any) {
    this.isShowKeyResult = true;
    this.keyResults = keyResults;
    console.log(keyResults);
  }

  private drillDown(data) {
    this.selected = true;
    this.idSelectedChild = data.id;
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
  padding: 0 2rem;
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
    place-content: center space-between;
  }
}
</style>
