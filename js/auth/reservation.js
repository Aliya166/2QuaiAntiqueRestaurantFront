const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!isConnected()) {
      const loginModalElement = document.getElementById("loginRequiredModal");

      if (loginModalElement) {
        const loginModal = bootstrap.Modal.getOrCreateInstance(loginModalElement);
        loginModal.show();
      } else {
        alert("Veuillez vous connecter ou créer un compte pour réserver.");
      }

      return;
    }

    const formData = new FormData(reservationForm);

    const date = formData.get("Date");
    const heure = formData.get("Heure");

    const reservation = {
      date: `${date} ${heure}`,
      guests: Number(formData.get("NbConvives")),
      comment: formData.get("Allergies") || ""
    };

    const dataToSend = new FormData();
    dataToSend.append("date", reservation.date);
    dataToSend.append("guests", reservation.guests);
    dataToSend.append("comment", reservation.comment);
    dataToSend.append("token", getToken());

    console.log("TOKEN =", getToken());

    fetch(apiUrl + "reservations", {
      method: "POST",
      body: dataToSend,
      headers: {
        "X-AUTH-TOKEN": getToken()
      }

    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur création réservation");
        }

        return response.json();
      })
      .then(() => {
        reservationForm.reset();

        const confirmModalElement = document.querySelector("#reservationConfirmModal");

        if (!confirmModalElement) {
          alert("Votre réservation est confirmée");
          return;
        }

        const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalElement);
        confirmModal.show();
      })
      .catch((error) => {
        console.error("Erreur réservation :", error);
      });
  });
}