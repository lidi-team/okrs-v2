<template>
  <div>
    <p>hello</p>
    <ItemOkrs />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ItemOkrs from '@/components/okrs/items/index.vue';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
  components: {
    ItemOkrs,
  },
})
export default class DrillDownPage extends Vue {}
</script>

<style lang="scss" scoped></style>
