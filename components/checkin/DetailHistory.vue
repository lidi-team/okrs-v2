<template>
  <div>
    <slot name="chartCheckin" />
    <div class="historyDetail">
      <el-table empty-text="Không có dữ liệu" class="historyDetail__form" :data="historyDetail.checkinDetails" style="width: 100%;">
        <el-table-column label="Kết quả chính" min-width="250">
          <template slot-scope="{ row }">
            <span>{{ row.keyResult.content }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Mục tiêu" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.keyResult.targetValue }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Số đạt được" min-width="150">
          <template v-slot="{ row }">
            <span>{{ row.valueObtained }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Tiến độ" min-width="150">
          <template slot-scope="{ row }">
            <el-input v-model="row.progress" :readonly="true" type="textarea" :rows="4" placeholder="Nhập tiến độ"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Vấn đề" min-width="150">
          <template slot-scope="{ row }">
            <el-input v-model="row.problems" :readonly="true" type="textarea" :rows="4" placeholder="Nhập vấn đề"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Kế hoạch" min-width="150">
          <template slot-scope="{ row }">
            <el-input v-model="row.plans" :readonly="true" type="textarea" :rows="4" placeholder="Nhập kế hoạch"> </el-input>
          </template>
        </el-table-column>
        <el-table-column label="Độ tự tin" min-width="150">
          <template v-slot="{ row }">
            <span :style="`color: ${customColors(row.confidentLevel)}`">{{
              row.confidentLevel === 1 ? 'Không ổn lắm' : row.confidentLevel === 2 ? 'Bình thường' : 'Ổn định'
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="historyDetail.objective" class="historyDetail__footer">
      <nuxt-link v-if="$route.name === 'checkin-lich-su-cong-ty-chi-tiet-id'" :to="`/checkin/lich-su-cong-ty/${historyDetail.objective.id}`">
        <el-button class="el-button--purple">Xong</el-button>
      </nuxt-link>
      <nuxt-link v-else :to="`/checkin/lich-su/${historyDetail.objective.id}`">
        <el-button class="el-button--purple">Xong</el-button>
      </nuxt-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { statusCheckin } from '@/constants/app.constant';

@Component<DetailHistory>({
  name: 'DetailHistory',
})
export default class DetailHistory extends Vue {
  @Prop(Object) readonly historyDetail!: any;
  private status = statusCheckin;
  private customColors(confident) {
    return confident === 1 ? '#DE3618' : confident === 2 ? '#47C1BF' : '#50B83C';
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.historyDetail {
  background-color: $white;
  &__footer {
    margin-top: $unit-4;
    margin-bottom: $unit-4;
    float: right;
  }
}
</style>
