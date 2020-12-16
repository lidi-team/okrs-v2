<template>
  <div v-if="objectives" class="item-okrs">
    <div class="-display-flex -justify-content-between">
      <h2 class="item__header">{{ title }}</h2>
      <div class="-display-flex -align-items-center">
        <button-create-okr
          v-if="isManage"
          :type-objective="1"
          name-objective="dự án"
          :project-id="projectId"
          :loading="loading"
        />
        <button-create-okr
          :type-objective="2"
          name-objective="cá nhân"
          :project-id="projectId"
          :loading="loading"
          :isDisable="objectives.length === 0"
        />
      </div>
    </div>
    <el-table
      :loading="loading"
      :data="objectives"
      header-row-class-name="item__table-header"
      style="width: 100%"
      class="item-okrs__table"
    >
      <el-table-column type="expand" width="20">
        <template v-slot="{ row }">
          <div
            v-for="objective in row.childObjectives"
            :key="objective.id"
            class="item__expand"
          >
            <div class="expand__objective">
              <icon-ellipse v-if="objective" />
              <span>{{ objective.title }}</span>
            </div>
            <div class="expand__infor">
              <p
                v-if="objective.keyResults.length"
                class="expand__infor--link"
                @click="emitDrawer(objective.keyResults)"
              >
                {{ objective.keyResults.length }} kết quả
              </p>
              <p v-else style="width: 120px; color: #212b36">
                {{ objective.keyResults.length }} kết quả
              </p>
              <div class="expand__infor--progress">
                <el-progress
                  :percentage="+objective.progress"
                  :color="customColors"
                  :text-inside="true"
                  :stroke-width="26"
                />
              </div>
              <div class="expand__infor--action">
                <span :class="isUpProgress(objective.changing)"
                  >{{ objective.changing }}%</span
                >
                <action-tooltip
                  :id="objective.id"
                  class="expand__infor--action__tooltip"
                  :isManage="true"
                  :canDelete="objective.delete"
                  @updateOKRs="updateOKRs(objective)"
                />
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Mục tiêu" min-width="380">
        <template v-slot="{ row }">
          <span>{{ row.title }}</span>
          <el-tag type="info">{{ row.childObjectives.length }} mục tiêu</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Kết quả then chốt" width="140">
        <template v-slot="{ row }">
          <p
            v-if="row.keyResults.length"
            class="item__krs"
            @click="emitDrawer(row.keyResults)"
          >
            {{ row.keyResults.length }} kết quả
          </p>
          <p v-else style="color: #212b36">
            {{ row.keyResults.length }} kết quả
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Tiến độ" width="250">
        <template v-slot="{ row }">
          <div class="item__progress">
            <el-progress
              :percentage="+row.progress"
              :color="customColors"
              :text-inside="true"
              :stroke-width="26"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Thay đổi" width="200">
        <template v-slot="{ row }">
          <div class="item__action">
            <p :class="isUpProgress(row.changing)">{{ row.changing }}%</p>
            <action-tooltip
              :id="row.id"
              :is-manage="isManage"
              :canDelete="row.delete"
              :canUpdate="row.update"
              @updateOKRs="updateOKRs(row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <align-okrs-dialog
      v-if="visibleAlignDialog"
      :temporary-okrs="tempOkrs"
      :visible-dialog.sync="visibleAlignDialog"
      :reload-data="reloadData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { customColors } from './okrs.constant';
import IconEllipse from '@/assets/images/okrs/ellipse.svg';
import { DialogTooltipAction } from '@/constants/app.interface';

import ActionTooltip from '@/components/okrs/common/ActionTooltip.vue';
import ButtonCreateOkr from '@/components/okrs/common/Button.vue';
import { ObjectiveDTO } from '@/constants/DTO/okrs';
import { DispatchAction } from '@/constants/app.vuex';

import OkrsRepository from '@/repositories/OkrsRepository';

@Component<OKRsItem>({
  name: 'OKRsItem',
  components: {
    IconEllipse,
    ActionTooltip,
    ButtonCreateOkr,
  },
})
export default class OKRsItem extends Vue {
  @Prop(String) private title!: string;
  @Prop(Array) private objectives!: object[];
  @Prop(Function) private reloadData!: Function;
  @Prop(Boolean) private isManage!: Boolean;
  @Prop(Number) private projectId!: Number;
  @Prop(Boolean) private loading!: Boolean;

  private tempOkrs: any = {};
  private changeValue: number = 0;
  private visibleUpdateDialog: Boolean = false;
  private visibleAlignDialog: Boolean = false;
  private customColors = customColors;

  private emitDrawer(keyResults: any) {
    this.$emit('openDrawer', keyResults);
  }

  private isUpProgress(progress: Number): string {
    return progress > 0 ? 'happy' : 'sad';
  }

  private async updateOKRs(objective) {
    const { id, title, type, weight, keyResults } = objective;
    const { data } = await OkrsRepository.getDetailOkrsById(id);
    if (data) {
      const okrs: ObjectiveDTO = {
        id,
        title,
        projectId: data.project.id,
        parentId: data.parentObjective.id,
        type,
        weight,
        cycleId: this.$store.state.cycle.cycleCurrent,
        alignmentObjectives: data.alignmentObjectives,
        keyResults,
      };
      this.$store.dispatch(DispatchAction.UPDATE_DIALOG_OKRS, okrs);
    }
  }

  private getProgressKrs(krs: any): number {
    return Math.floor((krs.valueObtained / krs.targetValue) * 100);
  }

  private editableOkrs(userId) {
    return userId === this.$store.state.auth.user.id;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.item-okrs {
  padding-top: $unit-5;
  transform: perspective(1px) translateZ(0);
  transition-property: transform;
  transition-duration: 0.3s;
  &:hover {
    transform: translateY(-3px);
  }
  .last-item {
    margin-bottom: $unit-5;
  }
  .happy {
    color: $green-primary-1;
  }
  .sad {
    color: $red-primary-1;
  }
  .item {
    background: $white;
    color: $neutral-primary-4;
    margin-top: $unit-8;
    @include drop-shadow;
    &__header {
      color: $purple-primary-8;
      font-size: $text-xl;
      text-shadow: 0px 4px 10px rgba(33, 43, 54, 0.15),
    0px 4px 40px rgba(33, 43, 54, 0.15);
      padding: $unit-5 0 $unit-2 0;
    }
    &__table-header {
      > th {
        font-weight: $font-weight-medium;
        color: $neutral-primary-4;
        padding-left: $unit-5;
      }
    }
    &__krs {
      color: $purple-primary-8;
      &:hover {
        color: $purple-primary-7;
      }
      cursor: pointer;
    }
    &__progress {
      width: 250px;
    }
    &__action {
      display: flex;
    }

    &__expand {
      display: flex;
      place-content: center space-between;
      padding-bottom: $unit-5;
      &:last-child {
        padding-bottom: 0;
      }
      .expand__objective {
        display: flex;
        place-content: center flex-start;
        align-items: center;
        padding-right: $unit-8;
        span {
          padding-left: $unit-5;
        }
      }
      .expand__infor {
        display: flex;
        &--link {
          width: 140px;
          color: $blue-primary-2;
          cursor: pointer;
        }
        &--progress {
          width: 250px;
        }
        &--action {
          width: 180px;
          margin-right: -$unit-10;
          display: flex;
          align-items: center;
          place-content: center space-between;
          &__tooltip {
            padding-right: 105px;
          }
        }
      }
    }
  }

  .el-table {
    .cell {
      white-space: unset;
    }
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
    .el-progress {
      width: 80%;
      .el-progress-bar {
        &__outer {
          background-color: $purple-primary-2;
          border-radius: $border-radius-medium;
          .el-progress-bar__inner {
            border-radius: $border-radius-medium;
          }
        }
      }
    }
    .el-icon-arrow-right {
      color: $purple-primary-4;
      font-weight: $font-weight-medium;
    }
    .el-table__expanded-cell {
      padding: $unit-5 30px;
    }
  }
}
</style>
