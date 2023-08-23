<template>
  <div>
    <v-row class="ml-3 mr-1">
      <v-col cols="8" class="pb-1 mt-1">
        <p class="fs-20 fw-600 f-inter mb-0 ml-4">Transaction Analysis</p>
      </v-col>
      <v-col cols="4">
        <v-row>
        </v-row>
      </v-col>
      <v-col cols="12" class="ml-3 mr-4 pr-5">
        <v-card
          flat
          class="pa-0 pr-3 ma-0"
          style="overflow: auto; border: 1px solid #e8ebf4"
          :loading="loader"
        >
          <highcharts :options="options"></highcharts>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import apiService from "@/services/Api.js";
import { mapGetters } from "vuex";
import moment from "moment";
import EventBus from "../../js/EventBus";

export default {
  data() {
    return {
      loader: true,
      startOfMonth: localStorage.getItem("startOfMonth"),
      selectOptionModel: "",
      selectOptions: ["All Requests"],
      options: {
        chart: {
          type: "column",
        },
        title: {
          text: "Number of Transactions",
          align: "left",
        },
        colors: [
          "#F8D5A3",
          "#A9DAFC",
          "#7C89CE",
          "#66C59A",
          "#C4A091"
        ],

        xAxis: {
          categories: [],
          colorByPoint: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: "Transactions Data",
          },

          stackLabels: {
            style: {
              borderWidth: "1",
              color:
                // theme
                (Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color) ||
                "gray",
              textOutline: "none",
            },
          },
          labels: {
            style: {
              borderWidth: "2",
              fontWeight: "200",
              fontSize: "8px",
            },
          },
        },
        plotOptions: {
          series: {
            pointWidth: 20,
          },
          column: {
            stacking: "normal",
          },
        },
        series: [],
      },
      filterData: {},
    };
  },
  mounted() {
    this.load();
    EventBus.$on("dashboard-filter", (data) => {
      this.filterData = data;
      this.load();
    });
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  methods: {
    load() {
      const url =
        this.filterData.endOfMonth &&
        this.filterData.endOfMonth.length > 4 &&
        this.filterData.startOfMonth &&
        this.filterData.startOfMonth.length > 4
          ? `from=${this.filterData.startOfMonth}&to=${this.filterData.endOfMonth}`
          : "";
      apiService
        .GetRequest(
          `workspace/ticket-graph/${this.currentWorkspace.workspaceId}?${url}`
        )

        .then((res) => {
          this.options.xAxis.categories = res.data.data.categories.map(
            (ele) => {
              return moment(String(ele)).format("DD MMM YY");
            }
          );
          console.log(res.data, "chart")
          const namesToBeReplaced = {
            Pending: "Pending",
            InProgress: "In Progress",
            AwaitingResponse: "Awaiting Response",
            ClientResponded: "Responded",
            Complete: "Completed",
            ReviewRequest: "Review Request",
          };
          // this.options.xAxis.categories = res.data.data.categories;
          this.options.series = res.data.data.series.map((serie) => {
            return { ...serie, name: namesToBeReplaced[serie.name] };
          });
          this.loader = false;

          // resolve(res);
        })
        .catch((err) => {
          // reject(err);
        });
    },
  },
};
</script>
<style scoped>
:deep(.highcharts-title) {
  font-weight: 500 !important;
  font-size: 16px !important;
}
</style>
