<template>
  <div class="align-okrs-form">
    <el-form
      ref="alignOkrs"
      :model="syncAlignOkrs"
      class="align-okrs-form__input"
    >
      <el-form-item prop="objectiveId">
        <el-select
          v-model.number="syncAlignOkrs.id"
          filterable
          no-match-text="Không tìm thấy kết quả"
          placeholder="Chọn OKRs liên kết chéo"
        >
          <el-option
            v-for="item in itemsAlignOkrs"
            :key="item.id"
            :label="getLabel(item)"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div
      class="align-okrs-form__delete"
      @click="deleteAlignOkrs(indexAlignForm)"
    >
      <el-tooltip content="Xóa" placement="right-start">
        <icon-delete />
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import IconDelete from '@/assets/images/common/delete.svg';
import { ObjectiveAlignDTO } from '@/components/OKR/constants';

@Component<AlignObjective>({
  name: 'AlignObjective',
  components: {
    IconDelete,
  },
  created() {
    this.itemsAlignOkrs = this.$store.state.okrs.listObjectiveAlign;
  },
})
export default class AlignObjective extends Vue {
  @PropSync('alignOkrs', {
    type: Object,
    required: true,
    default: () => ({
      objectiveId: null,
    }),
  })
  private syncAlignOkrs!: any;

  @Prop(Number) private indexAlignForm!: number;

  private itemsAlignOkrs: any[] = [];

  getLabel(data: ObjectiveAlignDTO): String {
    return `[${data.user} - ${data.type === 2 ? 'Cá nhân' : 'Dự án'}] ${
      data.name
    }`;
  }

  private deleteAlignOkrs(indexAlignForm: number) {
    this.$emit('deleteAlignOkrs', indexAlignForm);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.align-okrs-form {
  display: flex;
  place-content: center space-between;
  &__input {
    width: 100%;
  }
  &__delete {
    &:hover {
      cursor: pointer;
    }
    margin-left: $unit-2;
    margin-top: $unit-2;
  }
}
</style>
