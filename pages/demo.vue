<template>
  <div>
    <!-- truyền vào objective id để lấy list objective cha -->
    <ButtonCreate />
    <AddOkrs />
    <ItemOkrs />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ItemOkrs from '@/components/okrs/items/index.vue';
import AddOkrs from '@/components/okrs/items/add/index.vue';
import ButtonCreate from '@/components/okrs/items/button/index.vue';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
  components: {
    ItemOkrs,
    AddOkrs,
    ButtonCreate,
  },
})
export default class DrillDownPage extends Vue {}
</script>
