import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute == null) {
    return route404;
  } else {
    return currentRoute;
  }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = globalThis.location.pathname;
  const actualRoute = getRouteByUrl(path);

  const allRolesArray = actualRoute.authorize;

  if (allRolesArray.length > 0) {
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        globalThis.location.replace("/");
        return;
      }
    } else {
      const roleUser = getRole();
      if (!allRolesArray.includes(roleUser)) {
        globalThis.location.replace("/");
        return;
      }
    }
  }

  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;

  document.querySelectorAll("script[data-route-script]").forEach((script) => {
    script.remove();
  });

  if (actualRoute.pathJS !== "") {
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    scriptTag.dataset.routeScript = "true";

    document.querySelector("body").appendChild(scriptTag);
  }

  document.title = actualRoute.title + " - " + websiteName;
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event.preventDefault();

  const link = event.currentTarget;
  const url = link.getAttribute("href");

  globalThis.history.pushState({}, "", url);
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
globalThis.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
globalThis.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage(); 
