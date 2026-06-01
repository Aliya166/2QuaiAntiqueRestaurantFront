const galerieImage = document.getElementById("allImages");

fetch(apiUrl + "pictures")
  .then((response) => response.json())
  .then((pictures) => {

    let html = "";

    pictures.forEach((picture) => {
      html += getImage(picture.id, picture.title, picture.image_url);
    });

    galerieImage.innerHTML = html;
    showAndHideElementsForRoles();
  })
  .catch(() => {});

function getImage(id, titre, urlImage) {
  titre = sanitizeHTML(titre);
  urlImage = sanitizeHTML(urlImage);

  const isAdmin = getRole() === "ROLE_ADMIN";

  const adminButtons = isAdmin
    ? `
      <div class="action-image-buttons">
        <button type="button" class="btn btn-outline-light btn-sm" onclick="globalThis.editPicture(${id}, '${titre}')">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button 
          type="button" 
          class="btn btn-outline-light btn-sm"
          onclick="globalThis.deletePicture(${id})"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `
    : "";

  return `
    <div class="col p-3" id="picture-${id}">
      <div class="image-card text-white">
        <img src="${urlImage}" class="rounded w-100" alt="${titre}"/>
        <p class="titre-image">${titre}</p>
        ${adminButtons}
      </div>
    </div>
  `;
}

let pictureIdToDelete = null;

globalThis.deletePicture = function (id) {
  pictureIdToDelete = id;

  const deleteModal = new bootstrap.Modal(
    document.getElementById("deletePhotoModal")
  );

  deleteModal.show();
};

const addPhotoForm = document.getElementById("addPhotoForm");
const btnSavePhoto = document.getElementById("btnSavePhoto");
const titlePhotoInput = document.getElementById("NamePhotoInput");
const imagePhotoInput = document.getElementById("ImageInput");

if (btnSavePhoto) {
  btnSavePhoto.addEventListener("click", function () {
    const formData = new FormData();

    formData.append("title", titlePhotoInput.value.trim());
    formData.append("image", imagePhotoInput.files[0]);

    const pictureId = photoIdInput.value;

    const url = pictureId ? `${apiUrl}pictures/${pictureId}/update` : `${apiUrl}pictures`;

    fetch(url, {
      method: "POST",
      body: formData,
    })

      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur ajout photo");
        }
        return response.json();
      })
      .then(() => {
        addPhotoForm.reset();
        location.reload();
      })
      .catch(() => {});
  });
}

const photoIdInput = document.getElementById("photoIdInput");

globalThis.editPicture = function (id, title) {
  photoIdInput.value = id;
  titlePhotoInput.value = title;

  const modal = new bootstrap.Modal(document.getElementById("EditionPhotoModal"));
  modal.show();

};

const confirmDeletePhotoBtn = document.getElementById("confirmDeletePhotoBtn");

if (confirmDeletePhotoBtn) {
  confirmDeletePhotoBtn.addEventListener("click", function () {
    if (!pictureIdToDelete) {
      return;
    }

    fetch(`${apiUrl}pictures/${pictureIdToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur suppression");
        }

        const pictureCard = document.getElementById(
          `picture-${pictureIdToDelete}`
        );

        if (pictureCard) {
          pictureCard.remove();
        }

        const modalElement = document.getElementById("deletePhotoModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        pictureIdToDelete = null;
      })
      .catch(() => {});
  });
}
