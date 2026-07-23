const CARD_COUNT = 38;

const grid = document.getElementById("grid");

let audioCtx;

function playWhooshSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioCtx = audioCtx || new AudioContextClass();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const duration = 0.35;
  const now = audioCtx.currentTime;

  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.55);
  filter.frequency.exponentialRampToValueAtTime(200, now + duration);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
  gain.gain.linearRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(now);
  noise.stop(now + duration);
}

for (let i = 1; i <= CARD_COUNT; i++) {
  const num = String(i).padStart(2, "0");

  const card = document.createElement("div");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", "false");
  card.setAttribute("aria-label", `Card ${i}, click to flip`);

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">
        <img src="assets/cards/card-${num}-front.webp" alt="Card ${i} front" loading="lazy">
      </div>
      <div class="card-face card-back">
        <img src="assets/cards/card-${num}-back.webp" alt="Card ${i} back" loading="lazy">
      </div>
    </div>
  `;

  const flip = () => {
    const flipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(flipped));
    playWhooshSound();
  };

  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  });

  grid.appendChild(card);
}
