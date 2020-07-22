<template>
  <el-row class="login-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-login.png" alt="login image" />
    </el-col>
    <el-col :span="8">
      <el-row class="wrap-login-form" type="flex" justify="center">
        <div class="login__form">
          <span class="login__form__title">Đăng nhập hoặc đăng ký</span>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            :status-icon="true"
            :hide-required-asterisk="false"
            label-width="150px"
            label-position="top"
            @submit.native.prevent="handleSubmit"
          >
            <el-form-item prop="email" label="Tên đăng nhập">
              <el-input
                ref="email"
                v-model="loginForm.email"
                class="login__form__email"
                placeholder="Tên đăng nhập hoặc email"
                tabindex="1"
                autocomplete="on"
              ></el-input>
            </el-form-item>
            <el-tooltip v-model="capsTooltip" content="Đang bật Caps Lock" placement="right" manual>
              <el-form-item prop="password" label="Mật khẩu">
                <el-input
                  ref="password"
                  v-model="loginForm.password"
                  type="password"
                  class="login__form__password"
                  placeholder="Nhập mật khẩu"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                ></el-input>
              </el-form-item>
            </el-tooltip>
            <el-row type="flex" justify="space-between">
              <el-col :span="12">
                <el-checkbox v-model="rememberPassword" class="login__form__checkbox">Ghi nhớ mật khẩu</el-checkbox>
              </el-col>
              <el-col :span="12">
                <nuxt-link class="login__form__link" to="/quen-mat-khauw">Quên mật khẩu ?</nuxt-link>
              </el-col>
            </el-row>
            <el-button :loading="loading" class="el-button el-button--purple el-button--large" @click="handleLogin">Đăng nhập</el-button>
          </el-form>
        </div>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Form as LoginForm } from 'element-ui';
import { LoginDTO } from '@/constants/app.interface';
import { authEnpoint } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
@Component<LoginPage>({
  name: 'LoginPage',
})
export default class LoginPage extends Vue {
  private loading: boolean = false;
  private rememberPassword: boolean = false;
  private capsTooltip = false;
  public loginForm: LoginDTO = {
    email: '',
    password: '',
  };

  public rules: Maps<Rule[]> = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
    ],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }],
  };

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e;
    this.capsTooltip = key !== null && key.length === 1 && key >= 'A' && key <= 'Z';
  }

  private handleLogin(): any {
    (this.$refs.loginForm as LoginForm).validate(async (isValid: boolean) => {
      if (isValid) {
        this.loading = true;
        await this.$store.dispatch(authEnpoint.login, this.loginForm);
        setTimeout(() => {
          this.loading = false;
        }, 300);
      } else {
        return false;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.login-page {
  padding-top: $unit-12;
  @import '@/assets/scss/main.scss';
  .wrap-login-form {
    padding: $unit-12;
    box-shadow: $box-shadow-default;
    .login__form {
      &__title {
        border: 10px;
        padding: 0 0 $unit-10 0;
        font-size: 1.75rem;
        color: $neutral-primary-4;
      }
      &__checkbox {
        font-weight: $font-weight-base;
      }
      &__link {
        font-size: 0.875rem;
        color: #2d9cdb;
        font-weight: $font-weight-base;
      }

      .el-form-item {
        &:first-child {
          margin-top: $unit-4;
        }
        &__label {
          color: $neutral-primary-4;
          padding-bottom: $unit-1;
        }
        .el-input__inner {
          &::placeholder {
            color: $neutral-primary-1;
          }
        }
      }
      .el-row {
        .el-col:nth-child(2) {
          text-align: right;
        }
      }
    }
    .el-button {
      margin-top: $unit-10;
      font-size: $unit-5;
      width: 100%;
    }
    .el-tooltip__popper .is-dark {
      background: $purple-primary-4;
      color: white;
    }
  }
}
</style>
