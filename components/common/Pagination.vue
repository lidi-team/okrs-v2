<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator';

@Component<Pagination>({
  name: 'Pagination',
})
export default class Pagination extends Vue {
  @Prop({ required: true }) private total!: number;
  @PropSync('page', { type: Number, default: 1 }) private currentPage!: number;
  @PropSync('limit', { type: Number, default: 20 }) private pageSize!: number;
  @Prop({ default: () => [10, 20, 30, 50] }) private pageSizes!: number[];
  @Prop({ default: 'prev, pager, next' }) private layout!: string;
  @Prop({ default: true }) private background!: boolean;
  @Prop({ default: true }) private autoScroll!: boolean;
  @Prop({ default: false }) private hidden!: boolean;

  handleSizeChange(value: number) {
    this.$emit('pagination', { page: this.currentPage, limit: value });
  }

  handleCurrentChange(value: number) {
    this.$emit('pagination', { page: value, limit: this.pageSize });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.pagination-container.hidden {
  display: none;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $purple-primary-5;
}
.el-pagination.is-background .el-pager li:not(.active):hover {
  color: $purple-primary-5;
}
</style>
