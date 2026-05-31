const accountForm = document.getElementById("accountForm");

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
        document.getElementById("NomInput").value = user.lastName || "";
        document.getElementById("PrenomInput").value = user.firstName || "";
        document.getElementById("EmailInput").value = user.email || "";
        document.getElementById("AllergieInput").value = user.allergy || "";
    })
    .catch((error) => {
        console.error("Erreur profil :", error);
    });

if (accountForm) {
    accountForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const dataToSend = new FormData();

        dataToSend.append("lastName", document.getElementById("NomInput").value);
        dataToSend.append("firstName", document.getElementById("PrenomInput").value);
        dataToSend.append("email", document.getElementById("EmailInput").value);
        dataToSend.append("allergy", document.getElementById("AllergieInput").value);

        fetch(apiUrl + "user/me", {
            method: "POST",
            body: dataToSend,
            headers: {
                "X-AUTH-TOKEN": getToken()
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur modification profil");
                }

                document.getElementById("successAccountModalTitle").textContent = "Profil mis à jour";
                document.getElementById("successAccountModalMessage").textContent =
                    "Vos informations personnelles ont été enregistrées avec succès.";

                const modal = new bootstrap.Modal(document.getElementById("successAccountModal"));
                modal.show();
            })
            .catch((error) => {
                console.error("Erreur modification profil :", error);
            });
    });
}