<template>
  <v-container fluid style="margin-top: 0px !important">
    <v-row class="mx-3">
      <v-col
        cols="12"
        md="12"
        :style="
          $vuetify.breakpoint.xs
            ? ' margin-top: 46px !important'
            : 'margin-top: 0px !important;'
        "
      >
        <v-tabs vertical class="custom-report-generate-tabs">
          <p class="fs-15 fw-600 text--dark">Reports</p>
          <v-tab class="fs-14 fw-700 text-capitalize"> Overview </v-tab>
          <!-- <v-tab class="fs-14 fw-700 text-capitalize"> All Reports </v-tab> -->

          <v-tab-item :class="$vuetify.breakpoint.smAndDown ? 'ml-0' : 'ml-15'">
            <!-- overview tab  -->

            <!-- <GenerateReport :items="items" :heading="heading"/> -->
            <GenerateReport :items="items" :heading="heading1" />
          </v-tab-item>
          <!-- <v-tab-item :class="$vuetify.breakpoint.smAndDown ? 'ml-0' : 'ml-15'"> -->
          <!-- All Reports tab  -->
          <!-- <v-card flat>
              <p class="fs-23 fw-700 mt-0 pt-0">All Reports</p>

              <v-data-table
                :headers="headers"
                :items="desserts"
                :items-per-page="5"
              ></v-data-table>
            </v-card> -->
          <!-- </v-tab-item> -->
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GenerateReport from "../components/generate_reports/tabs/GenerateReport.vue";
export default {
  name: "GenerateReports",

  components: { GenerateReport },

  data: () => ({
    heading: "Generate Reports",
    heading1: "Upcoming Reports",
    items: [
      {
        img: "int-1.svg",
        heading: "Profit & Loss",
        sub_heading: "Shows the company's revenues and expenses",
        to: "/dashboard",
      },
      {
        img: "int-2.svg",
        heading: "Cash summary",
        sub_heading: "See the movement of cash in and out of organisation",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "Accounts Receivable",
        sub_heading: "The money your customers owe to you",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "Accounts Payable",
        sub_heading: "The money you owe as a liability",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "Accounts Payable Aging",
        sub_heading: "Amount you owe to each contact",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "Balance sheet",
        sub_heading: "Financial position of your organization",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "Inventory details",
        sub_heading: "Sales and Purchase detail of inventory",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "VAT Report",
        sub_heading: "VAT report for your organization",
        to: "/dashboard",
      },
      {
        img: "int-3.svg",
        heading: "Custom report",
        sub_heading: "Custom report as per your requirement",
        to: "/dashboard",
      },
    ],
  }),
};
</script>
<style scoped>
.v-tab {
  font-size: 12px !important;
  font-weight: 600 !important;
  justify-content: left !important;
}
:deep(.v-tabs--vertical > .v-tabs-bar .v-tab) {
  border-left: 1px solid #e8ebf6;
}
:deep(.v-tabs--vertical > .v-tabs-bar .v-tabs-slider) {
  height: 62% !important;
  margin-top: 8px !important;
}

/* generate report component style */
.v-sheet.v-card {
  border-radius: 8px !important;
}
</style>
