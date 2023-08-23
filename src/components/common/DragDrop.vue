<template>
  <div>
    <div v-if="!file">
      <div
        :class="['dropZone', dragging ? 'dropZone-over' : '']"
        @dragenter="dragging = true"
        @dragleave="dragging = false"
      >
        <div class="title">Attachments</div>
        <div class="dropZone-info" @drag="onChange">
          <div class="row justify-center" style="margin: 0 !important">
            <span class="dropZone-title"
              ><v-img
                width="15px"
                height="13.75px"
                class="mt-1"
                src="@/assets/ticket/file-upload.svg"
            /></span>
            <span class="dropZone-title ml-2"
              >Select or drag a file from computer</span
            >
          </div>
          <!-- <span class="dropZone-title"><v-icon>mdi-folder-upload</v-icon></span> -->
          <div class="dropZone-upload-limit-info">
            <div class="file-type">(Supported Files: PNG,JPG,JPEG,DOC,DOCX,PDF,XLSX)</div>
          </div>
        </div>
        <input type="file" @change="onChange" />
      </div>
    </div>
    <div v-else class="dropZone-uploaded">
      <div class="dropZone-uploaded-info">
        <span class="dropZone-title" v-if="file.name"
          >{{ file.name | minimizeFileName }} ({{
            (file.size / (1024 * 1024)).toFixed(2)
          }}mb)</span
        >
        <button
          type="button"
          class="btn btn-primary removeFile"
          @click="removeFile"
        >
          Remove File
        </button>
      </div>
    </div>

    <!-- <div class="uploadedFile-info">
      <div>fileName: {{ file.name }}</div>
      <div>fileZise(bytes): {{ file.size }}</div>
      <div>extension：{{ extension }}</div>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      file: "",
      dragging: false,
    };
  },
  methods: {
    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      if (!files.length) {
        this.dragging = false;
        return;
      }

      this.createFile(files[0]);
    },
    createFile(file) {
      if (
        !file.type.match(".png") &&
        !file.type.match(".jpg") &&
        !file.type.match(".jpeg") &&
        !file.type.match(".doc") &&
        !file.type.match(".docx") &&
        !file.type.match(".pdf") && 
        !file.type.match(".xlsx")
      ) {
        this.$showNotificationBar(
          "error",
          // "Supported files: png,jpg,jpeg,doc,docx,pdf,xlsx"
          "File type is not supported"
        );
        this.dragging = false;
        return;
      }

      if (file.size >= 1000000) {
        this.$showNotificationBar(
          "error",
          "File Size should be less than 1 mb."
        );
        this.dragging = false;
        return;
      }

      this.file = file;
      this.dragging = false;
      this.$emit("file-change", this.file);
    },
    removeFile() {
      this.file = "";
      this.$emit("file-change", this.file);
    },
  },
  computed: {
    extension() {
      return this.file ? this.file.name.split(".").pop() : "";
    },
  },
};
</script>
<style scoped lang="scss">
.dropZone {
  width: 100%;
  height: 100px;
  position: relative;
  // border: 2px dashed #eee;
}

// .dropZone:hover {
// border: 2px solid #2e94c4;
// }

.dropZone .dropZone-title {
  color: #6634e9;
}
.dropZone:hover .dropZone-title {
  color: #6634e9;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 60%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #6634e9;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 6px;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 100%;
  height: 100px;
  position: relative;
  // border: 2px dashed #eee;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 100px;
}
.file-type {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #9d9eab;
  text-align: center;
}
.title {
  font-style: normal;
  font-weight: 500;
  font-size: 12px !important;
  line-height: 16px;
  color: #40415a;
  padding-top: 13px;
  padding-left: 16.5px;
}
</style>
