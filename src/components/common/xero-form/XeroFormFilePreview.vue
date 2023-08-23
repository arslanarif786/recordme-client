<template>
  <div class="file-viewer-side overflow-x-scroll overflow-y-scroll">
    <img
      v-if="
        ['jpg', 'png', 'jpeg', 'svg'].includes(
          selectedFile?.file?.originalname.split('.').pop()
        ) && data
      "
      :src="file"
      style="object-fit: cover"
    />
    <VueDocPreview
      v-if="
        ['doc', 'docx', 'pptx', 'ppt', 'xlsx', 'xls'].includes(
          selectedFile?.file?.originalname.split('.').pop()
        ) && data
      "
      :value="file"
      type="office"
    />
    <VuePdfEmbed
      v-if="
        ['pdf'].includes(selectedFile?.file?.originalname.split('.').pop()) &&
        data
      "
      :source="file"
    />
  </div>
</template>
<script>
import VueDocPreview from "vue-doc-preview";
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";
export default {
  name: "XeroFormFilePreview",
  components: { VueDocPreview, VuePdfEmbed },
  props: {
    selectedFile: Object,
    file: String,
    data: Boolean,
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.documents-view {
  border-right-style: inset;
  //   border-width: 1.8px !important;
  border-color: hsl(225, 35%, 93%) !important;

  ::-webkit-scrollbar {
    width: 5px;
    margin-right: 10px;
    margin-left: auto;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #e8ebf4;
    border: 2px solid #e8ebf4;
    border-radius: 6px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    // background: #E8EBF4;
    border: 2px solid #e8ebf4;
    border-radius: 6px;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }
}

.file-viewer-side {
  // padding: 10px;
  height: 65vh;
  overflow-y: scroll;
  width: 100%;
  object-fit: contain;

  img {
    max-width: 100%;
  }
}
</style>
