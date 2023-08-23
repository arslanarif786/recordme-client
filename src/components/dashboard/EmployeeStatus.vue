<template>
  <div class="mb-5 ml-1">
    <div class="mb-4 fw-600 fs-18 f-inter">Employee Status</div>

    <v-data-table
      :headers="headers"
      :items="employeeStats"
      :items-per-page="5"
      hide-default-footer
      :loading="loading"
      mobile-breakpoint="300"
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td class="fs-14 fw-400 f-inter">{{ index + 1 }}</td>
          <td class="fs-14 fw-400 f-inter">{{ item.name }}</td>
          <td class="fs-14 fw-400 f-inter">{{ item.totalCount }}</td>
          <td class="fs-14 fw-400 f-inter">{{ item.pendingCount }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      employeeStats: [],
      loading: false,
      headers: [
        {
          text: "No.",
          align: "start",
          sortable: false,
          value: "number",
          sortable: false,
          width: "62px",
          class: "fw-500 fs-14 font-inter",
        },
        {
          text: "Username",
          value: "name",
          sortable: false,
          class: "fw-500 fs-14 font-inter",
        },
        {
          text: "Total Tickets",
          value: "totalCount",
          sortable: false,
          class: "fw-500 fs-14 font-inter",
        },
        {
          text: "Pending Audit Tickets",
          value: "pendingCount",
          sortable: false,
          class: "fw-500 fs-14 font-inter",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  methods: {
    getEmployeeStats() {
      this.loading = true;
      this.$store
        .dispatch("dashboard/employeeStats", this.currentWorkspace)
        .then((res) => {
          console.log(res);
          this.employeeStats = res.data.data;
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getEmployeeStats();
  },
};
</script>

<style scoped>
:deep .v-data-table__wrapper tbody tr td {
  border: 1px solid var(--v-borderColor-base);
  border-right: none;
}

:deep .v-data-table__wrapper tbody tr td:last-child {
  border-right: 1px solid var(--v-borderColor-base);
}

:deep .v-data-table-header tr th {
  border: 1px solid var(--v-borderColor-base);
  border-right: none;
}

:deep .v-data-table-header tr th:last-child {
  border-right: 1px solid var(--v-borderColor-base);
}
:deep .v-data-table-header {
  background: var(--v-inputBackground-base);
  border: 1px solid var(--v-inputBackground-base);
}
:deep .v-data-table__wrapper {
  border: 1px solid var(--v-borderColor-base);
  border-radius: 6px !important;
}
</style>
