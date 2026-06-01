function fillReservationWithUserProfile() {
  if (!isConnected()) return;

  fetch(apiUrl + "user/me", {
    headers: {
      "X-AUTH-TOKEN": getToken()
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur chargement profil");
      }

      return response.json();
    })
    .then((user) => {
      const nomInput = document.querySelector('[name="Nom"]');
      const prenomInput = document.querySelector('[name="Prenom"]');
      const allergiesInput = document.querySelector('[name="Allergies"]');

      if (nomInput) nomInput.value = user.lastName || "";
      if (prenomInput) prenomInput.value = user.firstName || "";
      if (allergiesInput) allergiesInput.value = user.allergy || "";
    })
    .catch(() => {});
}

fillReservationWithUserProfile();

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

    const date = formData.get("Date") || "";
    const heure = formData.get("Heure") || "";

    // Ensure parts are strings to avoid default object stringification (e.g. '[object Object]')
    const reservationDate = [date, heure]
      .filter(Boolean)
      .map((part) => typeof part === "string" ? part.trim() : "")
      .filter(Boolean)
      .join(" ");

    const reservation = {
      date: reservationDate,
      guests: Number(formData.get("NbConvives")),
      comment: formData.get("Allergies") || ""
    };

    const dataToSend = new FormData();
    dataToSend.append("date", reservation.date);
    dataToSend.append("guests", reservation.guests);
    dataToSend.append("comment", reservation.comment);
    dataToSend.append("token", getToken());


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
      .catch(() => {
        alert("Erreur lors de la création de la réservation");
      });
  });
}