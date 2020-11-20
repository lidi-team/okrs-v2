<template>
  <div class="grid-key-result">
    <span class="kr-content">{{ keyResult.content }}</span>
    <span class="kr-target">{{ keyResult.targetedValue }}</span>
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
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component<GridDetailOkeyResults>({ name: 'GridDetailOkeyResults' })
export default class GridDetailOkeyResults extends Vue {
  @Prop(Object) private keyResult!: Object;
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.grid-key-result {
  padding-bottom: $unit-4;
  &:first-child {
    padding-top: $unit-4;
  }
  &:last-child {
    padding-bottom: 0;
  }
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas: 'kr-content kr-target kr-start kr-obtained kr-progress kr-plan kr-result';
  .kr-content {
    grid-area: kr-content;
  }
  .kr-target {
    grid-area: kr-target;
  }
  .kr-start {
    grid-area: kr-start;
  }
  .kr-obtained {
    grid-area: kr-obtained;
  }
  .kr-progress {
    grid-area: kr-progress;
  }
  .kr-plan {
    grid-area: kr-plan;
  }
  .kr-result {
    grid-area: kr-result;
  }
  .kr-content,
  .kr-target,
  .kr-start,
  .kr-obtained,
  .kr-progress,
  .kr-plan,
  .kr-result {
    font-size: 0.875rem;
    color: $neutral-primary-3;
  }
  .kr-plan {
    @include truncate-oneline();
    padding-right: $unit-4;
    color: $blue-primary-1;
  }
  .kr-result {
    @include truncate-oneline();
    color: $blue-primary-1;
  }
}
.no-link {
  color: $neutral-primary-2 !important;
}
</style>
