const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(reservationForm);

    const reservation = {
      nom: formData.get("Nom"),
      prenom: formData.get("Prenom"),
      allergies: formData.get("Allergies"),
      nbConvives: formData.get("NbConvives"),
      date: formData.get("Date"),
      serviceChoisi: formData.get("serviceChoisi"),
      heure: formData.get("Heure")
    };

    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    reservations.push(reservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    const confirmModalElement = document.querySelector("#reservationConfirmModal");

    if (!confirmModalElement) {
      alert("Votre réservation est confirmée");
      return;
    }

    const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalElement);
    confirmModal.show();
  });
}