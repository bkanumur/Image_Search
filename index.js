const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const loaderEl = document.getElementById("loader");
const modalEl = document.getElementById("modal");
const modalImageEl = document.getElementById("modal-image");
const modalDescriptionEl = document.getElementById("modal-description");
const modalLinkEl = document.getElementById("modal-link");
const modalCloseEl = document.getElementById("modal-close");
const orientationFilterEl = document.getElementById("orientation-filter");
const colorFilterEl = document.getElementById("color-filter");
const themeToggleEl = document.getElementById("theme-toggle");

let inputData = "";
let page = 1;

function toggleLoader(show) {
  loaderEl.classList.toggle("hidden", !show);
}

function openModal(imageUrl, description, link) {
  modalImageEl.src = imageUrl;
  modalDescriptionEl.textContent = description || "No description available";
  modalLinkEl.href = link;
  modalEl.classList.remove("hidden");
}

function closeModal() {
  modalEl.classList.add("hidden");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggleEl.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

async function searchImages() {
  inputData = searchInputEl.value;
  const orientation = orientationFilterEl.value;
  const color = colorFilterEl.value;
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.append("page", page);
  url.searchParams.append("query", inputData);
  url.searchParams.append("client_id", accessKey);
  if (orientation) url.searchParams.append("orientation", orientation);
  if (color) url.searchParams.append("color", color);

  toggleLoader(true);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) searchResultsEl.innerHTML = "";

    const results = data.results;

    results.forEach((result) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("search-result");

      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || "Image";
      image.title = result.alt_description || "Image";
      image.addEventListener("click", () =>
        openModal(result.urls.regular, result.alt_description, result.links.html)
      );

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const imageDescription = document.createElement("p");
      imageDescription.textContent = result.alt_description || "No description available";

      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      imageLink.textContent = "View on Unsplash";

      overlay.appendChild(imageDescription);
      overlay.appendChild(imageLink);

      imageWrapper.appendChild(image);
      imageWrapper.appendChild(overlay);
      searchResultsEl.appendChild(imageWrapper);
    });

    page++;
  } catch (error) {
    alert("Failed to load images. Please try again later.");
  } finally {
    toggleLoader(false);
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

modalCloseEl.addEventListener("click", closeModal);
themeToggleEl.addEventListener("click", toggleTheme);