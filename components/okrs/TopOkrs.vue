<template>
  <el-row class="top-okrs" type="flex" justify="space-between">
    <el-col :span="12">
      <base-top-search-cycle :text-cycle="textCycle" :text-place-holder="textPlaceHolder" :text-search="textSearch" />
    </el-col>
    <el-col :span="6">
      <el-button class="el-button el-button--purple el-button-medium" @click="addNewOKRs">Thêm mới OKRs</el-button>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectOptionDTO } from '@/constants/app.interface';
@Component<TopOKRsComponent>({ name: 'TopOKRsComponent' })
export default class TopOKRsComponent extends Vue {
  @Prop({ required: true }) private cycleOkrsSelect!: SelectOptionDTO[];
  @Prop(String) private textPlaceHolder!: string;
  @Prop(String) private textSearch!: string;

  private addNewOKRs() {
    console.log('ADD new OKRs');
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.top-okrs {
}
</style>
