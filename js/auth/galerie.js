const galerieImage = document.getElementById("allImages");

fetch(apiUrl + "pictures")
  .then((response) => response.json())
  .then((pictures) => {
    console.log("Pictures:", pictures);

    let html = "";

    pictures.forEach((picture) => {
      html += getImage(picture.id, picture.title, picture.image_url);
    });

    galerieImage.innerHTML = html;
  })
  .catch((error) => {
    console.error("Erreur galerie :", error);
  });

function getImage(id, titre, urlImage) {
  titre = sanitizeHTML(titre);
  urlImage = sanitizeHTML(urlImage);

  return `
    <div class="col p-3" id="picture-${id}">
      <div class="image-card text-white">
        <img src="${urlImage}" class="rounded w-100"/>
        <p class="titre-image">${titre}</p>

        <div class="action-image-buttons" data-show="admin">
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
      </div>
    </div>
  `;
}

globalThis.deletePicture = function (id) {
  console.log("Delete id:", id);

  if (!confirm("Voulez-vous vraiment supprimer cette image ?")) {
    return;
  }

  fetch(`${apiUrl}pictures/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur suppression");
      }

      const pictureCard = document.getElementById(`picture-${id}`);

      if (pictureCard) {
        pictureCard.remove();
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Erreur suppression :", error);
    });
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
      .catch((error) => {
        console.error("Erreur ajout photo :", error);
      });
  });
}

const photoIdInput = document.getElementById("photoIdInput");

globalThis.editPicture = function (id, title) {
  photoIdInput.value = id;
  titlePhotoInput.value = title;

  const modal = new bootstrap.Modal(document.getElementById("EditionPhotoModal"));
  modal.show();

};
