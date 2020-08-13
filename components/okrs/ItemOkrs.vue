<template>
  <div>
    <div class="item-okrs">
      <p class="item-okrs__header">{{ textHeader }}</p>
      <el-table v-loading="loading" :data="tableData" header-row-class-name="item-okrs__table-header" style="width: 100%;">
        <el-table-column type="expand" width="20">
          <template v-slot="{ row }">
            <div v-for="objective in row.alignmentObjective" :key="objective.id" class="item-okrs__expand">
              <div class="item-okrs__expand--objective">
                <icon-ellipse />
                <span>{{ objective.title }}</span>
              </div>
              <div class="item-okrs__expand--krs">{{ objective.keyResults.length }} kết quả</div>
              <div class="item-okrs__expand--progress">
                <el-progress :percentage="objective.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
              </div>
              <div class="item-okrs__expand--action">
                <span :class="isUpValue(changeValue)">{{ changeValue }}%</span>
                <okrs-action-tooltip
                  :okrs-id.sync="objective.id"
                  :visible-update-dialog.sync="visibleUpdateDialog"
                  :visible-align-dialog.sync="visibleAlignDialog"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Mục tiêu" width="400">
          <template v-slot="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả then chốt" width="200">
          <template v-slot="{ row }">
            <span>{{ row.keyResults.length }} kết quả</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiến độ">
          <template v-slot="{ row }">
            <el-progress :percentage="row.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
          </template>
        </el-table-column>
        <el-table-column label="Thay đổi" width="200">
          <template v-slot="{ row }">
            <div class="item-okrs--row-change">
              <p :class="isUpValue(row.progress + 4)">{{ row.progress + 4 }}%</p>
              <okrs-action-tooltip
                :okrs-id.sync="row.id"
                :visible-update-dialog.sync="visibleUpdateDialog"
                :visible-align-dialog.sync="visibleAlignDialog"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <update-okrs-dialog :visible-dialog.sync="visibleUpdateDialog" :reload-data="reloadData" /> -->
    <align-okrs-dialog v-if="visibleAlignDialog" :visible-dialog.sync="visibleAlignDialog" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import IconEllipse from '@/assets/images/okrs/ellipse.svg';
@Component<OKRsItem>({
  name: 'OKRsItem',
  components: {
    IconEllipse,
  },
})
export default class OKRsItem extends Vue {
  @Prop(String) private textHeader!: string;
  @Prop(Array) private tableData!: Object[];
  @Prop(Boolean) readonly loading!: boolean;

  private visibleUpdateDialog: boolean = false;
  private visibleAlignDialog: boolean = false;

  private changeValue: number = 0;
  private customColors(percentage: number) {
    if (percentage < 30) {
      return '#e3d0ff';
    } else if (percentage < 70) {
      return '#9c6ade';
    } else {
      return '#50248f';
    }
  }

  private isUpValue(value): string {
    return value > 0 ? 'item-okrs__expand--action--happy' : 'item-okrs__expand--action--sad';
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.item-okrs {
  background: $white;
  color: $neutral-primary-4;
  margin-top: $unit-5;
  filter: drop-shadow(0px 0px 0px rgba(63, 63, 68, 0.05)), drop-shadow(0px 1px 3px rgba(63, 63, 68, 0.15));
  border-radius: $border-radius-base;
  &__header {
    font-size: $text-2xl;
    padding: $unit-5 0 $unit-5 $unit-5;
    box-shadow: inset 0px -1px 0px #dfe3e8;
    border-radius: $border-radius-base $border-radius-base 0px 0px;
  }
  &--row-change {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  &__expand {
    display: flex;
    padding-bottom: $unit-5;
    &:last-child {
      padding-bottom: 0;
    }
    &--objective {
      width: 400px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        padding-left: $unit-5;
      }
    }
    &--krs {
      width: 200px;
    }
    &--progress {
      width: calc(100% - (400px + 200px + 150px + 50px));
    }
    &--action {
      padding-left: $unit-10;
      width: 200px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &--happy {
        color: $green-primary-1;
      }
      &--sad {
        color: $red-primary-1;
      }
    }
  }
  &__sub-header {
    padding-top: $unit-6;
    font-size: $text-base;
  }
  &__table-header {
    > th {
      font-weight: $font-weight-medium;
      color: $neutral-primary-4;
      padding-left: $unit-5;
    }
  }
  .el-table {
    .cell {
      white-space: unset;
    }
    border-radius: $border-radius-base;
    .el-table__header-wrapper {
      .el-table__header {
        width: 100% !important;
      }
    }
    .el-table__body-wrapper {
      padding-left: $unit-5;
      .el-table__body {
        width: 100% !important;
        .el-table__row {
          > td {
            &:nth-child(3) {
              .cell {
                color: $blue-primary-2;
              }
            }
            &:nth-child(2) {
              padding-right: $unit-5;
            }
            &:nth-child(5) {
              padding-right: $unit-16;
            }
          }
        }
      }
    }
    .el-progress-bar {
      &__outer {
        background-color: $purple-primary-1;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
    .el-icon-arrow-right {
      color: $purple-primary-4;
      font-weight: $font-weight-medium;
    }
    .el-progress {
      width: $unit-40;
    }
    .el-table__expanded-cell {
      padding: $unit-5 30px;
    }
  }
}
</style>
