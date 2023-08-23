<template>
    <v-col :md="input.col_md ?? 12" :cols="input.cols ?? 6">

      <v-select
        v-if="input.type == 'select'"
        hide-details
        :items="input.options"
        :label="input.label"
        background-color="inputBackground"
        class="text-no-wrap rounded-md custom"
        filled
        @input="handleInput"
      >
      </v-select>

      <v-textarea
        v-if="input.type == 'textarea'"
        class="text-no-wrap rounded-md custom"
        :label="input.label"
        auto-grow
        filled
        rows="6"
        @input="handleInput"
        row-height="15"
        background-color="inputBackground"
      ></v-textarea>

      <v-text-field
        v-if="input.type=='text'||input.type=='email'||input.type=='password'"
        :label="input.label"
        :placeholder="input.placeholder"
        filled
        background-color="inputBackground"
        flat
        autocomplete="off"
        hide-details
        :type="input.type"
        class="text-no-wrap rounded-md custom"
        @input="handleInput"
      >
      </v-text-field>
    </v-col>
 
    
</template>

<script>
export default {
  name: "FormInput",
  props: {
    input: {
      type: Object,
      default() {
        return "";
      },
    },
  },
  methods:{
    handleInput (e) {
      this.$emit('input', e)
    }
  }
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
</style>


