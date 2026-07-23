const CARD_COUNT = 38;

const grid = document.getElementById("grid");

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
