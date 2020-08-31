<template>
  <fragment>
    <el-table v-loading="loading" empty-text="Không có dữ liệu" class="inferiorOKRs" :data="tableData" style="width: 100%;">
      <el-table-column type="index" align="center" label="STT"></el-table-column>
      <el-table-column label="Họ và tên">
        <template slot-scope="{ row }">
          <div v-if="row.fullName" class="inferiorOKRs__info">
            <img :src="row.avatarURL ? row.avatarURL : row.gravatarURL" class="inferiorOKRs__avatar" alt="avatar" />
            <span>{{ row.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Vai trò" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.role">{{ row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hành động" align="center">
        <template slot-scope="{ row }">
          <el-button class="el-button--purple" @click="showKRs(row)">Xem OKRs</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- show dialog KRs -->
    <el-dialog :visible.sync="showDialogKRs" width="90%" placement="bottom-start" title="Danh sách OKRs" :before-close="handleCloseDialog">
      <el-row v-loading="loadingDialogKRs">
        <el-col :span="24">
          <el-table empty-text="Không có dữ liệu" class="myOKRs" :data="tempOKRs" style="width: 100%;">
            <el-table-column label="Mục tiêu" min-width="180">
              <template slot-scope="{ row }">
                <span>{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Tiến độ" min-width="150">
              <template v-slot="{ row }">
                <el-progress :percentage="row.progress ? row.progress : 0" :color="customColors" :text-inside="true" :stroke-width="26" />
              </template>
            </el-table-column>
            <el-table-column label="Ngày tạo">
              <template slot-scope="{ row }">
                <span>{{ new Date(row.createdAt) | dateFormat('DD/MM/YYYY') }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Lịch sử">
              <template slot-scope="{ row }">
                <nuxt-link :to="`/checkin/lich-su-nhan-vien/${row.id}`">
                  <span class="myOKRs__txtBlue">Xem lịch sử</span>
                </nuxt-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--purple el-button--modal" @click="handleCloseDialog">OK</el-button>
      </span>
    </el-dialog>
    <!-- end dialog KRs -->
  </fragment>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { customColors } from '../okrs/okrs.constant';
import CheckinRepository from '@/repositories/CheckinRepository';
@Component<Inferior>({
  name: 'Inferior',
})
export default class Inferior extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
  @Prop(Number) readonly currentCycleId!: number;
  private showDialogKRs: boolean = false;
  private customColors = customColors;
  private loadingDialogKRs: boolean = false;
  private tempOKRs: Array<object> = [];

  private async showKRs(row) {
    this.showDialogKRs = true;
    this.loadingDialogKRs = true;

    const params = {
      userId: row.id,
      cycleId: this.currentCycleId,
    };
    await CheckinRepository.getListOKRs(params)
      .then((result) => {
        this.tempOKRs = result.data.data;
        this.loadingDialogKRs = false;
      })
      // eslint-disable-next-line handle-callback-err
      .catch((err) => {
        console.log(err);
        this.loadingDialogKRs = false;
      });
  }

  private handleCloseDialog() {
    this.showDialogKRs = false;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.inferiorOKRs {
  &__info {
    display: flex;
    align-items: center;
  }
  &__avatar {
    margin-right: $unit-2;
    cursor: pointer;
    width: $unit-8;
    height: $unit-8;
    border-radius: $border-radius-large;
  }
  .el-button {
    &--checkin {
      width: 100%;
    }
  }
  &__txtBlue,
  &__txtBlue:focus {
    color: #337ab7;
    cursor: pointer;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
  .el-progress {
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
}
</style>
