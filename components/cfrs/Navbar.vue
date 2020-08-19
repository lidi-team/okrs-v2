<template>
  <el-row v-if="currentTabComponent === 'history'" class="navbar-history">
    <el-col :xs="8" :sm="8" :md="8" :lg="8">
      <el-select v-model.number="cycleId" filterable placeholder="Nhập chu kỳ" no-match-text="Không tìm thấy chu kỳ">
        <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-autocomplete
        v-model="textSearch"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        placeholder="Tìm kiếm CFRs của"
        @select="handleSearchSelect"
      >
        <template v-slot="{ item }">
          <el-avatar :size="25">
            <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
          </el-avatar>
          <div class="navbar-history__search">
            <p class="navbar-history__search--fullName">{{ item.fullName }}</p>
            <p class="navbar-history__search--department">{{ getInforUser(item) }}</p>
          </div>
        </template>
      </el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.enum';
import UserRepository from '@/repositories/UserRepository';
@Component<NavbarCrfs>({
  name: 'NavbarCrfs',
  created() {
    this.getAllCycles();
  },
  mounted() {
    this.getUsers();
  },
})
export default class NavbarCrfs extends Vue {
  @Prop({ required: true, type: String }) private currentTabComponent!: string;

  private textSearch: string = '';
  private allUsers: any[] = [];
  private listCycles: any[] = [];
  private cycleId: number = this.$store.state.cycle.cycle.id;

  private querySearch(textQuery: string, callback: any) {
    let results: any[] = [];
    if (textQuery) {
      results = this.allUsers.filter((item) => {
        return item.value.toLowerCase().includes(textQuery.toLowerCase());
      });
    } else {
      results = this.allUsers;
    }
    // call callback function to return suggestions
    callback(results);
  }

  @Watch('cycleId')
  private handleSelectCycle(cycleId: number) {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
  }

  private handleSearchSelect(item) {
    this.$store.commit(MutationState.SET_TEMP_USER_ID, item.id);
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
      const cycleId = this.listCycles.find((item) => item.label === this.cycleId);
      this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
    } else {
      try {
        const { data } = await CycleRepository.get({ page: 1, limit: 8 });
        this.listCycles = data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
        const cycleId = this.listCycles.find((item) => item.label === this.cycleId);
        this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
      } catch (error) {}
    }
  }

  private getInforUser(item: any): String {
    if (item.isLeader) {
      return `Trưởng phòng ${item.team.name}`;
    } else {
      return `Thành viên phòng ${item.team.name}`;
    }
  }

  private async getUsers() {
    try {
      await UserRepository.getUsers().then((res) => {
        if (res.data.data.items.length) {
          this.allUsers = Object.freeze(res.data.data.items);
        }
      });
    } catch (error) {}
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.top-search-cycle {
  @include breakpoint-down(phone) {
    display: flex;
    justify-content: space-between;
  }
  .el-autocomplete {
    width: 100%;
  }
}
</style>
