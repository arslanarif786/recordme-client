<template>
  <div class="row save-audio d-flex justify-space-around mobile-action action box-shadow">
    <v-icon color="red" large class="text-right float-right recorder-close-icon" @click="$emit('close-voice-recorder')"> mdi-close</v-icon>
    <div cols="12" md="12" sm="12">
      <audio-recorder
        :attempts="1"
        :time="100"
        mode="minimal"
        :pause-recording="callback"
        :after-recording="endRecording"
        :show-download-button="false"
        :show-upload-button="false"
        :countdown="false"
      >
      </audio-recorder>
    </div>

    <div cols="8" sm="8" md="8" class="mb-5">
      <AudioWaveform
        v-if="audioData?.url"
        :audio="audioData ? audioData.url : ''"
         id="IosId"
      ></AudioWaveform>
    </div>
    <div cols="4" sm="4" md="4" class="mb-5">
       
         <v-btn
          v-if="audioData?.url"
          depressed
          class="mt-4"
          color="primary"
          :loading="msgLoader"
          @click="sendAudio()"
          ><span class="material-icons"> send </span></v-btn
        >
    </div>
  </div>
</template>

<script>
import EventBus from '../../../../js/EventBus';
import AudioWaveform from "../../AudioWaveform.vue";
export default {
  name: "IOSVoiceRecoder",
  components: {
    AudioWaveform,
  },
  data() {
    return {
         msgLoader:false,
      audioData:"",
    };
  },
  methods: {
    callback(data) {


    },
    endRecording(data)
    {
         this.audioData=data;
    },
    sendAudio()
    {
         this.msgLoader=true;

         EventBus.$emit('save-ios-audio',this.audioData);
       
      
    }
  },
};
</script>
<style scoped>
/* :deep(.ar-records) {
  display: none !important;
} */
:deep(.ar-recorder__time-limit) {
  display: none !important;
}
:deep(.ar-recorder__duration) {
  display: none !important;
}
:deep(.ar-recorder__records-limit) {
  display: none !important;
}
:deep(.ar-player) {
  display: none !important;
}
:deep(.ar) {
     background-color:white !important;
     box-shadow: none !important;
}

/* :deep(.ar-recorder > .ar-recorder__stop){
     display: none !important;
} */
:deep(.ar-records) {
    height: 48px !important;
    padding-top: 2px;
    margin-bottom: 0px !important;
}
:deep(.ar-records__record){
     width: 260px !important;
}

.recorder-close-icon{
     position: relative;
    left: 35%;
}
</style>
