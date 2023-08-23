<template>
  <div>
    <div>
      <div v-if="message.file && message.fileUrl.includes('audio.wav')">
        <!-- <div 
        :class=" [
        roleArray.includes(message.userRole) == true
         ? 'msg send py-2'
          : 'msg receive py-2',
         ]
      " > -->
      <div class="rounded-lg" style="background-color : #FAF9FF">
          <AudioWaveform v-if="url" :audio="url" :id="message._id"></AudioWaveform>
        </div>
      </div>
      <div v-else :class=" [
        roleArray.includes(message.userRole) == true
          ? 'msg send py-2'
          : 'msg receive py-2',
          message.fileUrl ? 'pa-1' : '']
      ">
        {{ message.text }}
        <div
          class="d-flex justify-end"
          :class="{ 'pt-2': !!message.text }"
          v-if="message.file"
        >
          <!-- @/assets/general-format.jpeg -->
          <div class="documents" @click="openPrivateUrl(message.fileUrl)">
            <v-img
              v-if="
                message.previewFileName &&
                message.previewFileName !== 'type not supported'
              "
              class="preview-image"
              :src="backendURL + message.previewFileName"
              width="304px"
              height="111px"
              cover
            ></v-img>
            <v-img
              v-else
              class="preview-image"
              src="@/assets/general-format.jpeg"
              width="304px"
              height="111px"
              contain
            ></v-img>
            <div class="description">
              <v-img
                v-if="
                  ['jpg', 'png', 'jpeg', 'doc', 'xls','xlsx', 'pdf','csv','zip','docx'].includes(
                    message.file.originalname.split('.').pop()
                  )
                "
                class="file-type"
                max-width="26"
                max-height="33"
                :src="
                  require(`@/assets/dashboard/${message.file.originalname
                    .split('.')
                    .pop()}.svg`)
                "
              ></v-img>
              <v-img
                v-else
                class="file-types"
                max-width="26"
                max-height="33"
                src="@/assets/dashboard/other.svg"
              ></v-img>
              <div class="detail">
                <p class="file-name text-left">
                  {{ message.file.originalname }}
                </p>
                <p class="file-date text-left">
                  Shared Date {{ message.createdAt | formatDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- <p
          v-if="message.fileUrl"
          class="primary--text ma-0 pa-0"
          @click="openPrivateUrl(message.fileUrl)"
          style="cursor: pointer"
        >
          <v-img
            height="50"
            width="50"
            v-if="
              ['jpg', 'png', 'jpeg', 'doc', 'xls', 'pdf'].includes(
                message.fileUrl.split('.').pop()
              )
            "
            :src="
              require(`@/assets/dashboard/${message.fileUrl
                .split('.')
                .pop()}.svg`)
            "
          ></v-img>
          <v-img
            height="50"
            width="50"
            v-else
            src="@/assets/dashboard/other.svg"
          ></v-img>
          {{ message.file.originalname | minimizeFileName }}
        </p> -->
      </div>
    </div>
    <div
      :class="
        roleArray.includes(message.userRole) == true
          ? 'time text-right'
          : 'time'
      "
    >
      {{ message.createdAt | formatTime }}
    </div>
  </div>
</template>

<script>
import AudioWaveform from "../common/AudioWaveform.vue";
import {isIOS, isSafari } from "mobile-device-detect";
export default {
  name: "MessageFormat",
  data() {
    return {
      url: "",
      safari:isSafari,
      ios:isIOS,
      roleArray: ["client", "employee"],
      backendURL: process.env.VUE_APP_BACK_END_URL,
    };
  },
  components: {
    AudioWaveform,
  },
  props: {
    message: Object,
  },
  mounted() {
     
    if (this.message.file && this.message.fileUrl.includes("audio.wav")) {
      const getBlob = async () => {
        this.url = await this.b64toBlob(this.message.file);
        this.url = window.URL.createObjectURL(this.url);

    
      };
      getBlob();
    }
  },
  filters: {
    minimizeFileName(value) {
      if (!value) {
        return "";
      } else {
        var file = value.split(".");
        var name = file[0];
        if (name.length > 10) {
          name = name.substring(0, 10);
          return name + "... ." + file[1];
        }
      }
      return value;
      // .split('.')[0].substring(0, 10) +'... .'+ message.file.originalname.split('.')[1]
      // value = value.toString()
      // return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
  methods: {
    openPrivateUrl(url) {
      this.$emit("openPrivateUrl", url);
    },
    async b64toBlob(b64Data, contentType = "audio/wav", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

     if(this.safari || this.ios)
     {
       contentType="audio/wav";
     } else{
       contentType=" ";
     }

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
  },
};
</script>

<style lang="scss" scoped>
.documents {
  background: #ffffff;
  border: 1px solid #e8ebf4;
  border-radius: 8px;
  padding: 11px;
  margin-bottom: 16px;
  max-width: 270px;

  cursor: pointer;
  .description {
    display: flex;
    margin-top: 8px;
    p {
      margin-bottom: 0px;
      display: block;
    }
  }
  .file-type {
    height: 32px;
    max-width: 32px;
  }
  .detail {
    margin-left: 5px;
  }
  .file-name {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    color: #40415a;
  }
  .file-date {
    font-style: normal;
    font-weight: 400;
    font-size: 10.5px;
    line-height: 14px;
    color: #9d9eab;
  }
}
.date {
  display: flex;
  justify-content: center;
  font-size: 12px;
  margin-top: 20px;
}
.sticky-date {
  position: sticky;
  top: 0;
  z-index: 999;
}
.messages {
  overflow: scroll;
  height: 35vh;
  // overflow: hidden;
  // overflow-y: scroll;
  // height: calc(100vh - 20px);
}
.message {
  max-width: 400px;
}
.msg {
  background: #d3d7db;
  // border-radius: 12px 12px 12px 0px;
  max-width: 400px;
  // padding: 12px 10px 8px 10px;
  margin-top: 10px;
  word-break: break-word;


  p {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
}
.time {
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 15px;
  color: #9d9eab;
  margin-top: 7px;
}
.receive {
  // margin-left: 20px;
  border-radius: 12px 12px 12px 0px;
  padding: 12px 10px 8px 10px;
}
.send {
  // margin-right: 20px;
  margin-left: 50px;
  border-radius: 12px 12px 0px 12px;
  padding: 12px 10px 8px 10px;
}

.send .msg {
  background: #e6e3f6;
}
.action {
  padding-left: 20px;
  display: flex;
  .v-btn {
    margin-left: 10px;
    margin-top: 10px;
  }
  .record {
    background: rgba(102, 52, 233, 0.07);
    border-radius: 6px;
    height: 40px;
  }
  .send {
    background: #6634e9;
    border-radius: 6px;
    height: 40px;
    width: 78px;
    text-transform: capitalize;
    color: white;
  }
}
.action .v-input {
  background: #ffffff;
  border: 1px solid #e8ebf4;
  border-radius: 6px;
  height: 50px;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  // line-height: 18px;
  color: #9d9eab;
  // border-style: none !important;
  .v-text-field__slot {
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
.vue-audio-recorder {
  background-color: #6635e9;
  width: 40px;
  height: 40px;
  margin-top: 11px;
  margin-left: 7px;
}
</style>

<style>
.v-input__slot::before {
  border-style: none !important;
}
.vue-photo-collage {
  width: auto !important;
}
.vue-photo-grid {
  max-width: 120px;
  max-height: 120px;
}
.vue-photo-row {
  height: 120px !important;
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  padding: 20px;
}
.selected-images {
  /* background: green; */
}
</style>

<style scoped>
::v-deep .preview-image .v-image__image {
  background-position: top !important;
}
</style>
