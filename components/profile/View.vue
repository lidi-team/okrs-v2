<template>
  <div v-loading.fullscreen.lock="loading" class="wrap-profile">
    <h2>Thông tin tài khoản của bạn</h2>
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
          <my-upload
            v-model="show"
            field="file"
            :width="300"
            :height="300"
            lang-type="en"
            :url="url"
            :headers="headers"
            method="PUT"
            img-format="png"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
          ></my-upload>
          <el-avatar :size="120">
            <img :src="avatarUrl" alt="avatar" />
          </el-avatar>
          <el-button size="small" type="primary" class="el-button--margin el-button--white el-button--avatar" @click="toggleShow"
            >Cập nhật avatar</el-button
          >
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
                    <el-input v-model="profileForm.fullName" placeholder="Nhập vào họ và tên"></el-input>
                  </el-form-item>
                </el-col>
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
                    <el-date-picker
                      v-model="profileForm.dateOfBirth"
                      format="dd-MM-yyyy"
                      :picker-options="pickerOptions"
                      type="date"
                      placeholder="Chọn ngày sinh"
                    ></el-date-picker>
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
                    <el-input v-model="profileForm.position" disabled placeholder="Hiển thị vị trí"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-button class="el-button el-button--purple el-button--update" @click="updateProfile">Cập nhật</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import myUpload from 'vue-image-crop-upload';
import { Form } from 'element-ui';
import { ProfileDTO } from '@/constants/app.interface';
import UserRepository from '@/repositories/UserRepository';
import { Maps, Rule } from '@/constants/app.type';
import { AuthMutation } from '@/store/auth';
import { getTokenCookie } from '@/utils/cookies';
@Component<ViewProfile>({
  name: 'ViewProfile',
  components: {
    myUpload,
  },
  created() {
    this.getProfile();
  },
})
export default class ViewProfile extends Vue {
  private loading: boolean = false;
  private url: string = `${process.env.baseAPI}/api/v1/users/upload_avatar`;
  private show: boolean = false;
  private avatarUrl: string = '';
  private headers = { Authorization: `Bearer ${getTokenCookie()}` };

  private toggleShow() {
    this.show = !this.show;
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };

  private cropSuccess(imgDataUrl: string, field: string) {
    this.avatarUrl = imgDataUrl;
  }

  private async cropUploadSuccess(jsonData: any, field: string) {
    const { data } = await UserRepository.me();
    this.$store.commit(`auth/${AuthMutation.SET_USER}`, data.data);
    this.show = false;
    this.$notify({
      title: 'Trạng thái',
      message: 'Cập nhật avatar thành công',
      type: 'success',
      duration: 2000,
    });
  }

  private cropUploadFail(status: boolean, field: string) {
    this.$notify({
      title: 'Trạng thái',
      message: 'Có lỗi xảy ra',
      type: 'error',
      duration: 2000,
    });
  }

  private profileForm: ProfileDTO = {
    role: '',
    fullName: '',
    email: '',
    gender: true,
    dateOfBirth: '',
    department: '',
    position: '',
  };

  private async getProfile(force?: boolean) {
    try {
      this.loading = true;
      const temp = await UserRepository.me();
      this.avatarUrl = temp.data.data.imageUrl;
      this.profileForm = {
        role: temp.data.data.role.name,
        fullName: temp.data.data.fullName,
        email: temp.data.data.email,
        gender: temp.data.data.gender,
        dateOfBirth: temp.data.data.dateOfBirth,
        department: temp.data.data.team.name,
        position: temp.data.data.jobPosition.name,
      };
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  private updateProfile() {
    (this.$refs.updateProfileForm as Form).validate(async (isValid) => {
      if (isValid) {
        try {
          this.loading = true;
          await UserRepository.update(this.profileForm);
          this.$notify({
            title: 'Trạng thái',
            type: 'success',
            message: 'Cập nhật thông tin cá nhân thành công',
            duration: 2000,
          });
          const { data } = await UserRepository.me();
          this.$store.commit(`auth/${AuthMutation.SET_USER}`, data.data);
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  private rules: Maps<Rule[]> = {
    fullName: [{ required: true, message: 'Vui lòng nhập tên của bạn', trigger: 'blur' }],
    dateOfBirth: [{ required: false, message: 'Vui lòng chọn ngày sinh', trigger: 'change' }],
  };
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
