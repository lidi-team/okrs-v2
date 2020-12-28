<template>
  <div class="okrs-detail">
    <el-page-header title="Quay lại" @back="goBack" />
    <div class="okrs-detail--top-action">
      <h1 class="-title-1">Chi tiết mục tiêu</h1>
    </div>
    <div class="box-wrap">
      <h2 class="-title-2 -text-uppercase">{{ objective.title }}</h2>
      <el-row>
        <el-col :span="4">
          <p class="-mb-3 -mt-3 label">Được tạo bởi:</p>
          <p class="-mb-3 label">Trọng số:</p>
          <p class="-mb-3 label">Dự án:</p>
          <p class="-mb-3 label">Mục tiêu cấp trên:</p>
          <p class="-mb-3 label">Tiến độ:</p>
        </el-col>
        <el-col :span="20">
          <p class="-font-bold -text-italic -mb-3 -mt-3">
            {{ objective.user.name }}
          </p>
          <el-rate
            class="-mb-3"
            v-model="objective.weight"
            disabled
            :icon-classes="[
              'el-icon-success',
              'el-icon-success',
              'el-icon-success',
            ]"
            disabled-void-icon-class="el-icon-success"
            disabled-void-color="#FBCFE8"
            :colors="['#EC4899', '#DB2777', '#BE185D']"
          />
          <p class="-mb-3" v-if="!!objective.project">
            {{ objective.project.name }}
          </p>
          <p class="-mb-3" v-if="!!objective.project">
            <nuxt-link
              class="el-link"
              :to="`/okrs/chi-tiet/${objective.project.id}`"
            >
              {{ objective.parentObjective.name }}
            </nuxt-link>
          </p>
          <el-progress
            style="width: 100%"
            :percentage="+objective.progress | round"
            :color="+objective.progress | customColors"
            :text-inside="true"
            :stroke-width="20"
          />
        </el-col>
      </el-row>
    </div>
    <div class="box-wrap">
      <h2 class="-title-2">Kết quả then chốt</h2>
      <el-table :data="objective.keyResults">
        <el-table-column label="Kết quả then chốt" min-width="300">
          <template v-slot="{ row }">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Mục tiêu">
          <template v-slot="{ row }">
            <span>{{ row.targetedValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Giá trị ban đầu">
          <template v-slot="{ row }">
            <span>{{ row.startValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Giá trị đạt được">
          <template v-slot="{ row }">
            <span>{{ row.valueObtained }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đơn vị">
          <template v-slot="{ row }">
            <span>{{ row.measureUnitName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiến độ" width="150">
          <template v-slot="{ row }">
            <div>
              <el-progress
                style="width: 80%"
                :percentage="+row.progress | round"
                :color="+row.progress | customColors"
                :text-inside="true"
                :stroke-width="20"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Link kế hoạch" width="150">
          <template v-slot="{ row }">
            <a :href="`${row.linkPlans}`" target="_blank">
              {{ row.linkPlans }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="Link kết quả" width="150">
          <template v-slot="{ row }">
            <a :href="`${row.linkPlans}`" target="_blank">
              {{ row.linkPlans }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box-wrap">
      <h2 class="-title-2">Mục tiêu liên kết</h2>
      <el-table :data="objective.alignmentObjectives">
        <el-table-column label="Mục tiêu" min-width="300">
          <template v-slot="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Liên kết">
          <template v-slot="{ row }">
            <nuxt-link class="el-link" :to="`/okrs/chi-tiet/${row.id}`">
              Liên kết
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box-wrap">
      <h2 class="-title-2">Mục tiêu con</h2>
      <el-table :data="objective.childObjectives">
        <el-table-column label="Mục tiêu" min-width="300">
          <template v-slot="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Liên kết">
          <template v-slot="{ row }">
            <nuxt-link class="el-link" :to="`/okrs/chi-tiet/${row.id}`">
              Liên kết
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OkrsRepository from '@/repositories/OkrsRepository';
import DetailOkrs from '@/components/OKR/OKRsDetail/OKRsDetailKeyResults.vue';

@Component<OkrsDetailPage>({
  head() {
    return {
      title: 'Chi tiết OKRs',
    };
  },
  components: { DetailOkrs },
  async asyncData({ params }) {
    try {
      const { data } = await OkrsRepository.getDetailOkrsById(+params.id);
      console.log('data', data);
      return {
        objective: Object.freeze(data),
      };
    } catch (error) {
      console.log(error);
    }
  },
})
export default class OkrsDetailPage extends Vue {
  private goBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: 14px;
  color: #606266;
  line-height: 23px;
}
</style>
