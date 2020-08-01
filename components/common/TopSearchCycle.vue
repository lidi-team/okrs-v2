<template>
  <el-row>
    <el-col :span="12">
      <el-select v-model="textCycle" filterable placeholder="Nhập chu kỳ">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-autocomplete v-model="textSearch" :fetch-suggestions="querySearch" :placeholder="textPlaceHolder" @select="handleSelect"></el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<TopSearchCycle>({ name: 'TopSearchCycle' })
export default class TopSearchCycle extends Vue {
  @Prop({ required: true }) private textCycle!: string;
  @Prop({ required: true }) private textPlaceHolder!: string;
  @Prop({ required: true }) private textSearch!: string;

  private querySearch() {
    console.log('Query Search');
  }

  private handleSelect() {
    console.log('Select otpion');
  }
}
</script>
<style lang="scss" scoped></style>
