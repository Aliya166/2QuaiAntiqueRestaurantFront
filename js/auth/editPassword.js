const editPasswordForm = document.getElementById("editPasswordForm");

if (editPasswordForm) {
  editPasswordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = document.getElementById("PasswordInput").value;
    const passwordConfirm = document.getElementById("ValidatePasswordInput").value;

    const dataToSend = new FormData();
    dataToSend.append("password", password);
    dataToSend.append("passwordConfirm", passwordConfirm);

    fetch(apiUrl + "user/password", {
      method: "POST",
      body: dataToSend,
      headers: {
        "X-AUTH-TOKEN": getToken()
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur modification mot de passe");
        }

        const modal = new bootstrap.Modal(document.getElementById("successPasswordModal"));
        modal.show();
      })
      .catch((error) => {
        console.error("Erreur mot de passe :", error);
      });
  });
}