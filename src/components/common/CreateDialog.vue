<template>
  <div
    :style="
      $vuetify.breakpoint.lg
        ? 'width: 50%; margin: auto !important'
        : 'width: 95%; margin: auto !important; margin-top:12%'
    "
  >
    <v-card style="border-radius: 10px">
      <v-card-title class="d-flex justify-space-between pa-25 pb-0 mt-4">
        <p class="fs-18 fw-600 f-inter">{{ createTicketFields.title }}</p>
      </v-card-title>
      <v-row class="ma-1">
    
        <FormInput
          v-for="(input, index) in createTicketFields.inputs"
          :input="input"
          :key="index"
          @update-value="(n) => (input.model = n)"
          @update-file-input-value="(n) => (input.model = n)"
          @on-enter="createTicket()"
        >
        </FormInput>
      </v-row>
      <v-row class="d-flex justify-end">
        <v-btn
          id="v-step-15"
          class="btn btn-primary primary--text text-capitalize mr-7 mb-5"
          color="lightBackground"
          depressed
          :loading="loader"
          @click="createTicket()"
        >
          <span class="fw-600 fs-14 f-inter">{{ createTicketFields.title }} </span>
        </v-btn>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import FormInput from "../common/FormInput.vue";
import axios from "axios";
import EventBus from "../../js/EventBus";
import UrlServices from "../../services/Url";
import ApiService from "../../services/Api";
import { mapGetters } from "vuex";
export default {
  components: { FormInput },
  data() {
    return {
      loader: false,
      createTicketFields: {
        show: true,
        title: "Record Now",
        dialogType: "form",
        for: "create-ticket",
        inputs: [
          {
            value: "ticketType",
            label: "Ticket type *",
            placeholder: "Select ticket type",
            type: "select",
            options: [],
            default: "OTHERS",
            cols: 12,
            col_md: 12,
            maxLength: "50",
            model: "OTHERS",
            id: "v-step-11",
          },
          {
            value: "currency",
            label: "Currency type *",
            placeholder: "Select currency type",
            type: "select",
            options: [],
            cols: 12,
            col_md: 12,
            default: "",
            maxLength: "50",
            model: "",
            id: "v-step-12",
          },
          {
            value: "file",
            label: "Select or Drag a file from computer",
            type: "file",
            cols: 12,
            col_md: 12,
            model: "",
            useFor: "PWA",
            id: "v-step-13",
          },
          {
            name: "description",
            label: "Description",
            placeholder: "Enter Your Message Here...",
            type: "textarea",
            cols: 12,
            col_md: 12,
            model: "",
            maxLength: "500",
            id: "v-step-14",
          },
          // {
          //     value: "record",
          //     custom_icon:require("@/assets/dashboard/record-icon.png"),
          //     label: "Record voice note",
          //     type: "text",
          //     cols:12,
          //     col_md:12,
          // }
        ],
      },
    };
  },
  async mounted() {
    await this.setCurrency();
    await this.getTicketsType();
    this.listenBus();
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      token: "auth/getAuthToken",
      currentWorkspace: "auth/getCurrentWorkspace",
      paginate: "ticket/getPaginate",
    }),
  },
  methods: {
    listenBus() {
      EventBus.$on("create-ticket-from-tour-guide", () => {
        this.createTicket();
      });
      EventBus.$on("add-description-from-tour-guide", () => {
        this.createTicketFields.inputs[3].model =
          "Ticket Created from Tour Guide";
      });
    },
    getTicketsType() {
      ApiService.GetRequest(UrlServices.ticketTypes)
        .then((response) => {
          if (response.data.data.length > 0)
            this.createTicketFields.inputs[0].options = [];
          response.data.data.forEach((item) => {
            // to set label with respect to design
            this.createTicketFields.inputs[0].options.push({
              label: this.changeStringToSentenceCase(item.title),
              value: item.title,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    changeStringToSentenceCase(item) {
      const arr = item.toLowerCase().split(" ");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      return arr.join(" ");
    },
    setCurrency() {
      this.user.currency.forEach((item) =>
        this.createTicketFields.inputs[1].options.push({
          label: item,
          value: item,
        })
      );
      this.createTicketFields.inputs[1].default = this.user.currency[0];
      this.createTicketFields.inputs[1].model = this.user.currency[0];
    },
    createTicket() {
      if (
        (!this.user.country || this.user.country === "false") &&
        this.user.role === "client"
      )
        return this.$showNotificationBar(
          "error",
          "Please add the country name of this user"
        );
      if (this.createTicketFields.inputs[2].model) {
        if (
          typeof this.createTicketFields.inputs[2].model.name === "string" &&
          /([\\,<>:"/|*?/|;&+#])|(&#092;&#048)|(\0)/g.test(
            this.createTicketFields.inputs[2].model.name
          )
        ) {
          return this.$showNotificationBar(
            "error",
            "Please provide the correct Attachment File name"
          );
        }
        if (this.createTicketFields.inputs[2].model.size / (1024 * 1024) > 5) {
          return this.$showNotificationBar(
            "error",
            "Please provide less size attachment"
          );
        }
      }
      if (
        !this.createTicketFields.inputs[0].model ||
        !this.createTicketFields.inputs[1].model
      ) {
        return this.$showNotificationBar(
          "error",
          "Please provide all the required fields"
        );
      }
      if (
        this.createTicketFields.inputs[2].model ||
        this.createTicketFields.inputs[3].model.trim()
      ) {
        this.loader = true;
        let formData = new FormData();
        formData.append("requestType", this.createTicketFields.inputs[0].model);
        formData.append("currency", this.createTicketFields.inputs[1].model);
        formData.append("file", this.createTicketFields.inputs[2].model);
        formData.append("message", this.createTicketFields.inputs[3].model);
        ApiService.PostRequest(
          `${UrlServices.createTicket}${this.currentWorkspace.workspaceId}`,
          formData
        )
          .then((res) => {
            this.loader = false;
            this.$showNotificationBar("success", "Successfully created");
            this.$store.commit("ticket/addNewTicketinTickets", res.data.data);
            this.$store.commit("ticket/setPaginate", {
              itemsPerPage: 10,
              page: 1,
              lastPage:
                this.paginate.total + 1 < 10
                  ? 1
                  : Math.ceil((this.paginate.total + 1) / 10),
              total: this.paginate.total + 1,
            });
            this.$router.push({ path: "/requests-history" });
            EventBus.$emit("clear-filters");
            // this.$emit("close-popup");
          })
          .catch((e) => {
            const message = e?.response?.data?.message
              ? e?.response?.data?.message
              : "Error Occurred";
            this.$showNotificationBar("error", message);
            this.loader = false;
          });
      } else {
        return this.$showNotificationBar(
          "error",
          "File attachment or description is required"
        );
      }
    },
  },
  beforeDestroy() {
    EventBus.$off("create-ticket-from-tour-guide");
    EventBus.$off("add-description-from-tour-guide");
  },
};
</script>
<style>
/* :deep(.v-menu__content--fixed) {
  margin-top: 20px !important;
} */
</style>
