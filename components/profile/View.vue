<template>
  <div v-loading.fullscreen.lock="loadingProfile" class="box-wrap">
    <div class="-border-header">
      <h2 class="-title-2">Thông tin tài khoản của bạn</h2>
    </div>
    <div class="wrap-profile">
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
          <el-col
            :xs="24"
            :sm="24"
            :md="6"
            :lg="6"
            :xl="6"
            class="profile-common"
          >
            <common-flame-upload
              ref="uploader"
              field="upload"
              v-model="show"
              :width="300"
              :height="300"
              lang-type="vi"
              img-format="png"
              @crop-success="cropSuccess"
            />
            <el-avatar :size="120">
              <img :src="avatarUrl" alt="avatar" />
            </el-avatar>
            <el-button
              size="small"
              type="primary"
              class="el-button--margin el-button--white el-button--avatar"
              @click="toggleShow"
              >Cập nhật avatar</el-button
            >
            <p class="profile-common__name">{{ profileForm.fullName }}</p>
            <!-- <p class="profile-common__role">{{ displayRoleName(user) }}</p> -->
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="18"
            :lg="18"
            :xl="18"
            class="profile-right"
          >
            <div class="info">
              <h3 class="info__title">Thông tin chung</h3>
              <div class="info__row">
                <el-row class="info__row--custom" :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item
                      class="custom-label"
                      prop="fullName"
                      label="Họ và tên"
                    >
                      <el-input
                        v-model="profileForm.fullName"
                        placeholder="Nhập vào họ và tên"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="gender" label="Giới tính">
                      <el-radio v-model="profileForm.gender" :label="1"
                        >Nam</el-radio
                      >
                      <el-radio v-model="profileForm.gender" :label="0"
                        >Nữ</el-radio
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="info__row">
                <el-row class="info__row--custom" :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item
                      prop="email"
                      label="Email"
                      class="info-attribute__label"
                    >
                      <el-input
                        v-model="profileForm.email"
                        :disabled="true"
                        placeholder="Nhập email"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="dateOfBirth" label="Ngày sinh">
                      <el-date-picker
                        v-model="profileForm.dateOfBirth"
                        format="dd/MM/yyyy"
                        value-format="dd/MM/yyyy"
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
                      <el-input
                        v-model="profileForm.department"
                        disabled
                        placeholder="Hiển thị phòng ban"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="position" label="Vị trí">
                      <el-input
                        v-model="profileForm.position"
                        disabled
                        placeholder="Hiển thị vị trí"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <!-- <el-button class="el-button el-button--purple el-button--update" :loading="loading" @click="updateProfile">Cập nhật</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// import AWS from 'aws-sdk';
import { Form } from 'element-ui';
import { max255Char } from '@/constants/account.constant';
import UserRepository from '@/repositories/UserRepository';
import { Maps, Rule } from '@/constants/app.type';
import { MutationState, GetterState } from '@/constants/app.vuex';
import { formatDateToDD } from '@/utils/dateParser';

import CommonFlameUpload from '@/components/common/FlameUpload.vue';
import S3Service from '@/repositories/S3AwsRepository';
@Component<ViewProfile>({
  name: 'ViewProfile',
  components: {
    CommonFlameUpload,
  },
  created() {
    this.getProfile();
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class ViewProfile extends Vue {
  private loadingProfile: boolean = false;
  private loading: boolean = false;
  private show: boolean = false;
  private avatarUrl: string = '';

  private rules: Maps<Rule[]> = {
    fullName: [
      {
        required: true,
        pattern: /^[^-\s]/,
        message: 'Họ và tên không được bỏ trống',
        trigger: 'blur',
      },
      {
        // eslint-disable-next-line no-useless-escape
        pattern: /^[^\@\#\^\{\}\<\>\~\+\`\/\*\[\]]+$/,
        message: 'Họ và tên không được chứa ký tự đặc biệt',
        trigger: 'blur',
      },
      max255Char,
    ],
  };

  private toggleShow() {
    this.show = !this.show;
    (this.$refs.uploader as any).setStep(1);
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };

  // eslint-disable-next-line require-await
  private async cropSuccess(imgDataUrl: string, field: string) {
    const s3Service = new S3Service();
    const imgData = imgDataUrl
      .replace('data:*/*;base64,', '')
      .replace('data:image/png;base64,', '')
      .replace('data:image/jpeg;base64,', '');
    const userEmail = this.$store.state.auth.user.email;
    console.log('userEmail: ', userEmail);
    try {
      this.loading = true;
      const data: any = await s3Service.uploadImage({
        contentType: 'png',
        file: imgData,
        fileName: userEmail + '.png',
      });
      if (!!data && !!data.Key) {
        const endpointLink = s3Service.urlOutput(data.Key);
        const response: any = await UserRepository.updateAvatar(endpointLink);
        if (!!response && !!response.message) {
          this.$store.commit(MutationState.SET_AVATAR, endpointLink);
          this.avatarUrl = imgDataUrl;
          this.$notify({
            title: 'Trạng thái',
            message: response.message,
            type: 'success',
            duration: 2000,
          });
          this.loading = false;
        }
      }
    } catch (e) {
      this.loading = false;
      this.show = true;
      this.$notify({
        title: 'Trạng thái',
        message: 'Có lỗi sảy ra',
        type: 'error',
        duration: 2000,
      });
      console.log('upload error: ', e);
    }
  }

  private async cropUploadSuccess(jsonData: any, field: string) {
    const { data } = await UserRepository.me();
    this.$store.commit(MutationState.SET_USER, data.data);
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

  private profileForm: any = {
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
      this.loadingProfile = true;
      const temp = await UserRepository.me();
      this.avatarUrl = temp.data.avatarUrl;
      this.profileForm = {
        role: temp.data.roles[0],
        fullName: temp.data.fullName,
        email: temp.data.email,
        gender: temp.data.gender,
        dateOfBirth: temp.data.dob ? formatDateToDD(temp.data.dob) : '',
        department: '',
        position: temp.data.roles[0],
      };
      this.loadingProfile = false;
    } catch (error) {
      this.loadingProfile = false;
    }
  }

  private updateProfile() {
    this.loading = true;
    (this.$refs.updateProfileForm as Form).validate(
      async (isValid: boolean, invalidFields: object) => {
        if (isValid) {
          try {
            await UserRepository.update(this.profileForm);
            setTimeout(() => {
              this.loading = false;
            }, 300);
            this.$notify.success({
              title: 'Trạng thái',
              message: 'Cập nhật thông tin cá nhân thành công',
              duration: 2000,
            });
            const { data } = await UserRepository.me();
            this.$store.commit(MutationState.SET_USER, data.data);
            this.loadingProfile = true;
            setTimeout(() => {
              this.loadingProfile = false;
            }, 300);
          } catch (error) {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          }
        }
        if (invalidFields) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      },
    );
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.wrap-profile {
  padding: $unit-8 0 0 0;
  @include breakpoint-down(phone) {
    padding: 0;
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
.vue-image-crop-upload {
  .vicp-wrap {
    @include breakpoint-down(phone) {
      width: 90%;
      height: 100vh;
    }
  }
}
</style>
