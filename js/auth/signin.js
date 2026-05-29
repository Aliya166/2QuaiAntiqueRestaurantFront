var mailInput = document.getElementById("EmailInput");
var passwordInput = document.getElementById("PasswordInput");
var btnSingin = document.getElementById("btnSignin");
var signinForm = document.getElementById("signinForm");

btnSingin.addEventListener("click", checkCredentials);

function checkCredentials(){
    
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    let raw = JSON.stringify({
        "username": document.getElementById("EmailInput").value.trim(),
        "password": document.getElementById("PasswordInput").value.trim()
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    console.log(raw);
    console.log("API:", apiUrl+"login");

    fetch(apiUrl+"login", requestOptions)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
        }
    })
    .then(result => {
        const token = result.apiToken;
        setToken(token);
        //placer ce token en cookie

        setCookie(RoleCookieName, result.roles[0], 7);
        globalThis.location.replace("/");
    })
    .catch(error => console.log('error', error));
}