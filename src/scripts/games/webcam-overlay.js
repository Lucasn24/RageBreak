// Webcam Challenge Game (Overlay)
function initWebcamChallenge(container) {
  const targetReps = 13;
  let reps = 0;
  let started = false;
  let startTime = null;
  const maxSeconds = 25;

  container.innerHTML = `
    <div class="webcam-game">
      <h2>Webcam Rush</h2>
      <p>Move your hands up and down with upward-facing palms, fast. Press space (or click Rep) for each rep.</p>
      <video class="webcam-preview" id="webcam-preview" autoplay playsinline muted></video>
      <div class="webcam-stats">
        <span>Reps: <strong id="webcam-reps">0</strong> / 6+7</span>
        <span>Time: <strong id="webcam-time">${maxSeconds}</strong>s</span>
      </div>
      <div class="webcam-controls">
        <button class="webcam-btn" id="webcam-start">Start</button>
        <button class="webcam-btn" id="webcam-rep">Rep</button>
        <button class="webcam-btn secondary" id="webcam-skip">Skip</button>
        <button class="webcam-btn secondary" id="webcam-popup">Open webcam window</button>
      </div>
      <div class="webcam-message" id="webcam-message"></div>
    </div>
  `;

  const video = container.querySelector("#webcam-preview");
  const repsEl = container.querySelector("#webcam-reps");
  const timeEl = container.querySelector("#webcam-time");
  const startBtn = container.querySelector("#webcam-start");
  const repBtn = container.querySelector("#webcam-rep");
  const skipBtn = container.querySelector("#webcam-skip");
  const popupBtn = container.querySelector("#webcam-popup");
  const messageEl = container.querySelector("#webcam-message");

  const updateTime = () => {
    if (!started || startTime === null) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, maxSeconds - elapsed);
    timeEl.textContent = remaining;
    if (remaining === 0 && reps < targetReps) {
      messageEl.textContent = "Too slow. Try again!";
      messageEl.style.color = "#ff004d";
      started = false;
      startTime = null;
    }
  };

  const intervalId = setInterval(updateTime, 200);

  const incrementRep = () => {
    if (!started) return;
    reps += 1;
    repsEl.textContent = reps;
    if (reps >= targetReps) {
      messageEl.textContent = "Nice! Break complete.";
      messageEl.style.color = "#4CAF50";
      clearInterval(intervalId);
      setTimeout(() => closeOverlay("webcam"), 1200);
    }
  };

  const startAutoRepDetection = () => {
    if (webcamAutoRepActive) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const width = 64;
    const height = 48;
    canvas.width = width;
    canvas.height = height;
    let lastFrame = null;
    let lastY = null;
    let direction = "up";
    let lastRepAt = 0;

    webcamAutoRepActive = true;

    const detect = () => {
      if (!webcamAutoRepActive) return;
      if (!started || video.videoWidth === 0) {
        webcamAutoRepRafId = requestAnimationFrame(detect);
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;

      if (lastFrame) {
        let motionCount = 0;
        let weightedY = 0;
        for (let i = 0; i < data.length; i += 4) {
          const diff =
            Math.abs(data[i] - lastFrame[i]) +
            Math.abs(data[i + 1] - lastFrame[i + 1]) +
            Math.abs(data[i + 2] - lastFrame[i + 2]);
          if (diff > 60) {
            const idx = i / 4;
            const y = Math.floor(idx / width);
            motionCount += 1;
            weightedY += y;
          }
        }

        if (motionCount > 40) {
          const centroidY = weightedY / motionCount;
          const normY = centroidY / height;
          if (lastY !== null) {
            const now = Date.now();
            if (direction === "up" && normY > 0.6 && now - lastRepAt > 600) {
              direction = "down";
              lastRepAt = now;
              incrementRep();
            } else if (
              direction === "down" &&
              normY < 0.4 &&
              now - lastRepAt > 600
            ) {
              direction = "up";
              lastRepAt = now;
              incrementRep();
            }
          }
          lastY = normY;
        }
      }

      lastFrame = new Uint8ClampedArray(data);
      webcamAutoRepRafId = requestAnimationFrame(detect);
    };

    webcamAutoRepRafId = requestAnimationFrame(detect);
  };

  const startCamera = async () => {
    if (started) return;
    try {
      webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      video.srcObject = webcamStream;
      await video.play().catch(() => {});
      messageEl.textContent = "";
      reps = 0;
      repsEl.textContent = reps;
      startTime = Date.now();
      started = true;
      updateTime();
      messageEl.textContent = "Auto rep detection active.";
      messageEl.style.color = "#333";
      startAutoRepDetection();
    } catch (error) {
      messageEl.textContent =
        "Camera blocked by site. Use the webcam window instead.";
      messageEl.style.color = "#ff004d";
      safeSendMessage({ type: "OPEN_WEBCAM_WINDOW" });
    }
  };

  startBtn.addEventListener("click", startCamera);
  startCamera();

  repBtn.addEventListener("click", incrementRep);

  skipBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    closeOverlay("webcam");
  });

  popupBtn.addEventListener("click", () => {
    safeSendMessage({ type: "OPEN_WEBCAM_WINDOW" });
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      incrementRep();
    }
  });
}
