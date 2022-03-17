export default class {
    constructor() {
        this.video.autoplay = true;

        document.body.appendChild(this.video);
    }
    data = [];
    meta = null;
    recording = false;
    video = document.createElement("video");
    static createStream(options = null) {
        return navigator.mediaDevices.getDisplayMedia(options || {
            audio: {
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false,
                sampleRate: 44100
            },
            video: {
                frameRate: {
                    ideal: 40
                },
                width: {
                    ideal: 1920
                },
                height: {
                    ideal: 1080
                }
            }
        });
    }

    createMediaRecorder(stream) {
        this.stream = stream;
        this.video.autoplay = true;
        this.video.srcObject = stream;

        this.meta = new MediaRecorder(stream);
        this.meta.onstart = () => {
            this.recording = true;
        }

        this.meta.ondataavailable = (event) => {
            this.data.push(event.data);
        }

        this.meta.onpause = () => {
            this.recording = false;
        }

        this.meta.onresume = () => {
            this.recording = true;
        }

        this.meta.onstop = () => {
            this.recording = false;
            this.video.autoplay = false;
            this.video.controls = true;
            this.video.srcObject = null;
            this.video.src = URL.createObjectURL(
                new Blob(this.data, {
                    type: this.data[0].type
                })
            );
        }

        const tracks = stream.getVideoTracks();
        tracks.forEach((track) => {
            track.addEventListener("ended", () => {
                this.stop();
            });
        });

        return this.meta;
    }

    async start(stream) {
        this.createMediaRecorder(stream);

        this.meta.start();
    }

    pause() {
        this.meta.pause();
    }

    resume() {
        this.meta.resume();
    }

    stop() {
        this.meta.stop();
    }
}