<template>
  <div class="checkinDetail">
    <slot name="chartOKRs" />
    <div v-if="user">
      <el-form ref="checkinRuleForm" label-position="left" :model="syncCheckin">
        <el-table
          empty-text="Không có dữ liệu"
          class="checkinDetail__form"
          :data="syncCheckin.checkinDetail"
          style="width: 100%"
        >
          <el-table-column label="Kết quả chính" min-width="250">
            <template slot-scope="{ row }">
              <p>{{ row.keyResult.content }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Mục tiêu" min-width="100">
            <template slot-scope="{ row }">
              <el-form-item>
                <el-input
                  disabled
                  v-model.number="row.keyResult.targetedValue"
                  :readonly="true"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Số đạt được" min-width="150">
            <template v-slot="{ row }">
              <el-form-item>
                <el-input
                  type="number"
                  v-model.number="row.valueObtained"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Tiến độ" min-width="150">
            <template slot-scope="{ row }">
              <el-form-item>
                <el-input
                  v-model="row.progress"
                  type="textarea"
                  :rows="4"
                  placeholder="Nhập tiến độ"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Vấn đề" min-width="150">
            <template slot-scope="{ row }">
              <el-form-item>
                <el-input
                  v-model="row.problems"
                  type="textarea"
                  :rows="4"
                  placeholder="Nhập vấn đề"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Kế hoạch" min-width="150">
            <template slot-scope="{ row }">
              <el-form-item>
                <el-input
                  v-model="row.plans"
                  type="textarea"
                  :rows="4"
                  placeholder="Nhập kế hoạch"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Độ tự tin" min-width="150">
            <template slot-scope="{ row }">
              <el-form-item>
                <el-select
                  v-model="row.confidentLevel"
                  placeholder="Chọn độ tự tin"
                >
                  <el-option
                    v-for="item in dropdownConfident"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div class="checkinDetail__bottom">
          <el-row>
            <el-col :sm="24" :lg="12">
              <el-form-item
                label-width="30%"
                :prop="'nextCheckinDate'"
                label="Ngày check-in tiếp theo"
              >
                <el-date-picker
                  v-model="syncCheckin.nextCheckinDate"
                  :clearable="false"
                  type="date"
                  :picker-options="pickerOptions"
                  :format="dateFormat"
                  :value-format="dateFormat"
                  placeholder="Chọn ngày checkin tiếp theo"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="12">
              <el-form-item
                label-width="30%"
                :prop="'isCompleted'"
                label="Hoàn thành OKRs"
              >
                <el-checkbox v-model="syncCheckin.isCompleted"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="checkinDetail__footer">
      <el-button
        :disabled="syncCheckin.isCompleted"
        class="el-button--white"
        v-if="
          (checkin.role === 'user' || checkin.role === 'reviewer') &&
          checkinStatus === 'Draft'
        "
        @click="handleDraftCheckin"
        >Lưu nháp</el-button
      >
      <el-button
        class="el-button--purple"
        :loading="loading"
        v-if="checkin.role === 'user' && checkinStatus === 'Draft'"
        @click="handleSubmitCheckin"
        >Gửi yêu cầu</el-button
      >
      <el-button
        class="el-button--purple"
        :loading="loading"
        v-if="checkin.role === 'reviewer' && checkinStatus === 'Pending'"
        >Check-in</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Form } from 'element-ui';
import { GetterState } from '@/constants/app.vuex';
import CheckinRepository from '@/repositories/CheckinRepository';
import {
  statusCheckin,
  confidentLevel,
  notificationConfig,
} from '@/constants/app.constant';
import {
  formatDateToYYYY,
  formatDateToDD,
  compareTwoDate,
} from '@/utils/dateParser';
import { Maps, Rule } from '@/constants/app.type';

@Component<DetailHistory>({
  name: 'DetailHistory',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    this.checkinStatus = this.syncCheckin.checkin.status
      ? this.syncCheckin.checkin.status
      : 'Draft';
  },
})
export default class DetailHistory extends Vue {
  @PropSync('checkin', { type: Object }) syncCheckin!: any;
  private tempCheckin: any;
  private status = statusCheckin;
  private dateFormat: string = 'dd/MM/yyyy';
  private dropdownConfident = confidentLevel;
  private loading: boolean = false;
  private checkinStatus: string = '';

  private customColors(confident) {
    return confident === 1
      ? '#DE3618'
      : confident === 2
      ? '#47C1BF'
      : '#50B83C';
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() <= Date.now();
    },
  };

  private async handleCheckin(status: String) {
    const {
      id,
      nextCheckinDate,
      progress,
      checkinDetail,
      checkin,
    } = this.syncCheckin;
    const payload = {
      id: checkin ? checkin.id : null,
      objectiveId: id,
      nextCheckinDate,
      progress,
      objectComplete: false,
      status,
      checkinDetails: checkinDetail.map((item) => {
        return {
          id: item.id,
          targetValue: item.keyResult.targetedValue,
          valueObtained: item.keyResult.targetedValue,
          confidentLevel: item.confidentLevel,
          progress: item.progress,
          problems: item.problems,
          plans: item.plans,
          keyResultId: item.keyResult.id,
        };
      }),
    };
    const data = await CheckinRepository.createCheckin(payload);
    console.log('hello', data);
  }

  private handleDraftCheckin() {
    this.handleCheckin('Draft');
  }

  private handleDraftCheckinAdmin() {}

  private handleSubmitCheckin() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.checkinDetail {
  &__form {
    background-color: $white;
  }
  &__bottom {
    margin-top: $unit-4;
    padding: $unit-6;
    background-color: $white;
  }
  &__footer {
    margin-top: $unit-4;
    float: right;
  }
}
</style>
