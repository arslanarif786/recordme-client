<template>
  <div>
    <div v-if="overLayDiv" class="overlay"></div>
    <div>
      <!-- <div id="v-step-0" class="zero-step"></div>
      <div id="v-step-1" class="first-step"></div>
      <div id="v-step-2" class="second-step"></div>
      <div id="v-step-3" class="third-step"></div>
      <div id="v-step-4" class="forth-step"></div>
      <div id="v-step-5" class="fifth-step"></div>
      <div id="v-step-6" class="sixth-step"></div>
      <div id="v-step-7" class="seventh-step"></div>
      <div id="v-step-8" class="eighth-step"></div>
      <div id="v-step-9" class="ninth-step"></div> -->

      <v-tour name="myTour" :steps="steps">
        <template slot-scope="tour">
          <transition name="fade">
            <v-step
              v-if="tour.steps[tour.currentStep]"
              :key="tour.currentStep"
              :step="tour.steps[tour.currentStep]"
              :previous-step="tour.previousStep"
              :next-step="tour.nextStep"
              :stop="tour.stop"
              :skip="tour.skip"
              :is-first="tour.isFirst"
              :is-last="tour.isLast"
              :labels="tour.labels"
              class="step-tour-block"
            >
              <template>
                <div slot="actions">
                  <v-btn
                    v-if="tour.currentStep !== 0"
                    small
                    depressed
                    @click="myCustomPreviousStepCallback(tour)"
                    class="fs-13 fw-600 text-capitalize f-avenir mr-3 btn btn-primary primary--text"
                  >
                    Previous
                  </v-btn>
                  <v-btn
                    v-if="tour.currentStep !== 12"
                    small
                    depressed
                    @click="myCustomNextStepCallback(tour)"
                    class="fs-13 fw-600 text-capitalize f-avenir btn btn-primary primary--text"
                  >
                    Next
                  </v-btn>
                  <v-btn
                    v-if="tour.currentStep === 12"
                    small
                    depressed
                    @click="myCustomFinishCallback(tour)"
                    class="fs-13 fw-600 text-capitalize f-avenir mr-5 btn btn-primary primary--text"
                  >
                    Finish
                  </v-btn>
                  <v-btn
                    v-if="tour.currentStep !== 12"
                    small
                    depressed
                    @click="skipTourGuide(tour)"
                    class="fs-13 fw-600 text-capitalize f-avenir mx-3 btn btn-primary primary--text"
                  >
                    Skip Tour
                  </v-btn>
                </div>
              </template>
            </v-step>
          </transition>
        </template>
      </v-tour>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "../../services/Api";
import UrlServices from "@/services/Url";
import EventBus from "../../js/EventBus";
export default {
  name: "myTour",
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
  data() {
    return {
      overLayDiv: false,
      myCallbacks: {
        onPreviousStep: this.myCustomPreviousStepCallback,
        onNextStep: this.myCustomNextStepCallback,
        onFinish: this.myCustomFinishCallback,
      },
      // array of description messages in the tour guide steps
      steps: [
        {
          target: "#v-step-0",
          content: `Create a workspace`,
        },
        {
          target: "#v-step-1",
          content: "Here you'll see all of your ticket history requests",
        },
        {
          target: "#v-step-2",
          content: "You can generate a ticket",
        },
        {
          target: "#v-step-4",
          content: "You can search and filter your requests here",
        },
        {
          target: "#v-step-5",
          content: "You will see the Details",
        },
        {
          target: "#v-step-6",
          content: "Reports are not active yet.<br>Wait for the new updates.",
        },
        {
          target: "#v-step-9",
          content: "Connect your Accounting Software",
        },
        {
          target: "#v-step-7",
          content: "Create a new account if you don't have one",
        },
        {
          target: "#v-step-8",
          content: "Add your Employees here",
        },
        {
          target: "#v-step-3",
          content: "See the Transaction Analysis here",
        },
        {
          target: "#v-step-10",
          content: "Create Ticket in this section",
        },
        // {
        //   target: "#v-step-11",
        //   content: "Select Ticket Type",
        // },
        // {
        //   target: "#v-step-12",
        //   content: "Select Currency",
        // },
        // {
        //   target: "#v-step-13",
        //   content: "Attach file",
        // },
        {
          target: "#v-step-14",
          content: "Add Fields",
        },
        {
          target: "#v-step-15",
          content: "Record Now ",
        },
      ],
    };
  },
  mounted() {
    // if firstTimeLogin is true, tour guide started
    if (this.user.firstTimeLogin) {
      this.overLayDiv = true;
      setTimeout(() => {
        this.$tours["myTour"].start();
      }, 2000);
    }
  },
  methods: {
    /**
     * This method go to the previous step
     * and changes the routes with respect to the steps
     * @param {*} tour
     */
    myCustomPreviousStepCallback(tour) {
      console.log("curntStep before", tour, tour.currentStep);
      if (tour.currentStep === 5) {
        this.$router.push("/requests-history").then(() => {
          tour.previousStep();
        });
      } else if (tour.currentStep === 2) {
        this.$router.push("/dashboard").then(() => {
          tour.previousStep();
        });
      } else if (tour.currentStep === 6) {
        this.$router.push("/generate-reports").then(() => {
          tour.previousStep();
        });
      } else if (tour.currentStep === 8) {
        this.$router.push("/integration").then(() => {
          tour.previousStep();
        });
      } else if (tour.currentStep === 9) {
        this.$router.push("/settings").then(() => {
          tour.previousStep();
        });
      } else if (tour.currentStep === 10) {
        this.$router.push("/dashboard").then(() => {
          tour.previousStep();
        });
      } else {
        tour.previousStep();
      }
    },
    /**
     * This method go to the next step
     * and changes the routes with respect to the steps
     * @param {*} tour
     */
    myCustomNextStepCallback(tour) {
      console.log("curntStep before", tour, tour.currentStep);
      if (tour.currentStep === 1) {
        this.$router.push("/requests-history").then(() => {
          tour.nextStep();
        });
      } else if (tour.currentStep === 4) {
        this.$router.push("/generate-reports").then(() => {
          tour.nextStep();
        });
      } else if (tour.currentStep === 5) {
        this.$router.push("/integration").then(() => {
          tour.nextStep();
        });
      } else if (tour.currentStep === 7) {
        this.$router.push("/settings").then(() => {
          tour.nextStep();
        });
      } else if (tour.currentStep === 8) {
        if (this.$route.path !== "/dashboard")
          this.$router.push("/dashboard").then(() => {
            tour.nextStep();
          });
      } else if (tour.currentStep === 10) {
        if (this.$route.path !== "/generate-request")
          this.$router.push("/generate-request").then(() => {
            tour.nextStep();
          });
      } else if (tour.currentStep === 11) {
        EventBus.$emit("add-description-from-tour-guide");
        tour.nextStep();
      } else {
        tour.nextStep();
      }
    },
    /**
     * This method finishes the tour guide
     * and set the firstTimeLogin key as false on this action
     * @param {*} tour
     */
    myCustomFinishCallback(tour) {
      EventBus.$emit("create-ticket-from-tour-guide");
      this.updateTourGuideCheck();
      tour.finish();
    },
    skipTourGuide(tour) {
      this.updateTourGuideCheck();
      tour.finish();
    },
    updateTourGuideCheck() {
      this.overLayDiv = false;
      this.user["firstTimeLogin"] = false;
      this.$store.commit("auth/addUser", this.user);
      // API call here
      ApiService.GetRequest(UrlServices.updateFirstLogin)
        .then((res) => {
          console.log(res.data, "update firsttimelogin");
        })
        .catch((err) => {
          console.log("err>>", e);
        });
    },
  },
};
</script>

<style scoped>
#popper[data-popper-reference-hidden] {
  visibility: hidden;
  pointer-events: none;
}
.v-step {
  box-shadow: 0 0 0 99999px rgba(43, 43, 43, 0.4) !important;
}
.step-tour-block {
  border: 1px solid;
  border-color: rgb(221, 219, 219);
  border-radius: 7px !important;
  background-color: white !important;
  color: #2b2442 !important;
}
.zero-step {
  transform: translate3d(610px, 30px, 0px) !important;
}
.first-step {
  transform: translate3d(-490px, 30px, 0px) !important;
}
.second-step {
  transform: translate3d(610px, 120px, 0px) !important;
}
.third-step {
  transform: translate3d(-650px, 30px, 0px) !important;
}
.forth-step {
  transform: translate3d(440px, 35px, 0px) !important;
}
.fifth-step {
  transform: translate3d(335px, 167px, 0px) !important;
}
.sixth-step {
  transform: translate3d(-380px, 30px, 0px) !important;
}
.seventh-step {
  transform: translate3d(-440px, 325px, 0px) !important;
}
.eighth-step {
  transform: translate3d(-430px, 200px, 0px) !important;
}
.ninth-step {
  transform: translate3d(-280px, 30px, 0px) !important;
}
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000;
  opacity: 0.25;
  z-index: 9999;
}
</style>
