/*MENU DEROULANT*/
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu-deroulant");
const menuOnglets = document.querySelectorAll(".menu-deroulant a");
const dots1 = document.querySelector(".dots1");
const dots2 = document.querySelector(".dots2");
const dots3 = document.querySelector(".dots3");
const body1 = document.body;
burger.addEventListener("click", () => {
  dots1.classList.toggle("dots4");
  dots2.classList.toggle("dots5");
  dots3.classList.toggle("dots6");
  menu.classList.toggle("open");
  body1.classList.toggle("no-scroll");
});
menuOnglets.forEach((onglets) => {
  onglets.addEventListener("click", () => {
    if (menu.classList.contains("open")) {
      dots1.classList.remove("dots4");
      dots2.classList.remove("dots5");
      dots3.classList.remove("dots6");
      menu.classList.remove("open");
      body1.classList.remove("no-scroll");
    }
  });
});
/*FIN MENU DEROULANT*/

/*SUGGESTION ADRESSE FORMULAIRE*/
const departFormulaire = document.getElementById("depart-formulaire");
const suggestionsDepartFormulaire = document.querySelector(
  ".suggestion-depart-formulaire"
);

let timeoutDepartFormulaire = null;

departFormulaire.addEventListener("input", function () {
  const query = this.value;
  clearTimeout(timeoutDepartFormulaire);

  if (query.length < 3) {
    suggestionsDepartFormulaire.innerHTML = "";
    return;
  }

  timeoutDepartFormulaire = setTimeout(() => {
    fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=5`
    )
      .then((response) => response.json())
      .then((data) => {
        suggestionsDepartFormulaire.innerHTML = "";
        data.features.forEach((feature) => {
          const suggestion = document.createElement("div");
          suggestion.textContent = feature.properties.label;
          suggestion.addEventListener("click", () => {
            departFormulaire.value = feature.properties.label;
            suggestionsDepartFormulaire.innerHTML = "";
          });
          suggestionsDepartFormulaire.appendChild(suggestion);
        });
      });
  }, 300); // petit délai pour éviter les appels trop rapides
});

const arriveFormulaire = document.getElementById("arrive-formulaire");
const suggestionsArriveFormulaire = document.querySelector(
  ".suggestion-arrive-formulaire"
);

let timeoutArriveFormulaire = null;

arriveFormulaire.addEventListener("input", function () {
  const query = this.value;
  clearTimeout(timeoutArriveFormulaire);

  if (query.length < 3) {
    suggestionsArriveFormulaire.innerHTML = "";
    return;
  }

  timeoutArriveFormulaire = setTimeout(() => {
    fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=5`
    )
      .then((response) => response.json())
      .then((data) => {
        suggestionsArriveFormulaire.innerHTML = "";
        data.features.forEach((feature) => {
          const suggestion = document.createElement("div");
          suggestion.textContent = feature.properties.label;
          suggestion.addEventListener("click", () => {
            arriveFormulaire.value = feature.properties.label;
            suggestionsArriveFormulaire.innerHTML = "";
          });
          suggestionsArriveFormulaire.appendChild(suggestion);
        });
      });
  }, 300); // petit délai pour éviter les appels trop rapides
});
/*FIN SUGGESTION ADRESSE FORMULAIRE*/

/*SUGGESTION ADRESSE ESTIMATION*/
const depart = document.getElementById("depart-estimation");
const suggestionsDepart = document.querySelector(
  ".suggestion-depart-estimation"
);

let timeoutDepart = null;

depart.addEventListener("input", function () {
  const query = this.value;
  clearTimeout(timeoutDepart);

  if (query.length < 3) {
    suggestionsDepart.innerHTML = "";
    return;
  }

  timeoutDepart = setTimeout(() => {
    fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=5`
    )
      .then((response) => response.json())
      .then((data) => {
        suggestionsDepart.innerHTML = "";
        data.features.forEach((feature) => {
          const suggestion = document.createElement("div");
          suggestion.textContent = feature.properties.label;
          suggestion.addEventListener("click", () => {
            depart.value = feature.properties.label;
            suggestionsDepart.innerHTML = "";
          });
          suggestionsDepart.appendChild(suggestion);
        });
      });
  }, 300); // petit délai pour éviter les appels trop rapides
});

const arrive = document.getElementById("arrive-estimation");
const suggestionsArrive = document.querySelector(
  ".suggestion-arrive-estimation"
);

let timeoutArrive = null;

arrive.addEventListener("input", function () {
  const query = this.value;
  clearTimeout(timeoutArrive);

  if (query.length < 3) {
    suggestionsArrive.innerHTML = "";
    return;
  }

  timeoutArrive = setTimeout(() => {
    fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=5`
    )
      .then((response) => response.json())
      .then((data) => {
        suggestionsArrive.innerHTML = "";
        data.features.forEach((feature) => {
          const suggestion = document.createElement("div");
          suggestion.textContent = feature.properties.label;
          suggestion.addEventListener("click", () => {
            arrive.value = feature.properties.label;
            suggestionsArrive.innerHTML = "";
          });
          suggestionsArrive.appendChild(suggestion);
        });
      });
  }, 300); // petit délai pour éviter les appels trop rapides
});
/*FIN SUGGESTION ADRESSE ESTIMATION*/

/*MAP ET CALCUL ITINERAIRES OPENSTREET*/
document.addEventListener("DOMContentLoaded", () => {
  // Supprimer la carte précédente uniquement si elle existe

  // Initialisation de la carte
  const map = L.map("map").setView([48.866667, 2.333333], 11);
  window.map = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let markers = [];
  let routeLine = null;

  // Géocodage : adresse → coordonnées
  async function geocode(adresse) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      adresse
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) throw new Error("Adresse introuvable : " + adresse);

    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  }

  // Distance réelle via OSRM
  async function getDistanceOSRM(lat1, lon1, lat2, lon2) {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok") {
      const route = data.routes[0];

      if (routeLine) map.removeLayer(routeLine);
      routeLine = L.geoJSON(route.geometry, {
        color: "rgb(34, 195, 93)",
        weight: 6,
      }).addTo(map);

      return route.distance / 1000; // km
    } else {
      throw new Error("Erreur OSRM : " + data.message);
    }
  }

  // Calcul principal
  async function calculer() {
    const depart = document.getElementById("depart-estimation").value.trim();
    const arrivee = document.getElementById("arrive-estimation").value.trim();
    const resultEuro = document.getElementById("result-euro");
    const resultWay = document.getElementById("result-way");

    if (!depart || !arrivee) {
      alert("Veuillez entrer deux adresses valides !");
      return;
    }

    try {
      result.textContent = "⏳ Estimation en cours...";
      console.log("Départ:", depart);
      console.log("Arrivée:", arrivee);
      const coordDepart = await geocode(depart);
      const coordArrivee = await geocode(arrivee);

      markers.forEach((m) => map.removeLayer(m));
      markers = [
        L.marker([coordDepart.lat, coordDepart.lon])
          .addTo(map)
          .bindPopup("Départ")
          .openPopup(),
        L.marker([coordArrivee.lat, coordArrivee.lon])
          .addTo(map)
          .bindPopup("Arrivée"),
      ];

      map.fitBounds(L.latLngBounds(markers.map((m) => m.getLatLng())), {
        padding: [50, 50],
      });

      const distanceKm = await getDistanceOSRM(
        coordDepart.lat,
        coordDepart.lon,
        coordArrivee.lat,
        coordArrivee.lon
      );
      const prix = 3 + 7 + distanceKm * 2;

      resultWay.textContent = `${distanceKm.toFixed(2)} Km`;
      resultEuro.textContent = `${prix.toFixed(2)} €`;
      result.textContent = "";
    } catch (err) {
      console.error(err);
      alert("Erreur : " + err.message);
    }
  }

  // Réinitialiser la carte
  function resetCarte() {
    document.getElementById("depart-estimation").value = "";
    document.getElementById("arrive-estimation").value = "";
    document.getElementById("result-euro").textContent = "";
    document.getElementById("result-way").textContent = "";

    markers.forEach((m) => map.removeLayer(m));
    markers = [];

    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }

    map.setView([46.5, 2.5], 6);
  }
  // Boutons
  document.getElementById("btnCalc").addEventListener("click", calculer);
  document.getElementById("btnReset").addEventListener("click", resetCarte);
});
/*FIN MAP ET CALCUL ITINERAIRE OPENSTREET*/

/*COUNTER*/
const counters = document.querySelectorAll(".counter");
const speed = 100; // plus petit = plus rapide
const runCounter = () => {
  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = Math.ceil(target / speed);
      if (count < target) {
        counter.innerText = count + increment;
        setTimeout(updateCount, 30);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};
// Lancer l'animation quand la section est visible

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      runCounter();
      observer.disconnect(); // Lancer une seule fois
    }
  },
  { threshold: 0.5 }
);
observer.observe(document.querySelector(".section-counter"));
/*FIN COUNTER*/

/*BUTTON SCROLL TO TOP*/
const btnTop = document.querySelector(".top");
const body = document.body;
/*window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    btnTop.classList.add("top1");
  } else {
    btnTop.classList.remove("top1");
  }*/
btnTop.addEventListener("click", () => {
  this.window.scrollTo({ top: 0, behavior: "smooth" });
});

/*FIN BUTTON SCROLL TO TOP*/
