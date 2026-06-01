
const entreesContainer = document.getElementById("entrees-container");
const platsContainer = document.getElementById("plats-container");
const dessertsContainer = document.getElementById("desserts-container");
const boissonsContainer = document.getElementById("boissons-container");

const menuForm = document.getElementById("menuForm");

const addMenuButtonContainer = document.getElementById("addMenuButtonContainer");

if (addMenuButtonContainer && getRole() === "ROLE_ADMIN") {
  addMenuButtonContainer.innerHTML = `
    <button class="btn btn-primary px-4 py-2" id="btnAddMenu">
      Ajouter un plat
    </button>
  `;
}
const btnAddMenu = document.getElementById("btnAddMenu");

const btnSaveMenu = document.getElementById("btnSaveMenu");

const menuIdInput = document.getElementById("menuIdInput");
const menuNameInput = document.getElementById("menuNameInput");
const menuDescriptionInput = document.getElementById("menuDescriptionInput");
const menuPriceInput = document.getElementById("menuPriceInput");
const menuCategoryInput = document.getElementById("menuCategoryInput");

if (entreesContainer && platsContainer && dessertsContainer && boissonsContainer) {
  fetch(apiUrl + "menus")
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      entreesContainer.innerHTML = "";
      platsContainer.innerHTML = "";
      dessertsContainer.innerHTML = "";
      boissonsContainer.innerHTML = "";

      data.forEach((menu) => {
        globalThis.menusData = globalThis.menusData || {};
        globalThis.menusData[menu.id] = menu;

        const col = document.createElement("div");
        col.classList.add("col-12", "col-lg-6");

        const safeName = sanitizeHTML(menu.name || "");
        const safePrice = sanitizeHTML(String(menu.price || ""));
        const safeDescription = sanitizeHTML(menu.description || "");

        const isAdmin = getRole() === "ROLE_ADMIN";

        const adminButtons = isAdmin
          ? `
            <div class="mt-3 d-flex gap-2">
              <button
                class="btn btn-outline-dark btn-sm"
                onclick="globalThis.editMenu(${menu.id})">
                Modifier
              </button>

              <button
                class="btn btn-danger btn-sm"
                onclick="globalThis.deleteMenu(${menu.id})">
                Supprimer
              </button>
            </div>
          `
          : "";

        col.innerHTML = `
          <div class="menu-item card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h4 class="menu-name mb-0">${safeName}</h4>
                <span class="menu-price">${safePrice}€</span>
              </div>

              <p class="menu-description mb-0">${safeDescription}</p>

              ${adminButtons}
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

    .catch(() => {});
}
  if (btnAddMenu) {
    btnAddMenu.addEventListener("click", function () {
      menuForm.reset();
      menuIdInput.value = "";

      const modal = new bootstrap.Modal(document.getElementById("menuModal"));
      modal.show();
    });
  }

  if (btnSaveMenu) {
    btnSaveMenu.addEventListener("click", function () {
      const formData = new FormData();

      formData.append("name", menuNameInput.value.trim());
      formData.append("description", menuDescriptionInput.value.trim());
      formData.append("price", menuPriceInput.value.trim());
      formData.append("category", menuCategoryInput.value);

      const menuId = menuIdInput.value;

      const url = menuId
        ? `${apiUrl}menus/${menuId}/update`
        : `${apiUrl}menus`;

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur ajout/modification menu");
          }

          return response.json();
        })
        .then(() => {
          menuForm.reset();
          location.reload();
        })
        .catch(() => { });
    });
  }

  let menuIdToDelete = null;

  globalThis.deleteMenu = function (id) {
    menuIdToDelete = id;

    const modal = new bootstrap.Modal(
      document.getElementById("deleteMenuModal")
    );

    modal.show();
  };

  globalThis.editMenu = function (id) {
    const menu = globalThis.menusData[id];

    if (!menu) {
      return;
    }

    menuIdInput.value = menu.id;
    menuNameInput.value = menu.name;
    menuDescriptionInput.value = menu.description;
    menuPriceInput.value = menu.price;
    menuCategoryInput.value = menu.category;

    const modal = new bootstrap.Modal(
      document.getElementById("menuModal")
    );
    modal.show();
  };

  const confirmDeleteMenuBtn = document.getElementById("confirmDeleteMenuBtn");

  if (confirmDeleteMenuBtn) {
    confirmDeleteMenuBtn.addEventListener("click", function () {
      if (!menuIdToDelete) {
        return;
      }

      fetch(`${apiUrl}menus/${menuIdToDelete}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur suppression menu");
          }

          location.reload();
        })
        .catch(() => {});
    });
  }