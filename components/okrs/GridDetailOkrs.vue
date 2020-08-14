<template>
  <fragment>
    <span class="kr-content">{{ keyResult.content }}</span>
    <span class="kr-target">{{ keyResult.targetValue }}</span>
    <span class="kr-start">{{ keyResult.startValue }}</span>
    <span class="kr-obtained">{{ keyResult.valueObtained }}</span>
    <span class="kr-progress">{{ keyResult.progress }}%</span>
    <a v-if="keyResult.linkPlans" :href="keyResult.linkPlans" target="_blank" class="kr-plan">
      {{ keyResult.linkPlans }}
    </a>
    <span v-else class="kr-plan no-link">Chưa gắn link</span>
    <a v-if="keyResult.linkResults" :href="keyResult.linkResults" target="_blank" class="kr-result">
      {{ keyResult.linkResults }}
    </a>
    <span v-else class="kr-result no-link">Chưa gắn link</span>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component<GridDetailOkeyResults>({ name: 'GridDetailOkeyResults' })
export default class GridDetailOkeyResults extends Vue {
  @Prop(Object) private keyResult!: Object;
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.no-link {
  color: $neutral-primary-2;
}
</style>
