<template>
  <div>
    <el-table :data="dataChildrenUpdated" style="width: 100%;">
      <el-table-column prop="id" label="ID" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="Name"> </el-table-column>
      <el-table-column prop="author" label="Author" width="250"></el-table-column>
      <el-table-column label="Type" width="150">
        <template v-slot="{ row }">
          <span>{{ row.type | filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="right" :width="`${80}%`">
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
      <DrawerObjective :id-selected="idSelectedChild" :data-children="dataGrandChildren" :width="width - 10" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import DrillDownRepository from '@/repositories/DrillDownRepository';

@Component<DrillDownObject>({
  name: 'DrawerObjective',
  filters: {
    filterType(value: Number) {
      if (value === 2) {
        return 'Objective cá nhân';
      } else if (value === 1) {
        return 'Objective dự án';
      } else {
        return 'Objective công ty';
      }
    },
  },
  async mounted() {
    const { data } = await DrillDownRepository.get(this.idSelected);
    this.dataChildrenUpdated = data;
  },
})
export default class DrillDownObject extends Vue {
  @Prop(Number) public idSelected!: 0;
  @Prop(Array) public dataChildren!: [];
  @Prop(Number) public width!: 0;
  private selected: Boolean = false;
  private idSelectedChild: Number = 0;
  private dataGrandChildren: any = {};

  private dataChildrenUpdated: any = this.dataChildren;

  @Watch('idSelected')
  private async getData(id: Number) {
    this.dataChildrenUpdated = this.dataChildren;
    const { data } = await DrillDownRepository.get(id);
    this.dataChildrenUpdated = data;
  }

  private drillDown(data) {
    console.log(data);
    this.selected = true;
    this.idSelectedChild = data.id;
    this.dataGrandChildren = data.grandChildObjectives;
  }
}
</script>
