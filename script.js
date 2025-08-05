// 1. Alle Gegevens

const words = [
  { nl: "huis", tr: "ev" },
  { nl: "kat", tr: "kedi" },
  { nl: "boom", tr: "ağaç" },
  { nl: "stoel", tr: "sandalye" },
  { nl: "eten", tr: "yemek" },
  { nl: "blijven", tr: "kalmak" },
  { nl: "delen", tr: "bölüşmek" },
  { nl: "betalen", tr: "ödemek" },
  { nl: "besluiten", tr: "karar vermek" },
  { nl: "houden van", tr: "sevmek" },
  { nl: "houden", tr: "tutmak" },


];

const tegenstellingen = [
	{ nl: "groot", tr: "büyük" },
	{ nl: "klein", tr: "küçük" },
	{ nl: "snel", tr: "hızlı" },
	{ nl: "traag", tr: "yavaş" },
	{ nl: "dik", tr: "doğru" },
	{ nl: "scheef", tr: "eğri" },
	{ nl: "heet", tr: "sıcak" },
	{ nl: "koud", tr: "soğuk" },
	{ nl: "mooi", tr: "güzel" },
	{ nl: "lelijk", tr: "çirkin" },
	{ nl: "blij", tr: "mutlu" },
	{ nl: "verdrietig", tr: "üzgün" },



];

const synoniemen = [
	{ nl1: "blij", nl2: "vrolijk", tr: "mutlu" },
	{ nl1: "beginnen", nl2: "starten", tr: "başlamak" },
	{ nl1: "auto", nl2: "wagen", tr: "araba" },
	{ nl1: "gezond", nl2: "fit", tr: "sağlıklı" },
	{ nl1: "mooi", nl2: "beeldschoon", tr: "güzel" },
	{ nl1: "vrij", nl2: "los", tr: "özgür" },
	{ nl1: "nieuw", nl2: "modern", tr: "yeni" },
	{ nl1: "traag", nl2: "langzaam", tr: "yavaş" },
	{ nl1: "rustig", nl2: "kalm", tr: "sakin" },

];

// 2.DOM-elementen


const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");

const flashcardContainer = document.getElementById("flashcard-container");
const nextWordBtn = document.getElementById("next-word");

const tegenstellingContainer = document.querySelector("#tegenstellingen .flashcard-container");
const nextTegenstellingBtn = document.getElementById("next-woorden");

const synoniemContainer = document.getElementById("synoniem-container");
const nextSynoniemBtn = document.getElementById("next-synoniemen");


// 3. Quiz 

let correctCount = 0;
let totalCount = 0;

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function nextQuestion() {
	const current = words[Math.floor(Math.random() * words.length)];

	const options = [current.tr];
	while (options.length < 4) {
		const candidate = words[Math.floor(Math.random() * words.length)].tr;
		if (!options.includes(candidate)) options.push(candidate);
	}
	shuffle(options);

	questionEl.textContent = `Wat is de betekenis van “${current.nl}”?`;
	choicesEl.innerHTML = "";
	options.forEach(opt => {
		const btn = document.createElement("button");
		btn.className = "choice";
		btn.textContent = opt;
		btn.onclick = () => handleAnswer(btn, opt === current.tr);
		choicesEl.appendChild(btn);
	});
}

function handleAnswer(button, isCorrect) {
	totalCount++;
	if (isCorrect) {
		correctCount++;
		button.classList.add("correct");
	} else {
		button.classList.add("incorrect");
	}

	// Butonları devre dışı bırak
	Array.from(choicesEl.children).forEach(btn => btn.disabled = true);

	scoreEl.textContent = `Score: ${correctCount} / ${totalCount}`;

	setTimeout(nextQuestion, 1000);
}

// 4. Nieuwe Woorden (Flashcard) 

let currentWordIndex = 0;

function createFlashcard(word) {
	const card = document.createElement("div");
	card.className = "flashcard";
	card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">${word.nl}</div>
      <div class="card-back">${word.tr}</div>
    </div>
  `;
	card.addEventListener("click", () => {
		card.classList.toggle("flipped");
	});
	return card;
}

function showWord(index) {
	flashcardContainer.innerHTML = "";
	currentWordIndex = index % words.length;
	const card = createFlashcard(words[currentWordIndex]);
	flashcardContainer.appendChild(card);
}

nextWordBtn.addEventListener("click", () => {
	showWord(currentWordIndex + 1);
});


// 5. Tegenstellingen

let tegenstellingIndex = 0;

function showTegenstelling(index) {
	tegenstellingContainer.innerHTML = "";

	// Toon een 2-kaartenpaar
	const pair = [tegenstellingen[index], tegenstellingen[index + 1]].filter(Boolean);

	pair.forEach(word => {
		const card = document.createElement("div");
		card.className = "flashcard";
		card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${word.nl}</div>
        <div class="card-back">${word.tr}</div>
      </div>
    `;
		card.onclick = () => card.classList.toggle("flipped");
		tegenstellingContainer.appendChild(card);
	});
}

nextTegenstellingBtn.addEventListener("click", () => {
	tegenstellingIndex += 2;
	if (tegenstellingIndex >= tegenstellingen.length) {
		tegenstellingIndex = 0;
	}
	showTegenstelling(tegenstellingIndex);
});


// 6. Synoniemen 

let synoniemenIndex = 0;

function showSynoniemen(index) {
	synoniemContainer.innerHTML = "";

	const current = synoniemen[index];
	if (!current) return;

	const wrapper = document.createElement("div");
	wrapper.className = "synoniem-card-set";

	const card1 = document.createElement("div");
	card1.className = "flashcard static";
	card1.textContent = current.nl1;

	const card2 = document.createElement("div");
	card2.className = "flashcard";
	card2.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">${current.tr}</div>
    </div>
  `;
	card2.onclick = () => card2.classList.toggle("flipped");

	const card3 = document.createElement("div");
	card3.className = "flashcard static";
	card3.textContent = current.nl2;

	wrapper.appendChild(card1);
	wrapper.appendChild(card2);
	wrapper.appendChild(card3);

	synoniemContainer.appendChild(wrapper);
}

nextSynoniemBtn.addEventListener("click", () => {
	synoniemenIndex++;
	if (synoniemenIndex >= synoniemen.length) synoniemenIndex = 0;
	showSynoniemen(synoniemenIndex);
});

// 7. Toon initiële inhoud bij het opstarten

nextQuestion();
showWord(currentWordIndex);
showTegenstelling(tegenstellingIndex);
showSynoniemen(synoniemenIndex);


// 8. Tabbladwisselfunctie op de pagina

function toggleSection(sectionId) {
	const allSections = document.querySelectorAll("main section");
	allSections.forEach(section => {
		section.style.display = (section.id === sectionId) ? "block" : "none";
	});

	document.querySelectorAll(".menu button").forEach(btn => {
		btn.classList.toggle("active", btn.textContent.toLowerCase().includes(sectionId));
	});
}

