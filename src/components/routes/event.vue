<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import moment from "moment";
import SearchBox from "../common/search-box.vue";
import { IEvent } from "../../common/model";
import DetailData from "../common/detail-data.vue";
import { ElPagination, ElTable } from "element-plus";
import { DoughnutChart, BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import store from "../../common/store";

Chart.register(...registerables);
Chart.defaults.color = "#fff";
Chart.defaults.borderColor = "#535353";

const detailRef = ref();
const currentPage = ref(1);
const loading = ref(false);
const tableData = computed<IEvent[]>(() => store.state.eventDatas);
const tableRef = ref();
const keySearch = ref("");
const startTime = ref(0);
const endTime = ref(0);

const testData2 = {
  labels: [
    "2/2",
    "3/2",
    "4/2",
    "5/2",
    "6/2",
    "7/2",
    "8/2",
    "9/2",
    "10/2",
    "11/2",
    "12/2",
    "13/2",
    "14/2",
    "15/2",
  ],
  datasets: [
    {
      label: "events",
      data: [
        6785, 4697, 5745, 5912, 8974, 6674, 5794, 4741, 6571, 7451, 5347, 4754,
        6814, 4514,
      ],
      backgroundColor: ["#77CEFF"],
    },
  ],
};

const options = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
});

const openDetailDialog = (val: object, id: any) => {
  if (detailRef?.value.showDetailData) {
    detailRef?.value.showDetailData(val, id);
  }
};

const searchData = async (param: any) => {
  loading.value = true;
  keySearch.value = param.keySearch;
  startTime.value = param.startTime;
  endTime.value = param.endTime;
  await store.dispatch("getEventData", param);
  await store.dispatch("getEventChart", param);
  currentPage.value = 1;
  loading.value = false;
};
const getPagingData = () => {
  const temp = {
    currentPage: currentPage.value,
    startTime: startTime.value,
    endTime: endTime.value,
  };
  store.dispatch("getEventData", temp);
};

onMounted(async () => {
  await nextTick(() => store.dispatch("getCurrentPageMounted"));
});
</script>
<template>
  <div class="event">
    <div class="event-header">
      <search-box @search-datas="searchData" />
    </div>
    <div class="event-result" v-loading="loading">
      <div class="event-result-chart">
        <div class="event-result-chart-wrap">
          <BarChart :chartData="testData2" :height="150" :options="options" />
        </div>
      </div>
      <div class="event-result-table">
        <div class="mb-2">Total: 4514 events</div>
        <div class="table-titles d-flex">
          <div class="title-item event-title-id">ID</div>
          <div class="title-item event-title-localtime">Local Time</div>
          <div class="title-item event-title-source">Source</div>
          <div class="title-item event-title-utctime">UTC Time</div>
          <div class="title-item event-title-data">Data</div>
        </div>

        <el-table
          :highlight-current-row="false"
          :data="tableData"
          style="width: 100%"
          max-height="800px"
          ref="tableRef"
        >
          <el-table-column width="210">
            <template #default="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column width="180">
            <template #default="scope">
              <span>{{
                moment(scope.row.localTime).format("DD/MM/YYYY HH:mm:ss")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #default="scope">
              <span>{{ scope.row.source }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template #default="scope">
              <span>{{
                moment(scope.row.utcTime).format("DD/MM/YYYY HH:mm:ss")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <span
                class="data"
                @click="openDetailDialog(scope.row.data, scope.row.id)"
                >Click to see detail</span
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:current-page="currentPage"
          @current-change="getPagingData"
          background
          layout="prev, pager, next"
          :total="100"
        />
      </div>
    </div>
  </div>
  <detail-data ref="detailRef" />
</template>
<style scoped>
@import url("../css//el-table.css");
.event {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.event-header {
  width: 100%;
  background-color: #363c41;
  border-radius: 4px;
}

/* RESULT  */
.event-result {
  width: 100%;
  height: calc(100% - 102px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* RESUTL CHART  */
.event-result-chart {
  height: 150px;
  background-color: #363c41;
  padding-inline: 30px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.event-result-chart-wrap {
  width: 100%;
}
/* RESULT TABLE  */
.event-result-table {
  background-color: #363c41;
  padding: 10px;
  border-radius: 4px;
  color: white;
}

:deep(.el-input:not(.el-input--medium) .el-input__wrapper) {
  box-shadow: unset;
  border-radius: unset;
}
</style>
