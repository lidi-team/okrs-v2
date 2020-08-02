<template>
  <div class="okrs-page">
    <el-row class="okrs-page__top" type="flex" justify="space-between">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
        <base-top-search-cycle
          :text-cycle="textCycle"
          :text-search-place-holder="textSearchPlaceHolder"
          :text-search="textSearch"
          :options="cycleOkrsSelect"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :span="6" class="okrs-page__top--button">
        <el-button class="el-button el-button--purple el-button-medium" @click="addNewOKRs">Thêm mới OKRs</el-button>
      </el-col>
    </el-row>
    <item-okrs v-for="item in itemOKRsData" :key="item.textHeader" :text-header="item.textHeader" :table-data="item.tableData" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SelectOptionDTO } from '@/constants/app.interface';
@Component<OKRsPage>({ name: 'OKRsPage' })
export default class OKRsPage extends Vue {
  private cycleOkrsSelect: SelectOptionDTO[] = [];
  private textSearchPlaceHolder: string = 'Tìm kiếm OKRs của';
  private textSearch: string = '';
  private textCycle: string = '';

  private addNewOKRs() {
    console.log('ADD new OKRs');
  }

  private itemOKRsData: any[] = [
    { textHeader: 'OKRs toàn công ty', tableData: null },
    { textHeader: 'OKRs nhóm', tableData: null },
    { textHeader: 'OKRs cá nhân', tableData: null },
  ];

  private tempData: any[] = [
    {
      id: 1,
      progress: 0,
      title: 'Đạt doanh thu 400.000.000 Đ trong quý tới',
      isRootObjective: true,
      userId: 1,
      cycleId: 1,
      alignObjectivesId: null,
      keyResults: [
        {
          id: 1,
          startValue: 0,
          valueObtained: 0,
          targetValue: 0,
          content: 'Nắm được 70% kiến thức môn kiểm toán doanh nghiệp',
          progress: 0,
          links: 'https://www.facebook.com/',
          objectiveId: 1,
          measureUnitId: 1,
        },
        {
          id: 2,
          startValue: 0,
          valueObtained: 0,
          targetValue: 0,
          content: 'Tìm kiếm được 10 khách hàng đầu tiên',
          progress: 0,
          links: 'https://www.facebook.com/',
          objectiveId: 1,
          measureUnitId: 2,
        },
      ],
      alignmentObjective: [],
      user: {
        id: 1,
        fullName: 'Phan Văn 2222',
        isLeader: true,
      },
    },
  ];
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.okrs-page {
  width: 85%;
  &__top {
    &--searching {
      padding: $unit-7 0 $unit-4 0;
    }
    &--button {
      display: flex;
      justify-content: flex-end;
      margin: $unit-7 0 $unit-4 0;
    }
  }
}
</style>
