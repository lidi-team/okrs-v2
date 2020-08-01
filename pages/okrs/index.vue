<template>
  <fragment>
    <top-okrs />
    <item-okrs v-for="item in itemOKRsData" :key="item.textHeader" :text-header="item.textHeader" :table-data="item.tableData" />
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<OKRsPage>({ name: 'OKRsPage' })
export default class OKRsPage extends Vue {
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
<style lang="scss" scoped></style>
