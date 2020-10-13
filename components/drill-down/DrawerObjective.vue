<template>
  <div>
    <el-table :data="dataChildren.grandChildObjectives" style="width: 100%;">
      <el-table-column prop="id" label="ID" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="Name"> </el-table-column>
      <el-table-column prop="author" label="Author" width="250"></el-table-column>
      <el-table-column label="Type" width="150">
        <template v-slot="{ row }">
          <span>{{ row.type | filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="right" width="80">
        <template>
          <el-button type="primary" icon="el-icon-arrow-right" class="el-button el-button--purple el-button--small"></el-button>
          <el-drawer :visible.sync="drawer" :with-header="false">
            <span>Hi there!</span>
          </el-drawer>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
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
})
export default class DrillDownPage extends Vue {
  @Prop(Object) public dataChildren!: {};

  private tableData: any = [];
}
</script>
