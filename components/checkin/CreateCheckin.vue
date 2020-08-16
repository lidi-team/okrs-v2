<template>
  <fragment>
    <slot name="chartOKRs" />
    <div class="checkinDetail">
      <el-form ref="checkinRuleForm" label-position="left" :model="syncCheckin" :rules="rules">
        <el-table empty-text="Không có dữ liệu" class="checkinDetail__form" :data="syncCheckin.checkinDetail" style="width: 100%;">
          <el-table-column label="Kết quả chính" min-width="250">
            <template slot-scope="scope">
              <p>{{ scope.row.keyResult.content }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Mục tiêu" min-width="100">
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model.number="scope.row.keyResult.targetValue" :readonly="true"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Số đạt được" min-width="150">
            <template v-slot="scope">
              <el-form-item :prop="'checkinDetail.' + scope.$index + '.valueObtained'" :rules="rules.valueObtained">
                <el-input v-model.number="scope.row.valueObtained"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Tiến độ" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetail.' + scope.$index + '.progress'" :rules="rules.progress">
                <el-input v-model="scope.row.progress" type="textarea" :rows="4" placeholder="Nhập tiến độ"> </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Vấn đề" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetail.' + scope.$index + '.problems'" :rules="rules.problems">
                <el-input v-model="scope.row.problems" type="textarea" :rows="4" placeholder="Nhập vấn đề"> </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Kế hoạch" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetail.' + scope.$index + '.plans'" :rules="rules.plans">
                <el-input v-model="scope.row.plans" type="textarea" :rows="4" placeholder="Nhập kế hoạch"> </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Độ tự tin" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetail.' + scope.$index + '.confidentLevel'">
                <el-select v-model="scope.row.confidentLevel" placeholder="Chọn độ tự tin">
                  <el-option v-for="item in dropdownConfident" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div class="checkinDetail__bottom">
          <el-form-item label-width="40%" label="Chọn mức độ tự tin hoàn thành mục tiêu" :prop="'confidentLevel'">
            <el-radio-group v-model="syncCheckin.confidentLevel">
              <el-radio :label="3">Ổn định</el-radio>
              <el-radio :label="2">Bình thường</el-radio>
              <el-radio :label="1">Không ổn lắm</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="20%" :prop="'nextCheckinDate'" label="Ngày check-in tiếp theo">
            <el-date-picker
              v-model="syncCheckin.nextCheckinDate"
              :clearable="false"
              type="date"
              :format="dateFormat"
              :value-format="dateFormat"
              placeholder="Chọn ngày checkin tiếp theo"
            ></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="checkinDetail__footer">
      <el-button class="el-button--white" @click="handleDraftCheckin">Lưu nháp</el-button>
      <el-button class="el-button--purple" @click="handleSubmitCheckin">Gửi yêu cầu</el-button>
    </div>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';
import CheckinRepository from '@/repositories/CheckinRepository';
import { statusCheckin, confidentLevel, notificationConfig } from '@/constants/app.constant';
import { formatDateToYYYY, compareTwoDate } from '@/utils/dateParser';
import { Maps, Rule } from '@/constants/app.type';
@Component<DetailHistory>({
  name: 'DetailHistory',
})
export default class DetailHistory extends Vue {
  @PropSync('checkin', { type: Object }) syncCheckin!: any;
  @Prop(Boolean) readonly isNew!: boolean;
  private tempCheckin: any;
  private status = statusCheckin;
  private dateFormat: string = 'dd/MM/yyyy';
  private dropdownConfident = confidentLevel;
  private customColors(confident) {
    return confident === 1 ? '#DE3618' : confident === 2 ? '#47C1BF' : '#50B83C';
  }

  private checkNumber = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('Hãy nhập số đạt được'));
    }
    setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error('Phải là số nguyên'));
      } else {
        callback();
      }
    }, 500);
  };

  private checkText = (rule, value, callback) => {
    const valid: boolean = /^[^-\s]/.test(value);
    if (!valid) {
      return callback(new Error('Không được bỏ trống'));
    } else {
      callback();
    }
  };

  private validateDate(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (compareTwoDate(value, this.syncCheckin.checkinAt) === 1) {
      return callback('Ngày checkin tiếp theo phải lớn hơn ngày checkin hiện tại');
    }
    return callback();
  }

  private rules: Maps<Rule[]> = {
    valueObtained: [
      {
        required: false,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
    ],
    progress: [
      {
        required: false,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
    ],
    problems: [
      {
        required: false,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
    ],
    plans: [
      {
        required: false,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
    ],
    nextCheckinDate: [
      {
        required: false,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
    ],
  };

  private async handleDraftCheckin() {
    const tempCheckin: any = {
      checkin: {
        confidentLevel: this.syncCheckin.confidentLevel,
        objectiveId: this.syncCheckin.id,
        status: 'Draft',
        nextCheckinDate: formatDateToYYYY(this.syncCheckin.nextCheckinDate),
      },
      checkinDetails: [],
    };
    if (this.isNew === true) {
      this.syncCheckin.checkinDetail.map((item) => {
        tempCheckin.checkinDetails.push({
          targetValue: item.keyResult.targetValue,
          valueObtained: item.valueObtained,
          confidentLevel: item.confidentLevel,
          progress: item.progress,
          problems: item.problems,
          plans: item.plans,
          keyResultId: item.keyResult.id,
        });
      });
      try {
        await CheckinRepository.post(tempCheckin).then((res: any) => {
          Notification.success({
            ...notificationConfig,
            message: 'Lưu nháp thành công',
          });
          this.$router.push('/checkin');
        });
      } catch (error) {}
    } else {
      this.syncCheckin.checkinDetail.map((item) => {
        tempCheckin.checkinDetails.push({
          id: item.id,
          targetValue: item.keyResult.targetValue,
          valueObtained: item.valueObtained,
          confidentLevel: item.confidentLevel,
          progress: item.progress,
          problems: item.problems,
          plans: item.plans,
          keyResultId: item.keyResult.id,
        });
      });
      try {
        await CheckinRepository.staffUpdateCheckin(tempCheckin, this.syncCheckin.checkin.id).then((res: any) => {
          Notification.success({
            ...notificationConfig,
            message: 'Lưu nháp thành công',
          });
          this.$router.push('/checkin');
        });
      } catch (error) {}
    }
  }

  private removeRules() {
    this.rules = {
      valueObtained: [
        {
          required: false,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
      ],
      progress: [
        {
          required: false,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
      ],
      problems: [
        {
          required: false,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
      ],
      plans: [
        {
          required: false,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
      ],
      nextCheckinDate: [
        {
          required: false,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
      ],
    };
  }

  private setRules() {
    this.rules = {
      valueObtained: [{ validator: this.checkNumber, trigger: ['change', 'blur'] }],
      progress: [
        {
          required: true,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
        { validator: this.checkText, trigger: ['change', 'blur'] },
      ],
      problems: [
        {
          required: true,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
        { validator: this.checkText, trigger: ['change', 'blur'] },
      ],
      plans: [
        {
          required: true,
          message: 'Không được bỏ trống',
          trigger: ['blur', 'change'],
        },
        { validator: this.checkText, trigger: ['change', 'blur'] },
      ],
      nextCheckinDate: [{ validator: this.validateDate, trigger: ['blur', 'change'] }],
    };
  }

  private async handleSubmitCheckin() {
    await this.setRules();
    const tempCheckin: any = {
      checkin: {
        confidentLevel: this.syncCheckin.confidentLevel,
        objectiveId: this.syncCheckin.id,
        status: 'Pending',
        nextCheckinDate: formatDateToYYYY(this.syncCheckin.nextCheckinDate),
      },
      checkinDetails: [],
    };
    (this.$refs.checkinRuleForm as Form).validate((isValid) => {
      if (isValid) {
        if (this.isNew === true) {
          this.syncCheckin.checkinDetail.map((item) => {
            tempCheckin.checkinDetails.push({
              targetValue: item.keyResult.targetValue,
              valueObtained: item.valueObtained,
              confidentLevel: item.confidentLevel,
              progress: item.progress,
              problems: item.problems,
              plans: item.plans,
              keyResultId: item.keyResult.id,
            });
          });
          this.$confirm(`Bạn có chắc chắn muốn gửi yêu cầu check-in?`, {
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            type: 'warning',
          })
            .then(async () => {
              try {
                await CheckinRepository.post(tempCheckin).then((res: any) => {
                  Notification.success({
                    ...notificationConfig,
                    message: 'Gửi yêu cầu thành công',
                  });
                  this.$router.push('/checkin');
                });
              } catch (error) {}
            })
            .catch((action) => {
              this.removeRules();
            });
        } else {
          this.syncCheckin.checkinDetail.map((item) => {
            tempCheckin.checkinDetails.push({
              id: item.id,
              targetValue: item.keyResult.targetValue,
              valueObtained: item.valueObtained,
              confidentLevel: item.confidentLevel,
              progress: item.progress,
              problems: item.problems,
              plans: item.plans,
              keyResultId: item.keyResult.id,
            });
          });
          this.$confirm(`Bạn có chắc chắn muốn gửi yêu cầu check-in?`, {
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            type: 'warning',
          })
            .then(async () => {
              try {
                await CheckinRepository.staffUpdateCheckin(tempCheckin, this.syncCheckin.checkin.id).then((res: any) => {
                  Notification.success({
                    ...notificationConfig,
                    message: 'Gửi yêu cầu thành công',
                  });
                  this.$router.push('/checkin');
                });
              } catch (error) {}
            })
            .catch((action) => {
              this.removeRules();
            });
        }
      }
    });
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
