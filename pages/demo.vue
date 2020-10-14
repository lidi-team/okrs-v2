<template>
  <div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="id" label="ID" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="Name"> </el-table-column>
      <el-table-column prop="author" label="Author" width="250"></el-table-column>
      <el-table-column label="Type" width="200" prop="type"> </el-table-column>
      <el-table-column label="Action" align="right" width="80">
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
      <DrawerObjective :id-selected="idSelected" :data-children="dataChildren" width="80" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import DrawerObjective from '@/components/drill-down/DrawerObjective.vue';
import DrillDownRepository from '@/repositories/DrillDownRepository';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
  components: {
    DrawerObjective,
  },
  async mounted() {
    const { data } = await DrillDownRepository.get(0);
    this.tableData = data;
    console.log(data);
  },
})
export default class DrillDownPage extends Vue {
  private selected: boolean = false;
  private idSelected: Number = 0;
  private dataChildren: any = {};
  private tableData: any = [];

  private drillDown(data) {
    this.selected = true;
    this.idSelected = data.id;
    this.dataChildren = data.grandChildObjectives;
  }
}
</script>
