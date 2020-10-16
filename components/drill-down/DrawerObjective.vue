<template>
  <div>
    <el-table :data="dataChildren" style="width: 100%;">
      <el-table-column prop="id" label="ID" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="Mục tiêu"> </el-table-column>
      <el-table-column prop="author" label="Tác giả" width="250" align="center"></el-table-column>
      <el-table-column label="Loại" width="200" prop="type" align="center"> </el-table-column>
      <el-table-column label="Hành động" align="right" :width="`${80}%`">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import DrillDownRepository from '@/repositories/DrillDownRepository';

@Component<DrillDownObject>({
  name: 'DrawerObjective',
  async mounted() {
    const { data } = await DrillDownRepository.get(this.idSelected);
    this.dataChildren = data;
  },
})
export default class DrillDownObject extends Vue {
  @Prop(Number) public idSelected!: 0;
  @Prop(Number) public width!: 0;
  private selected: Boolean = false;
  private idSelectedChild: Number = 0;

  private dataChildren: Array<any> = [];

  private drillDown(data) {
    this.selected = true;
    this.idSelectedChild = data.id;
  }
}
</script>
