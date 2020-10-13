<template>
  <div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="id" label="ID" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="Name"> </el-table-column>
      <el-table-column prop="author" label="Author" width="250"></el-table-column>
      <el-table-column label="Type" width="150">
        <template v-slot="{ row }">
          <span>{{ row.type | filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="right" width="80">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            class="el-button el-button--purple el-button--small"
            @click="drillDown(row)"
          ></el-button>
          <el-drawer :visible.sync="selected" size="50%">
            <DrawerObjective :data-children="dataChildren" />
          </el-drawer>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import DrawerObjective from '@/components/drill-down/DrawerObjective.vue';

@Component<DrillDownPage>({
  name: 'DrillDownPage',
  filters: {
    filterType(value: Number) {
      if (value === 2) {
        return 'Objective cá nhân';
      } else if (value === 1) {
        return 'Objective dự án';
      } else {
        return 'Objective công ty';
      }
    },
  },
  components: {
    DrawerObjective,
  },
})
export default class DrillDownPage extends Vue {
  private selected: boolean = false;
  private dataChildren: any = {};
  private tableData: any = [
    {
      id: 1,
      name: 'mus. Proin vel arcu eu odio tristique pharetra. Quisque ac',
      author: 'Le Son Tung',
      grandChildObjectives: [
        {
          id: 7,
          name: 'luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget,',
          author: 'Project 3',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 8,
          name: 'diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent',
          author: 'Project 1',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 10,
          name: 'Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet',
          author: 'Project 2',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 12,
          name: 'faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor',
          author: 'Project 1',
          type: 1,
          grandChildObjectives: [],
        },
      ],
      type: 0,
    },
    {
      id: 2,
      name: 'lectus, a sollicitudin orci sem eget massa. Suspendisse eleifend. Cras',
      author: 'Le Son Tung',
      grandChildObjectives: [
        {
          id: 4,
          name: 'in molestie tortor nibh sit amet orci. Ut sagittis lobortis',
          author: 'Project 2',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 9,
          name: 'In ornare sagittis felis. Donec tempor, est ac mattis semper,',
          author: 'Project 2',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 13,
          name: 'nunc nulla vulputate dui, nec tempus mauris erat eget ipsum.',
          author: 'Project 3',
          type: 1,
          grandChildObjectives: [],
        },
      ],
      type: 0,
    },
    {
      id: 3,
      name: 'dis parturient montes, nascetur ridiculus mus. Proin vel arcu eu',
      author: 'Le Son Tung',
      grandChildObjectives: [
        {
          id: 5,
          name: 'neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris eu turpis.',
          author: 'Project 2',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 6,
          name: 'accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam.',
          author: 'Project 2',
          type: 1,
          grandChildObjectives: [],
        },
        {
          id: 11,
          name: 'neque. Sed eget lacus. Mauris non dui nec urna suscipit',
          author: 'Project 3',
          type: 1,
          grandChildObjectives: [],
        },
      ],
      type: 0,
    },
  ];

  private drillDown(data) {
    this.selected = true;
    this.dataChildren = data;
  }
}
</script>
