<template>
  <div>
    <el-table :data="dataObjectives" style="width: 100%;">
      <el-table-column label="Mục tiêu">
        <template v-slot="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="Kết quả then chốt" width="250" align="center">
        <template v-slot="{ row }">
          <span>{{ row.keyResults | filterKeyresults }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="Tiến độ" width="250" align="center">
        <template v-slot="{ row }">
          <div class="item__progress">
            <el-progress :percentage="+row.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Thay đổi" width="250" align="center">
        <template v-slot="{ row }">
          <div class="item__action">
            <p :class="row.changing | getStatusOfProgress">{{ row.changing }}%</p>
            <!-- <okrs-action-tooltip
              :reload-data="reloadData"
              :editable="editableOkrs(row.user.id)"
              :okrs-id.sync="row.id"
              :temp-okrs="row"
              :is-root-okrs="row.isRootObjective"
              @updateTempOkrs="updateTempOkrs($event)"
            /> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Loại" width="200" prop="type" align="center"> </el-table-column>
      <el-table-column label="Hành động" align="right" width="80">
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
    <el-drawer :visible.sync="selected" size="80%" :append-to-body="true">
      <DrawerObjective :id-selected="idSelected" width="80" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import DrawerObjective from '@/components/drill-down/DrawerObjective.vue';
import DrillDownRepository from '@/repositories/DrillDownRepository';
import { filterKeyresults } from '@/utils/filters';
import { customColors, getStatusOfProgress } from '@/utils/common';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
  components: {
    DrawerObjective,
  },
  filters: {
    filterKeyresults,
    getStatusOfProgress,
  },
  async mounted() {
    const { data } = await DrillDownRepository.get(3, 0);
    this.dataObjectives = data;
  },
})
export default class DrillDownPage extends Vue {
  private selected: boolean = false;
  private idSelected: Number = 0;
  private dataObjectives: any = [];
  private customColors = customColors;

  private drillDown(data) {
    this.selected = true;
    this.idSelected = data.id;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

.item-okrs {
  .happy {
    color: $green-primary-1;
  }
  .sad {
    color: $red-primary-1;
  }
}
</style>
