<template>
  <div class="cfrs">
    <div class="cfrs-page">
      <div class="-display-flex -justify-content-between">
        <h1 class="-title-1">Ghi nhận & phản hồi</h1>
        <div class="-display-flex">
          <cfrs-navbar :current-tab-component="currentTabEng" />
          <el-button
            v-if="
              user.roles.includes('ROLE_PM') ||
              user.roles.includes('ROLE_DIRECTOR')
            "
            class="el-button--purple el-button--invite -ml-2"
            icon="el-icon-plus"
            @click="visibleCreateDialog = true"
          >
            Tạo ghi nhận
          </el-button>
        </div>
      </div>
    </div>

    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
      <component :is="currentTabComponent" />
    </el-tabs>
    <cfrs-recognition
      v-if="visibleCreateDialog"
      :visible-dialog.sync="visibleCreateDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Feedback from '@/components/cfrs/feedback/index.vue';
import History from '@/components/cfrs/history/index.vue';
import Rank from '@/components/cfrs/rank/index.vue';
import { TabCfr, TabCfrEng } from '@/constants/app.enum';
import { ParamsCFR } from '@/constants/DTO/common';
import { pageLimit } from '@/constants/app.constant';
import { GetterState, MutationState } from '@/constants/app.vuex';
import CfrsNavbar from '@/components/cfrs/Navbar.vue';
import CfrsRecognition from '@/components/cfrs/recognition/index.vue';
import { mapGetters } from 'vuex';

@Component<CFRsPage>({
  name: 'CFRsPage',
  components: {
    CfrsNavbar,
    CfrsRecognition,
  },
  head() {
    return {
      title: 'Ghi nhận và Phản hồi',
    };
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  created() {
    this.$store.commit(
      MutationState.SET_TEMP_CYCLE,
      this.$store.state.cycle.cycleCurrent,
    );
  },
})
export default class CFRsPage extends Vue {
  private meta: object = {};
  private visibleCreateDialog: Boolean = false;
  private tabs: string[] = [...Object.values(TabCfr)];

  private params: ParamsCFR = {
    status:
      this.$route.query.tab === 'feedback' ||
      this.$route.query.tab === undefined
        ? -1
        : this.$route.query.tab === 'history'
        ? 0
        : 1,
    text: this.$route.query.text ? String(this.$route.query.text) : '',
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private currentTab: string =
    this.$route.query.tab === 'feedback' || this.$route.query.tab === undefined
      ? TabCfr.Feedback
      : this.$route.query.tab === 'history'
      ? TabCfr.History
      : TabCfr.Rank;

  private get currentTabEng(): String {
    return this.$route.query.tab === 'feedback' ||
      this.$route.query.tab === undefined
      ? TabCfrEng.Feedback
      : this.$route.query.tab === 'history'
      ? TabCfrEng.History
      : TabCfrEng.Rank;
  }

  private get currentTabComponent() {
    this.currentTab =
      this.$route.query.tab === 'feedback' ||
      this.$route.query.tab === undefined
        ? TabCfr.Feedback
        : this.$route.query.tab === 'history'
        ? TabCfr.History
        : TabCfr.Rank;
    return this.$route.query.tab === undefined ||
      this.$route.query.tab === 'feedback'
      ? Feedback
      : this.$route.query.tab === 'history'
      ? History
      : Rank;
  }

  private handleClick(currentTab: string) {
    this.params.text = '';
    this.params.page = 1;
    this.params.status =
      currentTab === TabCfr.Feedback
        ? 1
        : currentTab === TabCfr.History
        ? 0
        : -1;
    this.$router.push(
      `?tab=${
        currentTab === TabCfr.Feedback
          ? 'feedback'
          : currentTab === TabCfr.History
          ? 'history'
          : 'rank'
      }`,
    );
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.cfrs {
  padding-right: $unit-4;
}

.cfrs-page {
  .el-table__empty-block {
    width: 100% !important;
  }
}
</style>
