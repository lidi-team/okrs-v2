<template>
  <div class="header-employee">
    <div class="header-employee__left">
      <el-input
        v-model="search"
        class="header-employee__input"
        placeholder="Từ khoá tìm kiếm"
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleSearch(search)"
      />
      <el-button class="el-button--white el-button--small el-button--search" @click="handleSearch(search)">Tìm kiếm</el-button>
    </div>
    <div class="header-employee__right">
      <el-button class="el-button--purple el-button--small el-button--invite" icon="el-icon-plus" @click="showInviteDialog">Mời thành viên</el-button>
    </div>
    <!-- dialog invite -->
    <el-dialog class="dialog-invite" title="Thêm thành viên" :visible.sync="showInvite">
      <el-row :gutter="10" class="dialog-invite__content content">
        <el-col :xs="24" :md="4"><span class="content__name">Đường dẫn</span></el-col>
        <el-col :xs="24" :md="16"><el-input value="test" :readonly="true" autocomplete="off" /></el-col>
        <el-col :xs="24" :md="4"
          ><el-button class="el-button--white el-button--small el-button--copy" icon="el-icon-copy-document">Sao chép</el-button></el-col
        >
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--purple el-button--invite" @click="showInvite = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<HeadEmployee>({
  name: 'HeadEmployee',
})
export default class HeadEmployee extends Vue {
  private search: string = '';
  private showInvite: boolean = false;
  private handleSearch(value: string) {
    if (value.trim() !== '') {
      this.$emit('search', value);
    }
  }

  private showInviteDialog() {
    this.showInvite = true;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.header-employee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $unit-8;
  @include breakpoint-down(phone) {
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
  &__left {
    display: flex;
  }
  &__input {
    width: $unit-64;
  }
  .el-button {
    &--search {
      margin-left: $unit-3;
      padding-left: $unit-8;
      padding-right: $unit-8;
    }
    &--invite {
      padding-top: $unit-3;
      padding-bottom: $unit-3;
      font-size: $text-sm;
      @include breakpoint-down(phone) {
        margin-top: $unit-2;
      }
    }
  }

  .el-dialog__header {
    padding: $unit-4 $unit-5;
    border-bottom: 1px solid #dfe3e8;
    border-radius: $border-radius-base $border-radius-base 0px 0px;

    .el-dialog__title {
      font-size: $text-xl;
      font-weight: $font-weight-light;
      display: block;
      line-height: 2.5rem;
    }
  }
  .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #dfe3e8;
    border-radius: 0px 0px $border-radius-base $border-radius-base;
  }

  .dialog-invite {
    &__content {
      display: flex;
      align-items: center;
      @include breakpoint-down(phone) {
        display: block;
      }
    }
    .el-button {
      &--copy {
        padding: $unit-3 $unit-4;
        @include breakpoint-down(phone) {
          margin-top: $unit-1;
        }
      }
    }
  }
  .content__name {
    font-weight: $font-weight-medium;
    font-size: $text-sm;
  }
}
</style>
