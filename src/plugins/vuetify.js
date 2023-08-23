import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";
Vue.use(Vuetify);
export default new Vuetify({
  icons: {
    iconfont: "md",
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#6634E9",
        offWhite: "#FAF9F6",
        secondary: "#BFC0C8",
        headerColor: "#2B2442",
        loginPageBackground: "#2B2442",
        lightBackground: "#F5F2FD",
        textPrimary: "#40415A",
        inputBackground: "#FBFAFD",
        lightGreen: "#4DC1CF",
        appBarButtonBg: "#382F56",
        whiteColor: "#FFFFFF",
        successColor: "#329C47",
        errorColor: "#E13434",
        inActiveColor: "#9d9eab",
        greyColor: "#71727B",
        dialogTitle: "#23272C",
        buttonBg: "#F4F1FE",
        subHeading: "#99A0B5",
        chipColorCompleteText: "#329C47",
        chipColorCompleteBackground: "#E4EDE5",
        chipColorPendingText: "#FAAD13",
        chipColorPendingBackground: "#F5EFE1",
        chipColorClientRespondedText: "#6574C5",
        chipColorClientRespondedBackground: "#E8E9F2",
        chipColorReviewRequestText: "#329C47",
        chipColorReviewRequestBackground: "#E4EDE5",
        chipColorInProgressText: "#56A6D5",
        chipColorInProgressBackground: "#E8EEF2",
        chipColorAwaitingResponseText: "#8B83B2",
        chipColorAwaitingResponseBackground: "#ECEBEF",
        chipColorAuditText: "#176FF2",
        chipColorAuditBackground: "#E1E9F5",
        chipColorRejectedText: "#E73C3C",
        chipColorRejectedBackground: "#F5E4E3",
        CancelRed: "#E73C3C",
        borderColor: "#e8ebf4",
        deleteIcon: "#FFE4E4",
        dashboardBlockColor: "#FCFCFC",
        dashboardBlockBorderColor: "#F3EEFF",
        BankChipColor: "#C4A091",
        dateTextColor : "#40415A"
      },
    },
  },
});
