<template>
  <el-form
    ref="checkinRuleForm"
    label-position="left"
    :model="syncCheckin"
    class="checkinDetail"
  >
    <el-row :gutter="32">
      <el-col :sm="24" :lg="8">
        <div class="box-wrap height-290">
          <h2 class="-title-2 -border-header">Cài đặt</h2>
          <el-form-item
            class="-mt-3 label"
            label-width="40%"
            prop="nextCheckinDate"
            label="Ngày check-in kế tiếp:"
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
          <el-form-item
            class="label"
            label-width="40%"
            :prop="'isCompleted'"
            label="Hoàn thành OKRs"
          >
            <el-checkbox :disabled="isDisable" v-model="isCompleted"
              >Hoàn thành</el-checkbox
            >
          </el-form-item>
        </div>
      </el-col>
      <el-col :sm="24" :lg="8">
        <div class="box-wrap height-290">
          <h2 class="-title-2 -border-header">Tiến độ thực tế</h2>
          <div class="-text-center">
            <el-progress
              class="-mt-3"
              type="dashboard"
              :percentage="+progress | round"
              :color="+progress | customColors"
              :stroke-width="10"
            ></el-progress>
            <el-input-number
              :disabled="isDisable"
              class="-display-block -m-auto"
              v-model="progress"
              :min="0"
            ></el-input-number>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :lg="8">
        <div class="box-wrap height-290">
          <h2 class="-title-2 -border-header">Tiến độ gợi ý</h2>
          <div class="-text-center">
            <el-progress
              class="-mt-3"
              type="dashboard"
              :percentage="progressSuggest | verifyProgress"
              :color="progressSuggest | customColors"
              :stroke-width="10"
            ></el-progress>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="user" class="box-wrap">
      <h2 class="-title-2 -border-header">Cập nhật chi tiết</h2>
      <div>
        <el-table
          empty-text="Không có dữ liệu"
          class="checkinDetail__form"
          :data="syncCheckin.checkinDetail"
          style="width: 100%"
        >
          <el-table-column label="Kết quả chính" min-width="200">
            <template slot-scope="{ row }">
              <p>{{ row.keyResult.content }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Bắt đầu" width="80">
            <template slot-scope="{ row }">
              <el-form-item>
                <el-input
                  disabled
                  v-model.number="row.keyResult.startValue"
                  :readonly="true"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Mục tiêu" width="80">
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
          <el-table-column align="center" label="Số đạt được" width="150">
            <template v-slot="{ row }">
              <el-form-item>
                <el-input-number
                  :disabled="isDisable"
                  v-model="row.valueObtained"
                  :min="row.keyResult.startValue"
                  @input="checkRender"
                  controls-position="right"
                  class="-w-18"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Tiến độ" min-width="150">
            <template slot-scope="{ row }">
              <el-form-item prop="progress">
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
              <el-form-item prop="problems">
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
              <el-form-item prop="plans">
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
                  @change="checkRender"
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
      </div>
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
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Form, Notification } from 'element-ui';
import { GetterState } from '@/constants/app.vuex';
import CheckinRepository from '@/repositories/CheckinRepository';
import { confidentLevel } from '@/constants/app.constant';
import { formatDateToDD, compareTwoDate } from '@/utils/dateParser';

@Component<DetailHistory>({
  name: 'DetailHistory',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    if (this.syncCheckin.checkin) {
      const {
        status = 'Draft',
        id = null,
        nextCheckinDate,
      } = this.syncCheckin.checkin;
      if (nextCheckinDate) {
        this.nextCheckinDate = new Date(nextCheckinDate);
      }
      this.checkinStatus = status;
      this.idCheckin = id;
    }
    const { role = 'guest', progress = -1, limitDate } = this.syncCheckin;
    this.progress = progress;
    this.limitDate = new Date(limitDate);
    this.role = role;
    if (role === 'guest') {
      this.isDisable = true;
    } else if (role === 'user') {
      this.checkinStatus === 'Draft' ||
      this.checkinStatus === 'Overdue' ||
      this.checkinStatus === 'Reviewed'
        ? (this.isDisable = false)
        : (this.isDisable = true);
    } else if (role === 'reviewer') {
      this.checkinStatus === 'Pending'
        ? (this.isDisable = false)
        : (this.isDisable = true);
    }
    this.calculatorProgress();
  },
})
export default class DetailHistory extends Vue {
  @PropSync('checkin', { type: Object }) syncCheckin!: any;
  private tempCheckin: any;
  private dropdownConfident = confidentLevel;
  private loading: boolean = false;
  private checkinStatus: string = 'Draft';
  private isDisable: Boolean = false;
  private isCompleted: Boolean = false;
  private idCheckin: Number | null = null;
  private role: String = '';
  private progressSuggest: Number = 0;
  private progress: Number = 0;
  private flag: Boolean = false;
  private limitDate: Date = new Date();
  private nextCheckinDate: Date | null = null;

  @Watch('flag')
  private changeCheckin() {
    this.calculatorProgress();
  }

  private calculatorProgress() {
    const count = (acc, cur) =>
      acc +
      ((cur.valueObtained - cur.keyResult.startValue) /
        (cur.keyResult.targetedValue - cur.keyResult.startValue)) *
        cur.confidentLevel *
        100;
    const progressAll = this.syncCheckin.checkinDetail.reduce(count, 0);
    const progressSuggest = progressAll / this.syncCheckin.checkinDetail.length;
    this.progressSuggest = Math.round(progressSuggest * 100) / 100;
  }

  private checkRender() {
    this.flag = !this.flag;
  }

  private pickerOptions: any = {
    disabledDate: (time) => {
      return time.getTime() <= Date.now();
    },
  };

  private handleCheckin(status: String) {
    this.loading = true;
    if (!this.nextCheckinDate) {
      Notification.error('Không được bỏ trống trường ngày check-in kế tiếp');
      return (this.loading = false);
    }
    (this.$refs.checkinRuleForm as Form).validate(
      async (isValid: boolean, invalidFields: object) => {
        if (isValid) {
          const { objective, checkinDetail } = this.syncCheckin;
          if (!!this.nextCheckinDate && this.nextCheckinDate > this.limitDate) {
            return Notification.error(
              'Ngày check-in kế tiếp vượt quá ngày đóng chu kỳ',
            );
          }
          const payload = {
            id: this.idCheckin,
            objectiveId: objective.id,
            nextCheckinDate: formatDateToDD(this.nextCheckinDate),
            progress: this.progress,
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
          await CheckinRepository.createCheckin(payload);
          if (status !== 'Draft') {
            this.isDisable = true;
          } else {
            this.$router.go(-1);
          }
        }
      },
    );
    this.loading = false;
  }

  private validateDate = (rule, value, callback) => {
    console.log('hello', value, 'hhh');
    if (compareTwoDate(value, formatDateToDD(new Date())) === 1) {
      return callback(new Error('Không được nhỏ hơn ngày hiện tại'));
    } else {
      callback();
    }
  };
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_variables.scss';
.checkinDetail {
  &__form {
    background-color: $white;
  }
  &__footer {
    margin-top: $unit-4;
    margin-bottom: $unit-4;
    float: right;
  }
}
.height-290 {
  height: 290px;
}
.label {
  font-size: 14px;
  color: #606266;
  line-height: 23px;
}
</style>
