<template>
  <div class="wrap-profile">
    <h2>Thông tin tài khoản của bạn</h2>
    <el-form ref="profileForm" :model="profileForm" :status-icon="false" :hide-required-asterisk="false" label-width="150px" label-position="top">
      <el-row class="profile">
        <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="profile-common">
          <el-avatar :size="120" src="https://empty">
            <img :src="profileForm.avatar" />
          </el-avatar>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary" class="el-button--margin el-button--white el-button--avatar">Cập nhật avatar</el-button>
          </el-upload>
          <p class="profile-common__name">{{ profileForm.fullname }}</p>
          <p class="profile-common__role">{{ profileForm.role }}</p>
        </el-col>
        <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="profile-right">
          <div class="info">
            <h3 class="info__title">Thông tin chung</h3>
            <div class="info__row">
              <el-form-item prop="fullname" label="Họ và tên">
                <el-input v-model="profileForm.fullname" placeholder="Nhập vào họ và tên"></el-input>
              </el-form-item>
              <el-form-item prop="gender" label="Giới tính">
                <el-radio v-model="profileForm.gender" label="Nam">Nam</el-radio>
                <el-radio v-model="profileForm.gender" label="Nữ">Nữ</el-radio>
                <el-radio v-model="profileForm.gender" label="Khác">Khác</el-radio>
              </el-form-item>
            </div>
            <div class="info__row">
              <el-form-item prop="email" label="Email" class="info-attribute__label">
                <el-input v-model="profileForm.email" :disabled="true" placeholder="Nhập email"></el-input>
              </el-form-item>
              <el-form-item prop="dob" label="Ngày sinh">
                <el-date-picker v-model="profileForm.dob" type="date" placeholder="Pick a day"></el-date-picker>
              </el-form-item>
            </div>
            <h3 class="info__title">Vị trí công việc</h3>
            <div class="info__row">
              <el-form-item prop="department" label="Phòng ban">
                <el-input v-model="profileForm.department" disabled placeholder="Hiển thị phòng ban"></el-input>
                <el-button class="el-button el-button--purple el-button--update">Cập nhật</el-button>
              </el-form-item>
              <el-form-item prop="position" label="Vị trí">
                <el-input v-model="profileForm.position" disabled placeholder="Hiển thị vị trí"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import { ProfileDTO, SelectDTO } from '@/constants/app.interface';
@Component<ViewProfile>({
  name: 'ViewProfile',
})
export default class ViewProfile extends Vue {
  private profileForm: ProfileDTO = {
    avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
    fullname: 'Nguyễn Phương Hồng Thủy',
    role: 'admin',
    gender: 'Nam',
    email: 'bacodekiller@gmail.com',
    dob: '',
    department: 'IT Department',
    position: 'IT System Developer',
  };

  private handleRemove(file, fileList): any {
    console.log(file, fileList);
  }

  private handlePreview(file): any {
    console.log(file);
  }

  private handleExceed(files, fileList): any {
    this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
  }

  private beforeRemove(file, fileList): any {
    return this.$confirm(`Cancel the transfert of ${file.name} ?`);
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.wrap-profile {
  padding: $unit-8 $unit-64 $unit-10 $unit-10;
  .profile {
    background: $white;
    box-shadow: $box-shadow-default;
    margin-top: $unit-8;
    padding: $unit-12 $unit-20;
    border-radius: $border-radius-base;
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
      padding: $unit-4;
    }
    &__role {
      font-weight: lighter;
      text-transform: uppercase;
      font-size: $unit-4;
    }
  }
  .info {
    /* width: 100%; */
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
}
</style>
