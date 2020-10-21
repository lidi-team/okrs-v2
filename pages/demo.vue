<template>
  <div>
    <AddOkrs />
    <ItemOkrs />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ItemOkrs from '@/components/okrs/items/index.vue';
import AddOkrs from '@/components/okrs/items/add/index.vue';
@Component<DrillDownPage>({
  name: 'DrillDownPage',
  components: {
    ItemOkrs,
    AddOkrs,
  },
})
export default class DrillDownPage extends Vue {}
</script>
