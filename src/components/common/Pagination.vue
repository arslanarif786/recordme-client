<template>
  <div
    :class="
      user
        ? 'custom-pagination-container mt-2 mr-0 ml-0'
        : 'custom-pagination-container pa-3 ma-0'
    "
    v-if="totalCount > 0"
  >
    <div :class="$vuetify.breakpoint.lg ? 'footer-pagination' : ''" cols="12">
      <div
        :class="
          user
            ? 'user-footer-pagination-para pagination-enteries font-13 ma-0'
            : 'footer-pagination-para pagination-enteries font-13 ma-0'
        "
        v-if="showDataDetails"
      >
        <span
          class="d-flex align-baseline justify-center"
          v-if="pagination > 0"
        >
          Showing
          <v-select
            :items="items"
            dense
            filled
            v-model="numberOfRecords"
            @change="selectedRecords()"
            class="custom-pagination bg-color mx-2 width-removed"
          ></v-select>
          of {{ pagination }} entries
        </span>
        <span v-else> No Records to show </span>
      </div>
      <v-spacer v-if="$vuetify.breakpoint.lg"></v-spacer>
      <div
        class="footer-pagination-items ma-0 pa-0"
        :class="[
          user ? 'user-footer-pagination-items' : position,
          $vuetify.breakpoint.lg ? 'justify-end' : 'justify-center',
        ]"
      >
        <!-- Previous button -->
        <v-btn
          :disabled="page == 1"
          @click="prevPageButton"
          class="prev-btn"
          elevation="0"
          ><v-icon class="pagination-btn-icon fs-22"
            >mdi-chevron-left</v-icon
          ></v-btn
        >
        <v-pagination
          :value="page"
          @input="$emit('page-number-changed', $event)"
          @next="$emit('next-page-changed')"
          @previous="$emit('previous-page-changed')"
          :total-visible="7"
          :length="xCount ? xCount : pageCounter"
          color="#000"
          class="custom-pagination"
        ></v-pagination>
        <!-- Next button -->
        <v-btn
          :disabled="totalCount == 0 || page === xCount"
          @click="nextPageButton"
          class="next-btn"
          elevation="0"
          ><v-icon class="pagination-btn-icon font-15"
            >mdi-chevron-right</v-icon
          ></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Description: This pagination component is used throughout the application to maintain the styling. The component 
   can show current page text based on prop, page buttons and items per page textfield.
 */

import EventBus from "../../js/EventBus";

export default {
  name: "pagination",
  data() {
    return {
      numberOfRecords: null,
      items: [5, 10, 15, 20],
      itemNumber: null,
      xCount: null,
      pageCounter: 0,
    };
  },
  props: {
    page: {
      type: Number,
      default: 0,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    itemsPerPage: {
      type: Number,
      default: 0,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    showDataDetails: {
      type: Boolean,
      default: true,
    },
    showCustomPageItems: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "justify-end",
    },
    user: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pagination() {
      this.page = this.page ? this.page : 1;
      const numberofrecords = this.itemsPerPage ? this.itemsPerPage : 10;
      this.numberOfRecords = numberofrecords;
      const total = this.totalCount;
      this.checkMode();
      return total;
    },
  },
  methods: {
    /**
     * handle items per page proprty. Change data when items per page changes
     */
    itemsPage(event) {
      if (event) {
        this.itemsPerPage = parseInt(event);
        this.$emit("items-per-page-change", parseInt(event));
      }
    },

    /**
     * previous button click handler
     */
    prevPageButton() {
      let prepage = this.page - 1;
      if (this.page > 1) {
        this.$emit("prev-page-change", prepage);
      }
    },
    /**
     * next button click hanlder
     */
    nextPageButton() {
      this.pageCounter = this.pageCount;
      let newpage = this.page + 1;
      if (this.page < this.pageCounter || this.page < this.xCount) {
        this.$emit("next-page-change", newpage);
      }
    },
    /**
     * check Mode of pagination number
     */
    checkMode() {
      this.pageCounter = this.pageCount;
      if (this.totalCount % this.numberOfRecords == 0) {
        this.pageCounter = this.totalCount / this.numberOfRecords;
        this.xCount = Math.floor(this.pageCounter);
      } else {
        this.pageCounter = this.totalCount / this.numberOfRecords;
        this.pageCounter++;
        this.xCount = Math.floor(this.pageCounter);
      }
    },
    /**
     * dropdown to show number of records
     */
    selectedRecords() {
      this.$store.commit("ticket/setPageItems", this.numberOfRecords);
      EventBus.$emit("get-employees");
      EventBus.$emit("global-search");
      this.checkMode();
    },
  },
  mounted() {
    // console.log(
    //   "this is page =====>",
    //   this.page,
    //   this.pageCount,
    //   this.totalCount,
    //   this.itemsPerPage
    // );
    this.checkMode();
    return this.totalCount > 0
      ? "Showing " +
          (this.page * this.itemsPerPage <= this.totalCount
            ? this.page * this.itemsPerPage
            : this.totalCount) +
          " of " +
          this.totalCount +
          " entries"
      : "No Records to show";
  },
};
</script>
<style>
/* Table Footer pagination */
.footer-pagination-para {
  display: flex;
  width: 25%;
  margin-left: 20px;
}
.user-footer-pagination-para {
  display: flex;
  width: 25%;
  /* margin-left: 10px; */
}

.footer-pagination-items {
  display: flex;
  align-items: center;
  width: 100%;
  margin-right: 16px;
}
.user-footer-pagination-items {
  display: flex;
  align-items: center;
  width: 100%;
  margin-right: 0px;
}

.pagination-enteries {
  font-family: "Inter", sans-serif;
  font-weight: 400 !important;
  font-size: 12px;
  line-height: 16px;
  width: 304px;
}

.pagination-text {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 12px;
  padding: 0px 5px !important;
  line-height: 16px;
}

.search-pagination {
  width: 81px !important;
  margin: 0px 10px !important;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 400;
  flex: 0 0 auto !important;
}

.footer-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Pagination end */

.v-pagination li:nth-child(1),
.v-pagination li:last-child {
  display: none !important;
}

.next-btn,
.prev-btn {
  border-radius: 4px;
  height: 18px !important;
  width: 18px !important;
  min-height: 18px !important;
  min-width: 18px !important;
  padding: 0px !important;
}
.pagination-btn-icon {
  color: #bab9b6 !important;
}
.custom-pagination .v-pagination__navigation {
  box-shadow: none !important;
}
.custom-pagination .v-pagination__item {
  box-shadow: none !important;
  font-family: "Inter", sans-serif;
  margin: 0px !important;
  padding: 0px !important;
  font-size: 12px !important;
  color: #8990a2 !important;
}
.custom-pagination .v-pagination__item--active {
  /* color: #292b30 !important; */
  font-size: 11px !important;
  font-weight: 600 !important;
  background-color: #6634e9 !important;
  color: white !important;
}
.custom-pagination-container {
  margin: 0px 10px;
}
:deep(.theme--light.v-btn.v-btn--has-bg) {
  background-color: #fff;
}
.custom-pagination-container .theme--light.v-btn.v-btn--has-bg {
  background-color: #fff;
}
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #fff !important;
}
.theme--light.v-btn.v-btn--disabled {
  color: #fff !important;
}
.width-removed {
  width: 58px !important;
  min-height: 37px !important;
}
.custom-pagination-container
  .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot,
.v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0 0 0 8px;
}
.custom-pagination-container .v-input__slot {
  font-size: 12px;
  font-weight: 600;
  background-color: #fbfafd !important;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  color: none !important;
}

.theme--light.v-pagination .v-pagination__item--active {
  color: #6634e9 !important;
  background: #e7e0fd !important;
  height: 31px;
}
</style>

<style scoped>
:deep .v-select__slot {
  font-weight: 700 !important;
}
</style>
