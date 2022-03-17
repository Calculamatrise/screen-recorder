import Recorder from "./utils/Recorder.js";

const recorder = new Recorder();

start: {
    const start = document.querySelector("#start-recording");
    if (start === null) {
        break start;
    }

    start.update = function(text, old, listener) {
        this.innerText = text;
        this.removeEventListener("click", old);
        this.addEventListener("click", listener);
    }

    async function record() {
        recorder.start(await Recorder.createStream());
        this.update("Pause", record, pause);
    }

    function pause() {
        recorder.pause();
        this.update("Resume", pause, resume);
    }

    function resume() {
        recorder.resume();
        this.update("Pause", resume, pause);
    }

    start.addEventListener("click", record);
}

end: {
    const end = document.querySelector("#end-recording");
    if (end === null) {
        break end;
    }

    end.addEventListener("click", async function() {
        recorder.stop();
    });
}

save: {
    const save = document.querySelector("#save-recording");
    if (save === null) {
        break save;
    }

    save.addEventListener("click", function() {
        let link = document.createElement("a");
        link.href = recorder.video.src;
        link.download = "screen-recording_" + new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i).join("_").replace(/\..+/, "").replace(/:/g, "-");
        link.click();
    });
}