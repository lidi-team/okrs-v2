<template>
  <el-row>
    <el-col :span="12">
      <el-select v-model="textCycle" filterable placeholder="Nhập chu kỳ">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-autocomplete
        v-model="textSearch"
        :fetch-suggestions="querySearch"
        :placeholder="textSearchPlaceholder"
        @select="handleSelect"
      ></el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SelectOptionDTO } from '@/constants/app.interface';
@Component<TopSearchCycle>({ name: 'TopSearchCycle' })
export default class TopSearchCycle extends Vue {
  @Prop({ required: true, type: String }) private textCycle!: string;
  @Prop({ required: true, type: String }) private textSearchPlaceholder!: string;
  @Prop({ required: true, type: String }) private textSearch!: string;
  @Prop({ required: true, type: Array }) private options!: SelectOptionDTO[];

  private querySearch() {
    console.log('Query Search');
  }

  private handleSelect(item) {
    console.log('Select ' + item);
  }
}
</script>
<style lang="scss" scoped></style>
