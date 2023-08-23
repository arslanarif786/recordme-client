<template>
  <v-row>
    <v-col md="12" cols="12" sm="12">
      <p class="fs-20 fw-600 f-inter mt-0 pt-0">{{ heading }}</p>
    </v-col>
    <v-col
      md="3"
      cols="12"
      sm="12"
      :class="heading.toLowerCase() == 'upcoming reports' ? 'inactive' : ''"
      v-for="(item, index) in items"
      :key="index"
    >
      <v-card
        class="pl-4 pr-4 pt-1 custom-report-card"
        outlined
        height="160"
        width="282"
      >
        <v-row class="ma-1 mt-0">
          <v-col cols="12" class="ml-0 pl-0 pr-0">
            <v-list-item-title
              class="fs-16 fw-700 pa-0 ma-0 text-capitalize item-title"
            >
              {{ item.heading }}
              <v-list-item-subtitle
                class="pt-2 fs-13 fw-400"
                justify="center"
                >{{ item.sub_heading }}</v-list-item-subtitle
              >
            </v-list-item-title>
            <v-col
              :class="
                $vuetify.breakpoint.lg
                  ? 'pt-0 pb-1'
                  : 'pt-0 pb-1 justify-items-center display-grid'
              "
              cols="12"
            >
              <v-btn
                class="btn-primary primary--text text-capitalize connect-btn postion-absolute b-14"
                color="lightBackground"
                depressed
                :width="$vuetify.breakpoint.smAndDown ? '' : '228'"
                height="35"
                :disabled="heading.toLowerCase() == 'upcoming reports'"
                ><span class="fw-700 fs-14">Generate Request </span
                ><v-icon dark right> east </v-icon></v-btn
              >
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "GenerateReport",
  props: ["items", "heading"],

  components: {},

  data: () => ({}),
};
</script>
<style scoped lang="scss">
.custom-report-card {
  border-radius: 8px;
}
.connect-btn {
  border-radius: 8px;
}
.custom-report-card .v-btn--disabled {
  background-color: var(--v-lightBackground-base) !important;
  border-color: var(--v-lightBackground-base) !important;
  color: var(--v-primary-base) !important;
}
.custom-report-card .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: var(--v-lightBackground-base) !important;
}

.custom-report-card .theme--light.v-btn.v-btn--disabled .v-icon,
.theme--light.v-btn.v-btn--disabled .v-btn__loading {
  color: var(--v-primary-base) !important;
}
.inactive {
  filter: opacity(0.5);
}
.custom-report-card .item-title {
  overflow: inherit !important;
  white-space: inherit !important;
  line-height: 22px !important;
  font-weight: 500 !important;
}

.custom-report-card .v-list-item__subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: initial;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
