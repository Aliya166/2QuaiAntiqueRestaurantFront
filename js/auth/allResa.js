const reservationsList = document.getElementById("reservationsList");

function loadReservations() {
  if (!reservationsList) return;

  fetch(apiUrl + "reservations", {
    headers: {
      "X-AUTH-TOKEN": getToken()
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur chargement réservations");
      }

      return response.json();
    })
    .then((reservations) => {
      if (!reservations || reservations.length === 0) {
        reservationsList.innerHTML = `
          <div class="alert alert-info text-center">
            Vous n’avez aucune réservation pour le moment.
          </div>
        `;
        return;
      }

      globalThis.reservationsData = {};

      reservations.forEach((reservation) => {

        globalThis.reservationsData[reservation.id] = reservation;

      });

      const isAdmin = getRole() === "ROLE_ADMIN";

      reservationsList.innerHTML = reservations.map((reservation) => {
        const safeDate = sanitizeHTML(reservation.date || "");
        const safeGuests = sanitizeHTML(String(reservation.guests || ""));
        const safeComment = sanitizeHTML(reservation.comment || "");
        const safeEmail = sanitizeHTML(reservation.user?.email || "");

        let clientInfo = "";

        if (isAdmin) {
          clientInfo = `<p class="text-muted mb-3"><strong>Client :</strong> ${safeEmail}</p>`;
        }

        return `
          <div class="card mb-4 shadow-sm border-0">
            <div class="card-body p-4">
              <h4 class="mb-2">
                ${isAdmin ? `Réservation #${reservation.id}` : "Ma réservation"}
              </h4>
              ${clientInfo}

              <p><strong>Date :</strong> ${safeDate}</p>
              <p><strong>Convives :</strong> ${safeGuests}</p>
              <p><strong>Commentaire :</strong> ${safeComment || "Aucun"}</p>

              <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-outline-dark btn-sm" onclick="globalThis.editReservation(${reservation.id})">
                  Modifier
                </button>

                <button class="btn btn-danger btn-sm" onclick="globalThis.deleteReservation(${reservation.id})">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    })
    .catch((error) => {
      console.error("Erreur réservations :", error);
    });
}

let reservationIdToDelete = null;

globalThis.deleteReservation = function (id) {
  reservationIdToDelete = id;

  const modal = new bootstrap.Modal(
    document.getElementById("deleteReservationModal")
  );

  modal.show();
};

const btnConfirmDeleteReservation = document.getElementById("btnConfirmDeleteReservation");

if (btnConfirmDeleteReservation) {
  btnConfirmDeleteReservation.addEventListener("click", function () {
    if (!reservationIdToDelete) return;

    fetch(apiUrl + "reservations/" + reservationIdToDelete, {
      method: "DELETE",
      headers: {
        "X-AUTH-TOKEN": getToken()
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur suppression réservation");
        }

        location.reload();
      })
      .catch((error) => {
        console.error("Erreur suppression réservation :", error);
      });
  });
}

globalThis.editReservation = function (id) {
  const reservation = globalThis.reservationsData[id];

  if (!reservation) {
    console.error("Réservation introuvable");
    return;
  }

  const [datePart, timePart] = reservation.date.split(" ");

  document.getElementById("reservationIdInput").value = reservation.id;
  document.getElementById("reservationDateInput").value = datePart;
  document.getElementById("reservationTimeInput").value = timePart || "";
  document.getElementById("reservationGuestsInput").value = reservation.guests;
  document.getElementById("reservationCommentInput").value = reservation.comment || "";

  const modal = new bootstrap.Modal(
    document.getElementById("reservationEditModal")
  );

  modal.show();
};

const btnSaveReservation = document.getElementById("btnSaveReservation");

if (btnSaveReservation) {
  btnSaveReservation.addEventListener("click", function () {
    const id = document.getElementById("reservationIdInput").value;
    const date = document.getElementById("reservationDateInput").value;
    const time = document.getElementById("reservationTimeInput").value;
    const guests = document.getElementById("reservationGuestsInput").value;
    const comment = document.getElementById("reservationCommentInput").value;

    const dataToSend = new FormData();
    dataToSend.append("date", `${date} ${time}`);
    dataToSend.append("guests", guests);
    dataToSend.append("comment", comment);

    fetch(apiUrl + "reservations/" + id + "/update", {
      method: "POST",
      body: dataToSend,
      headers: {
        "X-AUTH-TOKEN": getToken()
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur modification réservation");
        }

        location.reload();
      })
      .catch((error) => {
        console.error("Erreur modification réservation :", error);
      });
  });
}

loadReservations();

