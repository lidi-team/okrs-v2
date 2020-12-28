<template>
  <el-table :data="keyResults">
    <el-table-column label="Key result" min-width="300">
      <template v-slot="{ row }">
        <span>{{ row.content }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Tiến độ" width="150">
      <template v-slot="{ row }">
        <div>
          <el-progress
            style="width: 80%"
            :percentage="getProgressKrs(row) | round"
            :color="getProgressKrs(row) | customColors"
            :text-inside="true"
            :stroke-width="20"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Link kế hoạch" width="150">
      <template v-slot="{ row }">
        <a :href="`${row.linkPlans}`" target="_blank">
          {{ row.linkPlans }}
        </a>
      </template>
    </el-table-column>
    <el-table-column label="Link kết quả" width="150">
      <template v-slot="{ row }">
        <a :href="`${row.linkPlans}`" target="_blank">
          {{ row.linkPlans }}
        </a>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<DetailKrsDialog>({ name: 'DetailKrsDialog' })
export default class DetailKrsDialog extends Vue {
  @Prop({ type: Array, required: true }) public keyResults!: any[];
  private getProgressKrs(krs: any) {
    return Math.floor(krs.valueObtained / krs.targetValue) * 100;
  }
}
</script>
