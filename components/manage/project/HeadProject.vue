<template>
  <div class="header-project">
    <div class="header-project__left">
      <el-input
        v-model="syncedText"
        class="header-project__input"
        placeholder="Nhập tên dự án muốn tìm kiếm"
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleSearch(syncedText)"
      />
      <el-button
        class="el-button--white el-button--small el-button--search -ml-2"
        @click="handleSearch(syncedText)"
        >Tìm kiếm</el-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator';
import { notificationConfig } from '@/constants/app.constant';

@Component<Headproject>({
  name: 'Headproject',
})
export default class Headproject extends Vue {
  [x: string]: any;
  @PropSync('text', { type: String }) syncedText!: string;
  @Prop(String) linkInvite!: string;
  private searchText: string = '';
  private showInvite: boolean = false;
  private handleSearch(value: string) {
    this.$emit('search', value);
  }

  private showInviteDialog() {
    this.showInvite = true;
  }

  private doCopy() {
    this.$copyText(this.linkInvite);
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.header-project {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $unit-4;
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
