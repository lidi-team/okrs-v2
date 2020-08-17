<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="requestCheckin" style="width: 100%;">
      <el-table-column label="Họ và tên" min-width="150">
        <template slot-scope="{ row }">
          <span v-if="row.objective">{{ row.objective.user.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mục tiêu" min-width="150">
        <template slot-scope="{ row }">
          <span v-if="row.objective">{{ row.objective.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Ngày" min-width="150">
        <template slot-scope="{ row }">
          <span v-if="row.checkinAt">{{ new Date(row.checkinAt) | dateFormat('DD/MM/YYYY') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hành động" align="center" width="180">
        <template slot-scope="{ row }">
          <nuxt-link :to="`checkin/yeu-cau/${row.id}`">
            <el-button class="el-button--purple el-button--checkin">Duyệt Check-in</el-button>
          </nuxt-link>
        </template>
      </el-table-column>
    </el-table>
  </fragment>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component<RequestCheckin>({
  name: 'RequestCheckin',
})
export default class RequestCheckin extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) readonly loading!: boolean;
  @Prop(Function) readonly getListUsers;
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.requestCheckin {
  .el-button {
    &--checkin {
      width: 100%;
    }
  }
}
</style>
