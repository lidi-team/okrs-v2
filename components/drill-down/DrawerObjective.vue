<template>
  <div class="item">
    <p class="item__header">{{ title }}</p>
    <el-table :data="dataObjectives" style="width: 100%" header-row-class-name="item__table-header">
      <el-table-column label="Mục tiêu">
        <template v-slot="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="Kết quả then chốt" width="250" align="center">
        <template v-slot="{ row }">
          <p v-if="row.keyResults.length" class="item__krs" @click="showKeyResult(row.keyResults)">{{ row.keyResults | filterKeyresults }}</p>
          <p v-else style="color: #212b36">{{ row.keyResults | filterKeyresults }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="Tiến độ" width="260" align="center">
        <template v-slot="{ row }">
          <div class="item__progress">
            <el-progress :percentage="+row.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Thay đổi" width="100" align="center">
        <template v-slot="{ row }">
          <p :class="row.changing | getStatusOfProgress">{{ row.changing }}%</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Thay đổi" width="100" align="center">
        <template v-slot="{ row }">
          <div class="item__action">
            <p :class="row.changing | getStatusOfProgress">{{ row.changing }}%</p>
            <okrs-action-tooltip
              :reload-data="reloadData"
              :editable="showKeyResult(1)"
              :okrs-id.sync="row.id"
              :temp-okrs="row"
              :is-root-okrs="row.changing"
              @updateTempOkrs="showKeyResult($event)"
            />
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="Loại" width="200" prop="type" align="center"> </el-table-column>
      <el-table-column label="Hành động" align="right" width="150">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            class="el-button el-button--purple el-button--small"
            @click="drillDown(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer :visible.sync="selected" :append-to-body="true" :size="`${width - 10}%`">
      <DrawerObjective :id-selected="idSelectedChild" :width="width - 10" />
    </el-drawer>
    <transition name="el-zoom-in-center">
      <el-dialog class="krs-detail" title="Danh sách kết quả then chốt" :visible.sync="isShowKeyResult" width="50%" @close="isShowKeyResult = false">
        <KeyResult :key-results="keyResults" />
      </el-dialog>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import DrawerObjective from '@/components/drill-down/DrawerObjective.vue';
import DrillDownRepository from '@/repositories/DrillDownRepository';
import { filterKeyresults } from '@/utils/filters';
import { customColors, getStatusOfProgress } from '@/utils/common';
import KeyResult from '@/components/okrs/items/kr.vue';

@Component<DrillDownObject>({
  name: 'DrawerObjective',
  components: {
    DrawerObjective,
    KeyResult,
  },
  filters: {
    filterKeyresults,
    getStatusOfProgress,
  },
  computed: {
    ...mapGetters({
      cycleCurrent: 'cycle/cycleCurrent',
    }),
  },
  async mounted() {
    const { data } = await DrillDownRepository.get(this.cycleCurrent.id, this.idSelected);
    console.log('data drill down', data);
    this.title = data.title;
    this.dataObjectives = data.childObjectives;
  },
})
export default class DrillDownObject extends Vue {
  @Prop(Number) public idSelected!: 0;
  @Prop(Number) public width!: 0;
  private selected: Boolean = false;
  private idSelectedChild: Number = 0;

  private isShowKeyResult: Boolean = false;
  private keyResults: Array<any> = [];
  private title: String = '';
  private dataObjectives: any = [];
  private customColors = customColors;

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
  background: $white;
  color: $neutral-primary-4;
  margin-top: $unit-8;
  border-radius: $border-radius-base;
  @include drop-shadow;
  &__header {
    font-size: $text-xl;
    padding: $unit-2;
    @include box-shadow;
    border-radius: $border-radius-base $border-radius-base 0px 0px;
  }
  &__table-header {
    > th {
      font-weight: $font-weight-medium;
      color: $neutral-primary-4;
      padding-left: $unit-5;
    }
  }
  &__krs {
    color: $blue-primary-2;
    cursor: pointer;
  }
  &__progress {
    width: 250px;
  }
  &__action {
    place-content: center space-between;
  }
}
</style>
