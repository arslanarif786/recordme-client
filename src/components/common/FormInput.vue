<template>
  <v-col
    class="custom-column"
    :md="input.col_md ?? 12"
    :cols="input.cols ?? 6"
    :class="input.class"
  >
    <v-select
      :id="input?.id"
      v-if="input.type == 'select'"
      hide-details
      :items="input.options"
      :label="input.label"
      background-color="inputBackground"
      class="text-no-wrap rounded-md custom"
      :class="otherOptionSelected ? 'default-selection-dropdown' : ''"
      filled
      v-on:change="getSelectedValue($event, input)"
      item-text="label"
      item-value="value"
      :value="input.default ? input.default : ''"
      :menu-props="{ closeOnContentClick: false, bottom: true, offsetY: true }"
      :multiple="input.isMultiple"
      :placeholder="input.placeholder"
      :rules="input.rules ? input.rules : []"
    >
      <template v-slot:selection="{ item }">
        <div v-if="item.value == 'other'">
          <v-text-field
            v-model="selectedModelForOther"
            v-if="otherOptionSelected"
            autofocus="true"
            :rules="input.rules ? input.rules : []"
            filled
            background-color="inputBackground"
            flat
            autocomplete="false"
            hide-details
            class="text-no-wrap rounded-md custom other-input-field"
            v-on:change="getSelectedValueLatest($event, input)"
          >
          </v-text-field>
        </div>
        <div v-else>{{ item.label }}</div>
      </template>
    </v-select>

    <v-autocomplete
      :id="input?.id"
      v-if="input.type == 'chipSelect'"
      hide-details
      :items="input.options"
      :label="input.label"
      background-color="inputBackground"
      class="text-no-wrap rounded-md custom fixed-height"
      filled
      chips
      v-on:change="getSelectedValue($event, input)"
      item-text="label"
      item-value="value"
      :menu-props="{ closeOnContentClick: false, bottom: true, offsetY: true }"
      :multiple="input.isMultiple"
      :rules="input.rules ? input.rules : []"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip
          v-if="index === 0 || index === 1"
          class="multiple-selection-chip"
          >{{ item.label }}
        </v-chip>
        <span
          id="hover-click-chip"
          v-if="index === 2"
          class="grey--text text-caption"
          @mouseover="clickChip"
          >(+{{ selectedCurrencyLength - 2 }} others)</span
        >
      </template>
    </v-autocomplete>

    <v-autocomplete
      v-if="input.type == 'autocomplete'"
      cache-items
      class="text-no-wrap rounded-md custom"
      flat
      filled
      hide-no-data
      hide-details
      label="Enter Your Designation"
      background-color="inputBackground"
      autofocus
      @blur="designationValue($event, input)"
      v-model="input.model"
      :rules="input.rules ? input.rules : []"
    ></v-autocomplete>

    <v-textarea
      :id="input?.id"
      v-if="input.type == 'textarea'"
      class="text-no-wrap rounded-md custom"
      no-resize
      :label="input.label"
      :counter="input.maxLength ? input.maxLength : ''"
      filled
      rows="4"
      @input="handleInput"
      row-height="15"
      background-color="inputBackground"
      :maxlength="input.maxLength ? input.maxLength : '100'"
      v-model="textAreaModel"
      @change="onChangeTextArea"
      v-on:keyup.enter="onEnterTextArea($event)"
      :placeholder="input.placeholder"
      :rules="input.rules ? input.rules : []"
    ></v-textarea>

    <!-- this is code of file which will be used (in PWA and mobile) -->

    <!-- <v-menu offset-y v-if="input.type == 'file' && !$vuetify.breakpoint.lg">
      <template v-slot:activator="{ on, attrs }">
        <div class="file-field" v-bind="attrs" v-on="on" v-if="!fileUploaded">
          <div class="row justify-center" style="margin: 0 !important">
            <span class="dropZone-title"
              ><v-img
                width="15px"
                height="13.75px"
                class="mt-1"
                src="@/assets/ticket/file-upload.svg"
            /></span>
            <span class="dropZone-title ml-2">Upload File</span>
          </div>

          <div class="dropZone-upload-limit-info">
            <div class="file-type">
              (Supported Files: PNG,JPG,JPEG,DOC,DOCX,PDF,XLSX)
            </div>
          </div>
        </div>
        <div class="file-field" v-bind="attrs" v-on="on" v-else>
          <div class="row justify-center" style="margin: 0 !important" @click="fileUploaded=false">
            <span class="dropZone-title"
              ><v-img
                width="15px"
                height="13.75px"
                class="mt-1"
                src="@/assets/ticket/file-upload.svg"
            /></span>
            <span class="dropZone-title ml-2">Remove File <v-icon color="red" small>mdi-close</v-icon></span>
          </div>

          <div class="dropZone-upload-limit-info">
            <div class="file-type">
              (File: {{fileInputModel.name?fileInputModel.name:'file.jpeg'}})
            </div>
          </div>
        </div>

      </template>
      <v-list>
        <v-list-item class="cursor-pointer">
          <v-list-item-title
            @click="document.getElementById('mobileImagesFileInput').click()"
            >Upload Photo
            <v-file-input
            
              id="mobileImagesFileInput"
              accept="image/*"
              v-show="false"
              @change="handleInput"
              prepend-icon="mdi-folder-upload"
              v-model="fileInputModel"
            ></v-file-input>
          </v-list-item-title>
        </v-list-item>
        <v-list-item class="cursor-pointer">
          <v-list-item-title
            @click="document.getElementById('mobileFilesInput').click()"
          >
            Upload File
            <v-file-input
              id="mobileFilesInput"
              accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
              v-show="false"
              @change="handleInput"
              prepend-icon="mdi-folder-upload"
              v-model="fileInputModel"
            ></v-file-input>
          </v-list-item-title>
        </v-list-item>
        <v-list-item class="cursor-pointer">
          <v-list-item-title @click="cameraDialog=true">Take Photo</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->

    <div class="file-field" v-if="input.type == 'file'">
      <DragDrop @file-change="changeFile" :id="input?.id"></DragDrop>
      <!-- <div class="title">Attachments</div>
      <v-file-input
        @change="handleInput"
        prepend-icon="mdi-folder-upload"
        :label="input.label"
        v-model="fileInputModel"
      ></v-file-input>
      <p class="file-type">(Supported Files: PDF, DOCX, JPG, PNG)</p> -->
    </div>

    <v-text-field
      v-if="
        input.type == 'text' ||
        input.type == 'email' ||
        input.type == 'password'
      "
      :label="input.label"
      :placeholder="input.placeholder"
      filled
      background-color="inputBackground"
      flat
      autocomplete="false"
      hide-details
      :type="input.type"
      class="text-no-wrap rounded-md custom"
      :append-icon="
        input.name == 'password' || input.name == 'confirmPassword'
          ? input.showIcon
          : ''
      "
      @click:append="
        () =>
          input.type == 'password'
            ? ((input.type = 'text'), (input.showIcon = 'visibility'))
            : ((input.type = 'password'), (input.showIcon = 'visibility_off'))
      "
      @change="onChange($event, input)"
      v-on:keyup.enter="onEnter($event, input)"
      v-model="textFieldmodel"
      :maxlength="input.maxLength ? input.maxLength : '100'"
      :rules="input.rules ? input.rules : []"
      :readonly="readonly"
    >
      <template v-slot:append>
        <v-fade-transition leave-absolute v-if="input.custom_icon">
          <img width="24" height="24" :src="input.custom_icon" />
        </v-fade-transition>
      </template>
    </v-text-field>

    <!-- if input type is date  -->
    <v-menu
      v-if="input.type == 'date'"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
      v-model="datePickerModal"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :label="input.label"
          :placeholder="input.placeholder"
          filled
          background-color="inputBackground"
          flat
          autocomplete="off"
          persistent-placeholder
          hide-details
          class="text-no-wrap rounded-md custom"
          readonly
          v-bind="attrs"
          v-on="on"
          v-model="input.showDateFormat"
          @change="onChange($event, input)"
        ></v-text-field>
        <!-- :type="input.type" -->
      </template>
      <v-date-picker v-model="dates" range no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="datePickerModal = false">
          Cancel
        </v-btn>
        <v-btn text color="primary" @click="setDate()"> OK </v-btn>
      </v-date-picker>
    </v-menu>
    <!-- if input type is checkbox -->
    <v-checkbox
      v-if="input.type == 'checkbox'"
      color="#6634e9"
      :value="input.label"
      :aria-checked="input.value ? true : false"
      hide-details
      :ripple="false"
      v-model="selectedCheckboxes"
      :rules="input.rules ? input.rules : []"
      @click="onCheckboxClicked($event, input.label)"
    >
      <template v-slot:label>
        <p
          class="fs-12 fw-400 mt-4 text-capitalize"
          v-if="$vuetify.breakpoint.lg"
        >
          {{ input.text }}
        </p>
        <p class="fs-8 fw-400 mt-4 text-capitalize" v-else>{{ input.text }}</p>
      </template>
    </v-checkbox>

    <CapturePhotoFromCamera
      v-if="cameraDialog"
      :dialog="cameraDialog"
      @capture="captureImage"
      @off-camera="cameraDialog = false"
    />
  </v-col>
</template>

<script>
import CapturePhotoFromCamera from "../common/CapturePhotoFromCamera.vue";
import DragDrop from "../common/DragDrop.vue";
export default {
  name: "FormInput",
  components: { DragDrop, CapturePhotoFromCamera },
  data: () => ({
    document,
    fileUploaded: false,
    cameraDialog: false,
    selectedModelForOther: "",
    datePickerModal: false,
    dates: [],
    textFieldmodel: null,
    autoCompleteModel: "",
    textAreaModel: "",
    otherOptionSelected: false,
    emailRules: [
      (v) => !!v || "Email is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
        "E-mail must be valid",
    ],
    requiredFieldRules: [(v) => !!v || "Field is required"],
    fileInputModel: [],
    selectedCurrencyLength: 0,
  }),
  props: {
    input: {
      type: Object,
      default() {
        return "";
      },
    },
    customClass: {
      type: String,
      default() {
        return "";
      },
    },
    selectedCheckboxes: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    captureImage(data) {
      console.log("this is capture image in forminput component", data);
      this.fileInputModel = new File([data], "image.jpeg", {
        type: data.type,
      });
      this.cameraDialog = false;
      this.handleInput();
    },
    setSpecificProperty(key, value) {
      this[key] = value;
    },
    getSelectedValueLatest(event, obj) {
      this.$emit("update-value", event);
    },
    resetTextFieldModel() {
      this.textFieldmodel = "";
    },
    setDate() {
      this.dates.sort();
      this.$emit("update-date", this.dates.join("~"));
      this.datePickerModal = false;
    },
    getSelectedValue(event, obj) {
      if (event == "other") {
        console.log(event);
        this.otherOptionSelected = true;
        // this.$emit("update-value", );
      } else {
        this.otherOptionSelected = false;
        this.$emit("update-value", event);
        this.selectedCurrencyLength = event.length;
      }
    },
    onChange(event, input) {
      this.$emit("update-value", this.textFieldmodel);
    },
    onEnter(event, input) {
      this.onChange(event, input);
      this.$emit("on-enter", true);
    },
    handleInput() {
      this.fileUploaded = true;
      console.log("this is file", this.fileInputModel);
      this.$emit("update-file-input-value", this.fileInputModel);
    },
    changeFile(file) {
      this.$emit("update-file-input-value", file);
    },
    onEnterTextArea(event) {
      this.onChangeTextArea();
      if (event.shiftKey === true && event.key === "Enter") {
        return;
      } else {
        this.$emit("on-enter", true);
      }
    },
    onChangeTextArea() {
      this.$emit("update-value", this.textAreaModel);
    },
    onCheckboxClicked(event, value) {
      this.$emit("updateInput", value);
      //this.$emit("updateRequest", value);
    },
    clickChip() {
      document.getElementById("hover-click-chip").click();
    },
  },

  mounted() {
    // used to update value when field is being loaded from saved data.
    if (this.$route.name === "Login") {
      setTimeout(() => {
        this.$emit("update-value", this.textFieldmodel);
      }, 1000);
    }
  },
};
</script>
<style>
/**
Description: This code belongs to input . 
This code remove border and under line of input.
*/

.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(0, 0, 0, 0) !important;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:after {
  border-color: rgba(0, 0, 0, 0) !important;
}

.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: none !important;
  border-style: none !important;
  border-width: 0 !important;
}

.v-text-field > .v-input__control > .v-input__slot:after {
  border-color: none !important;
  border-style: none !important;
  border-width: 0 !important;
}

.theme--light.v-select-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(0, 0, 0, 0) !important;
}
.theme--light.v-select-field > .v-input__control > .v-input__slot:after {
  border-color: rgba(0, 0, 0, 0) !important;
}

.v-select-field > .v-input__control > .v-input__slot:before {
  border-color: none !important;
  border-style: none !important;
  border-width: 0 !important;
}

.v-select-field > .v-input__control > .v-input__slot:after {
  border-color: none !important;
  border-style: none !important;
  border-width: 0 !important;
}
.mdi-eye {
  cursor: pointer;
}
.file-field .v-text-field .v-label {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #6634e9 !important;
}
.file-field .v-icon.v-icon {
  color: #6634e9 !important;
}
</style>

<style lang="scss">
.file-field {
  background: rgba(250, 251, 252, 0.3);
  border: 2px dashed #c9b7f7;
  border-radius: 6px;
  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 12px !important;
    line-height: 16px;
    color: #40415a;
    padding-top: 13px;
    padding-left: 16.5px;
  }
  .v-file-input {
    padding-left: 67px;
  }
  .file-type {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #9d9eab;
    text-align: center;
  }
}
.v-menu__content {
  border-radius: 6px;

  .v-list-item__content {
    padding: 0px !important;
  }

  .v-list {
    padding: 0px;
  }

  .v-list-item__title {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    color: #9d9eab;
  }
  .v-list-item--active .v-list-item__title {
    color: #6634e9 !important;
  }
  .v-list-item:hover {
    background: #f4f1fe;
    border-radius: 3px;
    .v-list-item__title {
      font-family: "Inter";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 19px;
      color: #6634e9;
    }
  }
  .v-list-item {
    min-height: 35px !important;
  }
}
.multiple-selection-chip .v-chip__content {
  background: #f4f1fe;
  padding: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 15px;
  color: #40415a;
}
.default-selection-dropdown .v-select__slot label {
  z-index: 1;
}
.default-selection-dropdown .v-select__selections {
  padding-top: 5px !important;
}
.default-selection-dropdown .v-text-field__slot {
  margin-top: 10px;
}
.other-input-field .v-input__slot {
  padding-left: 0px !important;
}
.v-select.v-select--chips:not(.v-text-field--single-line).v-text-field--enclosed
  .v-select__selections {
  min-height: 0px !important;
}

.mobile-file-upload {
  border-radius: 2%;
  margin: 0px 29px;
  color: white;
  padding-left: 71px;
  padding-top: 7px;
  padding-bottom: 0px;
}
</style>
