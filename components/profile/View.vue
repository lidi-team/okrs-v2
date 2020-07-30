<template>
  <div class="wrap-profile">
    <h2>Thông tin tài khoản của bạn {{ profileForm.avatar }}</h2>
    <el-form
      ref="updateProfileForm"
      :model="profileForm"
      :status-icon="false"
      :hide-required-asterisk="false"
      label-width="150px"
      label-position="top"
      :rules="rules"
    >
      <el-row class="profile">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="profile-common">
          <el-avatar :size="120">
            <img :src="profileForm.avatar" />
          </el-avatar>
          <el-upload class="upload-demo" :multiple="false" :show-file-list="false" :on-success="handleAvatarSuccess">
            <el-button size="small" type="primary" class="el-button--margin el-button--white el-button--avatar">Cập nhật avatar</el-button>
          </el-upload>
          <p class="profile-common__name">{{ profileForm.fullName }}</p>
          <p class="profile-common__role">{{ profileForm.role }}</p>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" class="profile-right">
          <div class="info">
            <h3 class="info__title">Thông tin chung</h3>
            <div class="info__row">
              <el-row class="info__row--custom" :gutter="20">
                <el-col :sm="24" :md="12">
                  <el-form-item class="custome-label" prop="fullName" label="Họ và tên">
                    <el-input v-model="profileForm.fullName" placeholder="Nhập vào họ và tên"></el-input> </el-form-item
                ></el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item prop="gender" label="Giới tính">
                    <el-radio v-model="profileForm.gender" :label="true">Nam</el-radio>
                    <el-radio v-model="profileForm.gender" :label="false">Nữ</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="info__row">
              <el-row class="info__row--custom" :gutter="20">
                <el-col :sm="24" :md="12">
                  <el-form-item prop="email" label="Email" class="info-attribute__label">
                    <el-input v-model="profileForm.email" :disabled="true" placeholder="Nhập email"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item prop="dateOfBirth" label="Ngày sinh">
                    <el-date-picker v-model="profileForm.dateOfBirth" type="date" placeholder="Chọn ngày sinh"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <h3 class="info__title">Vị trí công việc</h3>
            <div class="info__row">
              <el-row class="info__row--custom" :gutter="20">
                <el-col :sm="24" :md="12">
                  <el-form-item prop="department" label="Phòng ban">
                    <el-input v-model="profileForm.department" disabled placeholder="Hiển thị phòng ban"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item prop="position" label="Vị trí">
                    <el-input v-model="profileForm.position" disabled placeholder="Hiển thị vị trí"></el-input> </el-form-item
                ></el-col>
              </el-row>
            </div>
            <el-button class="el-button el-button--purple el-button--update">Cập nhật</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator';
import { ProfileDTO, SelectDTO } from '@/constants/app.interface';
import UserRepository from '@/repositories/UserRepository';
import { Maps, Rule } from '@/constants/app.type';
@Component<ViewProfile>({
  name: 'ViewProfile',
  created() {
    this.getProfile();
  },
})
export default class ViewProfile extends Vue {
  private profileForm: ProfileDTO = {
    avatar: '',
    role: '',
    fullName: '',
    gender: true,
    dateOfBirth: '',
    department: '',
    position: '',
  };

  private async getProfile(force?: boolean) {
    try {
      const temp = await UserRepository.me();
      this.profileForm = {
        avatar: temp.data.data.imageUrl,
        role: temp.data.data.role.name,
        fullName: temp.data.data.fullName,
        gender: temp.data.data.gender,
        dateOfBirth: temp.data.data.dateOfBirth,
        department: temp.data.data.team.name,
        position: temp.data.data.jobPosition.name,
      };
    } catch (error) {}
  }

  private rules: Maps<Rule[]> = {
    fullName: [{ required: true, message: 'Vui lòng nhập tên của bạn', trigger: 'blur' }],
    dateOfBirth: [
      { required: false, message: 'Vui lòng chọn ngày sinh', trigger: 'change' },
      { validator: this.validateDate, trigger: ['blur', 'change'] },
    ],
  };

  private validateDate(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value <= new Date()) {
      return callback('Ngày sinh không hợp lệ');
    }
    return callback();
  }

  private handleAvatarSuccess(res, file) {
    console.log(file.raw);
    this.profileForm.avatar = URL.createObjectURL(file.raw);
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.wrap-profile {
  padding: $unit-8 $unit-10 $unit-10 $unit-10;
  .profile {
    background: $white;
    box-shadow: $box-shadow-default;
    margin-top: $unit-8;
    padding: $unit-12 $unit-20;
    border-radius: $border-radius-base;
    @include breakpoint-down(phone) {
      padding: $unit-10 $unit-10;
    }
  }
  .profile-common {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    &__name {
      font-weight: bold;
      color: $purple-primary-4;
      font-size: $unit-5;
      padding: $unit-1;
    }
    &__role {
      font-weight: lighter;
      text-transform: uppercase;
      font-size: $unit-4;
    }
  }
  .info {
    &__title {
      padding-bottom: $unit-4;
    }
    &__row {
      display: flex;
      .el-form-item {
        width: 100%;
        &:first-child {
          margin-right: $unit-8;
        }
      }
    }
    &__row--custom {
      width: 100%;
    }
  }
  .info-attribute {
    &__label {
      color: red;
    }
  }
  .el-button--update {
    margin-top: $unit-10;
  }
  .el-button--avatar {
    margin-top: $unit-4;
    margin-bottom: $unit-4;
  }

  .el-date-editor.el-input {
    width: 100%;
  }

  .el-form-item {
    &__label {
      font-size: 14px;
      line-height: 14px;
    }
  }
}
</style>
