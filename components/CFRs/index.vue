<template>
  <el-row v-if="currentTabComponent === 'history'" class="navbar-history">
    <el-col :xs="24" :sm="24" :md="24" :lg="24">
      <el-select
        v-if="listCycles.length > 0"
        v-model.number="cycleId"
        filterable
        placeholder="Nhập chu kỳ"
        no-match-text="Không tìm thấy chu kỳ"
      >
        <el-option
          v-for="cycle in listCycles"
          :key="cycle.id"
          :label="cycle.label"
          :value="cycle.id"
        />
      </el-select>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.vuex';
import UserRepository from '@/repositories/UserRepository';
@Component<NavbarCrfs>({
  name: 'NavbarCrfs',
  created() {
    this.getAllCycles();
  },
  destroyed() {
    this.$store.commit(MutationState.SET_USERS, []);
    this.$store.commit(MutationState.SET_TEMP_USER, null);
  },
})
export default class NavbarCrfs extends Vue {
  @Prop({ required: true, type: String }) private currentTabComponent!: string;

  private textSearch: string = '';
  private allUsers: any[] = [];
  private listCycles: any[] = [];
  private cycleId: number | string = this.$store.state.cycle.cycleCurrent
    ? this.$store.state.cycle.cycleCurrent - 0
    : '';

  private querySearch(textQuery: string, callback: any) {
    let results: any[] = [];
    if (textQuery) {
      results = this.allUsers.filter((item) => {
        return item.fullName.toLowerCase().includes(textQuery.toLowerCase());
      });
    } else {
      results = this.allUsers;
    }
    callback(results);
  }

  @Watch('cycleId')
  private handleSelectCycle(cycleId: number) {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
  }

  private handleSearchSelect(item) {
    this.$store.commit(MutationState.SET_TEMP_USER, item);
  }

  private async getAllCycles() {
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
    } else {
      try {
        const { data } = await CycleRepository.getListMetadata();
        this.listCycles = data.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }

  private getInforUser(item: any): String {
    if (item.role.name === 'ADMIN') {
      return 'OKRs Master';
    } else if (item.isLeader) {
      return `Trưởng ${item.team.name.toLowerCase()}`;
    } else {
      return `Thành viên ${item.team.name.toLowerCase()}`;
    }
  }

  private async getAllUsers() {
    try {
      const data = await UserRepository.getAllUsers();
      if (data.data.length) {
        this.allUsers = Object.freeze(data.data);
        this.$store.commit(MutationState.SET_USERS, this.allUsers);
      }
    } catch (error) {}
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.navbar-history {
  @include breakpoint-down(phone) {
    display: flex;
    justify-content: space-between;
  }
  &__search {
    display: flex;
    place-content: center flex-start;
    padding: $unit-2 0 $unit-2 0;
    span {
      align-self: center;
    }
    &--info {
      align-self: center;
      line-height: $unit-5;
      padding-left: $unit-2;
    }
  }
  .el-autocomplete {
    width: 100%;
  }
}
</style>
