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
              :loading="loading"
              size="small"
              type="primary"
              class="el-button--margin el-button--white el-button--avatar"
              @click="toggleShow"
              >Cập nhật avatar
            </el-button>
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
                      <span>{{ profileForm.fullName }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="gender" label="Giới tính">
                      <span>
                        <i
                          :class="
                            profileForm.gender
                              ? 'el-icon-male'
                              : 'el-icon-female'
                          "
                        />
                        {{ profileForm.gender ? 'Nam' : 'Nữ' }}
                      </span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="info__row">
                <el-row class="info__row--custom" :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item label="Email">
                      <span>{{ profileForm.email }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item label="Ngày sinh">
                      {{ profileForm.dateOfBirth }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <h3 class="info__title">Vị trí công việc</h3>
              <div class="info__row">
                <el-row class="info__row--custom" :gutter="20">
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="department" label="Phòng ban">
                      <el-tag>{{ profileForm.department.name }}</el-tag>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <el-form-item prop="position" label="Vai trò">
                      <div v-bind:key="role" v-for="role in profileForm.roles">
                        <el-tag>
                          {{ getRole(role) }}
                        </el-tag>
                      </div>
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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// import AWS from 'aws-sdk';
import { max255Char } from '@/constants/account.constant';
import UserRepository from '@/repositories/UserRepository';
import { Maps, Rule } from '@/constants/app.type';
import { GetterState, MutationState } from '@/constants/app.vuex';
import { formatDateToDD } from '@/utils/dateParser';

import CommonFlameUpload from '@/components/Commons/CommonUploadAvatart.vue';
import S3Service from '@/repositories/S3AwsRepository';
import RandomNumber from '@/utils/randomNumber';
import { getUserRole } from '@/utils/filterUserRole';

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
          this.$store.commit(
            MutationState.SET_AVATAR,
            endpointLink + '?rnd=' + RandomNumber(),
          );
          // this.$store.commit(MutationState.SET_AVATAR, '');
          // setTimeout(() => {
          // }, 500);
          this.avatarUrl = imgDataUrl;
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

  private profileForm: any = {
    roles: [],
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
        department: temp.data.department,
        roles: temp.data.roles,
      };
      this.loadingProfile = false;
    } catch (error) {
      this.loadingProfile = false;
    }
  }

  private getRole(userRole: string) {
    return getUserRole(userRole);
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
