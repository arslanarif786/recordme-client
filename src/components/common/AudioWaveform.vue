<template>   
  <div class="d-flex rounded-lg pt-2">
          <audio :ref="id" :id="id" :src="audio"></audio>
          <div class="px-2"> 
            <v-icon
            v-if="!isPlaying"
            color="primary"
            class="ma-0 pa-0"
            @click="playAudio(true)"
            >mdi-play</v-icon
          >
           <v-icon
            v-else
            color="primary"
            class="ma-0 pa-0"
            @click="playAudio(false)"
            >mdi-pause
          </v-icon>
          </div>
          <av-waveform
            :ref-link="id"
            :playtime="false"
            :playtime-slider="false"
            playtime-slider-color="#6634E9"
            :canv-width="200"
            :canv-height="27"
            played-line-color="#6634E9"
            noplayed-line-color="black"
            :audio-src="audio"
          >
          </av-waveform>
            <!-- <div class="ma-2 px-2"> 
             <p class="ma-0 pa-0">00:08</p>
          </div> -->
          
    <!-- <av-waveform
      :id="safari || ios ? 'audioPlayerIphone' : 'audioplayer'"
      :audio-class="safari || ios ? 'waveformIphone' : 'waveform'"
      :playtime="false"
      playtime-slider-color="#f1f3f4"
      :canv-width="200"
      :canv-height="46"
      played-line-color="lightgrey"
      noplayed-line-color="grey"
      :audio-src="audio"
    ></av-waveform> -->
  </div>
</template>
<script>
import EventBus from "../../js/EventBus";
import { mobileVendor, isIOS, isSafari } from "mobile-device-detect";

export default {
  name: "AudioWaveform",
  props: ["audio", "id"],
  data() {
    return {
      totalTime : null,
      isPlaying : false,
      mobile: mobileVendor,
      safari: isSafari,
      ios: isIOS,
    };
  },
  mounted() {
    // change icon after completion of audio
    this.$refs[this.id].onended = () => {
      this.isPlaying = false
    } 
},
  methods : {
    // format Time from milliseconds to seconds
    formatTime( time ) {
      let minutes = Math.floor( time / 60 )
      let timeForSeconds = time - ( minutes * 60 ) // seconds without counted minutes 
      let seconds = Math.floor( timeForSeconds )
      let secondsReadable = seconds > 9 ? seconds : `0${seconds}` // To change 2:2 into 2:02
      return `${minutes}:${secondsReadable}`
    },
    // play and pause audio 
    playAudio(value){
      this.isPlaying = !this.isPlaying
      if(value) document.getElementById(`${this.id}`).play()
      else document.getElementById(`${this.id}`).pause()
    }
  },
};
</script>
<style>
#audioplayer {
  display: flex;
  background: #f1f3f4;
  max-width: 260px;
  margin-left: 10px;
  border-radius: 30px;
  height: 60px;
  width: 260px;
}
#audioPlayerIphone {
  display: flex;
  background: #f1f3f4;
  max-width: 260px;
  margin-left: 10px;
  border-radius: 30px;
  height: 70px;
  width: 260px;
}
.waveform {
  max-width: 100px;
  margin-right: 10px;
  margin-top: 3px;
}
.waveformIphone {
  max-width: 95px;
  margin-right: 27px;
  margin-left: 10px;
  margin-top: 20px;
}
#audioplayer canvas {
  margin-left: -60px;
  position: relative;
  background: #f1f3f4;
  margin-top: 8px;
}
#audioPlayerIphone canvas {
  margin-left: -78px !important;
  position: relative;
  background: #f1f3f4;
  margin-top: 13px !important;
}
.send #audioplayer {
  margin-right: 0px;
  margin-left: auto;
}
.send #audioPlayerIphone {
  margin-right: 0px;
  margin-left: auto;
}
</style>