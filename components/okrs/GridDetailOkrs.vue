<template>
  <fragment>
    <span :key="keyResult.content.substring(0, 3)" class="kr-content">{{ keyResult.content }}</span>
    <span :key="keyResult.content.substring(0, 3)" class="kr-target">{{ keyResult.targetValue }}</span>
    <span :key="keyResult.content.substring(0, 3)" class="kr-start">{{ keyResult.startValue }}</span>
    <span :key="keyResult.content.substring(0, 3)" class="kr-obtained">{{ keyResult.valueObtained }}</span>
    <span :key="keyResult.content.substring(0, 3)" class="kr-progress">{{ keyResult.progress }}%</span>
    <a v-if="keyResult.linkPlans" :key="keyResult.content.substring(0, 3)" :href="keyResult.linkPlans" target="_blank" class="kr-plan">
      {{ keyResult.linkPlans }}
    </a>
    <span v-else :key="keyResult.content.substring(0, 3)" class="kr-plan">Chưa gắn link</span>
    <a v-if="keyResult.linkResults" :key="keyResult.content.substring(0, 3)" :href="keyResult.linkResults" target="_blank" class="kr-result">
      {{ keyResult.linkResults }}
    </a>
    <span v-else :key="keyResult.content.substring(0, 3)" class="kr-result">Chưa gắn link</span>
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
</style>
