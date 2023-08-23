<template>
  <div id="app" class="text-center web-camera-container">
    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title class="grey lighten-2 pb-0 pt-1">
          <p class="fs-14 fw-600 mb-0">Capture Picture</p>
          <v-spacer />
          <p
            class="fs-14 fw-600 mb-0"
            @click="
              () => {
                $emit('off-camera');
                this.stopCameraStream();
              }
            "
          >
            <span class="material-icons cursor-pointer pt-1"> close </span>
          </p>
        </v-card-title>

        <v-card-text style="height: 64vh">
          <div
            v-if="isCameraOpen"
            v-show="!isLoading"
            class="camera-box"
            :class="{ flash: isShotPhoto }"
          >
            <div class="camera-shutter" :class="{ flash: isShotPhoto }"></div>

            <video
              v-show="!isPhotoTaken"
              ref="camera"
              id="openCameraVideo"
              :width="200"
              :height="200"
              autoplay
            ></video>

            <canvas
              v-show="false"
              id="photoTaken"
              ref="canvas"
              :width="200"
              :height="200"
            ></canvas>
          </div>

          <div
            v-if="isCameraOpen && !isLoading"
            class="camera-shoot text-center pb-2"
          >
            <v-btn class="btn" large color="primary" @click="takePic">
              <span class="material-icons"> photo_camera </span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventBus from "../../js/EventBus";
export default {
  name: "Apphj",
  data() {
    return {
      dialog: true,
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      link: "#",
    };
  },
  mounted() {
    this.toggleCamera();
  },

  methods: {
    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },

    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
        },
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },
    async takePic() {
      const blob = await this.takePhoto();
      this.stopCameraStream();
    },
    takePhoto() {
      if (!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      return new Promise((resolve) => {
        this.isPhotoTaken = !this.isPhotoTaken;
        const vm = this;
        const canvas = this.$refs.canvas;
        const video = this.$refs.camera;
        const context = canvas.getContext("2d", { antialias: false });
        canvas.width = video.width * window.devicePixelRatio;
        canvas.height = video.height * window.devicePixelRatio;

        canvas.style.width = `${video.width}px`;
        canvas.style.height = `${video.height}px`;
        context.drawImage(
          video,
          0,
          0,
          video.width * window.devicePixelRatio,
          video.height * window.devicePixelRatio
        );

        canvas.toBlob((blob) => {
          resolve(blob);
          vm.$emit("capture", blob);
        });
      });
    },
  },
};
</script>

<style scoped>
#photoTaken {
  object-fit: contain !important;
  background-repeat: no-repeat !important;
}
#openCameraVideo {
  width: 100%;
  height: 53vh;
  object-fit: contain;
  background-repeat: no-repeat;
}
</style>
