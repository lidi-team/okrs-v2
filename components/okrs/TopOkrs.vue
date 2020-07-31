<template>
  <el-row type="flex" justify="space-between">
    <el-col :span="12">
      <el-select v-model="value" filterable placeholder="Chọn chu kỳ">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </el-col>
    <el-col :span="12"></el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectOptionDTO } from '@/constants/app.interface';
@Component<TopOKRsComponent>({ name: 'TopOKRsComponent' })
export default class TopOKRsComponent extends Vue {
  @Prop({ required: true }) private cycleOkrsSelect!: SelectOptionDTO[];
}
</script>
<style lang="scss" scoped></style>
