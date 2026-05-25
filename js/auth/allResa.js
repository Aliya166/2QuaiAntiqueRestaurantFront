const reservationsList = document.getElementById("reservationsList");

function loadReservations() {
  if (!reservationsList) return;

  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  if (reservations.length === 0) {
    reservationsList.innerHTML = `
      <div class="alert alert-info text-center">
        Vous n’avez aucune réservation pour le moment.
      </div>
    `;
    return;
  }

  const safeReservations = reservations.map((reservation) => ({
  ...reservation,
  nom: sanitizeHTML(reservation.nom || ""),
  prenom: sanitizeHTML(reservation.prenom || ""),
  serviceChoisi: sanitizeHTML(reservation.serviceChoisi || ""),
  date: sanitizeHTML(reservation.date || ""),
  heure: sanitizeHTML(reservation.heure || ""),
  nbConvives: sanitizeHTML(String(reservation.nbConvives || "")),
  allergies: sanitizeHTML(reservation.allergies || ""),
  }));

  reservationsList.innerHTML = safeReservations
    .map(
      (reservation, index) => `
        <div class="card reservation-card mb-4 shadow-sm border-0">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 class="card-title mb-1">${reservation.nom || ""} ${reservation.prenom || ""}</h4>
                <span class="badge text-bg-dark">${reservation.serviceChoisi || "-"}</span>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <p class="mb-2"><strong>Date :</strong> ${reservation.date || "-"}</p>
                <p class="mb-2"><strong>Heure :</strong> ${reservation.heure || "-"}</p>
                <p class="mb-2"><strong>Convives :</strong> ${reservation.nbConvives || "-"}</p>
                <p class="mb-0"><strong>Allergies :</strong> ${reservation.allergies || "Aucune"}</p>
              </div>
            </div>

            <div class="text-end mt-4">
              <button 
                class="btn btn-outline-danger btn-sm delete-reservation-btn"
                data-index="${index}"
              >
                Annuler la réservation
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  const deleteButtons = document.querySelectorAll(".delete-reservation-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;
      deleteReservation(index);
    });
  });
}

function deleteReservation(index) {
  const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  reservations.splice(index, 1);

  localStorage.setItem("reservations", JSON.stringify(reservations));

  loadReservations();
}

loadReservations();