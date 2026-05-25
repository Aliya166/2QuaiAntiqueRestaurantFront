console.log("MENU JS LOADED");

const entreesContainer = document.getElementById("entrees-container");
const platsContainer = document.getElementById("plats-container");
const dessertsContainer = document.getElementById("desserts-container");
const boissonsContainer = document.getElementById("boissons-container");

if (!entreesContainer || !platsContainer || !dessertsContainer || !boissonsContainer) {
  console.error("Un ou plusieurs containers sont introuvables");
} else {
  fetch(apiUrl + "menus")
    .then(response => response.json())
    .then(data => {
      entreesContainer.innerHTML = "";
      platsContainer.innerHTML = "";
      dessertsContainer.innerHTML = "";
      boissonsContainer.innerHTML = "";

      data.forEach(menu => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-lg-6");

        const safeName = sanitizeHTML(menu.name || "");
        const safePrice = sanitizeHTML(String(menu.price || ""));
        const safeDescription = sanitizeHTML(menu.description || "");

        col.innerHTML = `
          <div class="menu-item card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h4 class="menu-name mb-0">${safeName}</h4>
                <span class="menu-price">${safePrice}€</span>
              </div>
              <p class="menu-description mb-0">${safeDescription}</p>
            </div>
          </div>
        `;

        if (menu.category === "entree") {
          entreesContainer.appendChild(col);
        } else if (menu.category === "plat") {
          platsContainer.appendChild(col);
        } else if (menu.category === "dessert") {
          dessertsContainer.appendChild(col);
        } else if (menu.category === "boisson") {
          boissonsContainer.appendChild(col);
        }
      });
    })
    .catch(error => {
      console.error("Erreur :", error);
    });
}
