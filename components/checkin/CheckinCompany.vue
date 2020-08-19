<template>
  <my-okrs-checkin :loading="loading" :table-data="tableData" />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<CheckinCompany>({
  name: 'CheckinCompany',
})
export default class CheckinCompany extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
}
</script>
