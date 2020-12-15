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
                  :disabled="isDisable"
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
                  :disabled="isDisable"
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
                  :disabled="isDisable"
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
                  :disabled="isDisable"
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
                  :disabled="isDisable"
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
                  :disabled="isDisable"
                  v-model="nextCheckinDate"
                  :clearable="false"
                  type="date"
                  :picker-options="pickerOptions"
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
                <el-checkbox
                  :disabled="isDisable"
                  v-model="isCompleted"
                ></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="checkinDetail__footer" v-if="role !== 'guest'">
      <el-button
        :disabled="isDisable"
        v-if="role !== 'reviewer'"
        class="el-button--white"
        @click="handleCheckin('Draft')"
        >Lưu nháp</el-button
      >
      <el-button
        :disabled="isDisable"
        v-if="role !== 'reviewer'"
        class="el-button--purple"
        :loading="loading"
        @click="handleCheckin('Pending')"
        >Gửi yêu cầu</el-button
      >
      <el-button
        :disabled="isDisable"
        class="el-button--purple"
        :loading="loading"
        v-if="checkin.role === 'reviewer'"
        @click="handleCheckin('Reviewed')"
        >Duyệt Check-in</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Form } from 'element-ui';
import { GetterState } from '@/constants/app.vuex';
import { formatDate } from '@/utils/format';
import CheckinRepository from '@/repositories/CheckinRepository';
import {
  statusCheckin,
  confidentLevel,
  notificationConfig,
} from '@/constants/app.constant';
import { formatDateToDD } from '@/utils/dateParser';
import { Maps, Rule } from '@/constants/app.type';

@Component<DetailHistory>({
  name: 'DetailHistory',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    if(this.syncCheckin.checkin) {
      const { status = 'Draft', nextCheckinDate = new Date(), id = null } =  this.syncCheckin.checkin
      this.checkinStatus = status;
      this.nextCheckinDate = nextCheckinDate;
      this.idCheckin = id;
    }
    const { role = 'guest' } = this.syncCheckin
    this.role = role
    if(role === 'guest') {
      this.isDisable = true
    } else if(role === 'user') {
      this.checkinStatus === 'Draft' || this.checkinStatus === 'Overdue' ? this.isDisable = false : this.isDisable = true
    }else if(role === 'reviewer') {
      this.checkinStatus === 'Pending' ? this.isDisable = false : this.isDisable = true
    }
  },
})
export default class DetailHistory extends Vue {
  @PropSync('checkin', { type: Object }) syncCheckin!: any;
  private tempCheckin: any;
  private dropdownConfident = confidentLevel;
  private loading: boolean = false;
  private checkinStatus: string = 'Draft';
  private isDisable: Boolean = false;
  private nextCheckinDate: any = new Date();
  private isCompleted: Boolean = false;
  private idCheckin: Number | null = null;
  private role: String = ''

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
    this.loading = true
    const {
      objective,
      checkinDetail,
    } = this.syncCheckin;
    const payload = {
      id: this.idCheckin,
      objectiveId: objective.id,
      nextCheckinDate: formatDateToDD(this.nextCheckinDate),
      progress: objective.progress ? objective.progress : 0,
      objectComplete: this.isCompleted,
      status,
      checkinDetails: checkinDetail.map((item) => {
        return {
          id: item.id,
          targetValue: item.keyResult.targetedValue,
          valueObtained: item.valueObtained,
          confidentLevel: item.confidentLevel,
          progress: item.progress,
          problems: item.problems,
          plans: item.plans,
          keyResultId: item.keyResult.id,
        };
      }),
    };
    const data = await CheckinRepository.createCheckin(payload);
    if(status !== 'Draft') {
      this.isDisable = true
    }
    this.loading = false
  }
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
    margin-bottom: $unit-4;
    float: right;
  }
}
</style>
