const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form"); // Corrected the selector

// Assuming you have an API endpoint for posting data to the server
const postFormData = async (formData) => {
  try {
    const response = await fetch("/api/postData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Handle success (optional)
      console.log("Data successfully posted to the server!");
    } else {
      // Handle error (optional)
      console.error("Failed to post data to the server.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Event listener for the "Post" button
document.getElementById("postButton").addEventListener("click", () => {
  // Collect form information (modify this part according to your form structure)
  const information = {
    text: document.querySelector('input[type="text"]').value,
    date: document.querySelector('input[type="date"]').value,
    area: document.querySelector("select").value,
  };

  // Call the function to post form data to the server
  postFormData(information);
});

btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share an ambrosia infestation place";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const allCategoriesButton = document.getElementById("btn-all");
  const cetateButton = document.getElementById("btn-cetate");
  const araduluiButton = document.getElementById("btn-aradului");
  const blascoviciButton = document.getElementById("btn-blascovici");
  const mehalaButton = document.getElementById("btn-mehala");
  const elisabetinButton = document.getElementById("btn-elisabetin");
  const plopiButton = document.getElementById("btn-plopi");
  const iosefinButton = document.getElementById("btn-iosefin");
  const frateliaButton = document.getElementById("btn-fratelia");
  const ciardaButton = document.getElementById("btn-ciarda");
  const torontaluluiButton = document.getElementById("btn-torontalului");
  const soareluiButton = document.getElementById("btn-soarelui");
  const giroculuiButton = document.getElementById("btn-girocului");
  const fabricButton = document.getElementById("btn-fabric");
  const freidorfButton = document.getElementById("btn-freidorf");
  const lipoveiButton = document.getElementById("btn-lipovei");
  const braytimButton = document.getElementById("btn-braytim");
  const circumvalatiuniiButton = document.getElementById(
    "btn-circumvalatiunii"
  );
  const ronatButton = document.getElementById("btn-ronat");
  const complexButton = document.getElementById("btn-complex");
  const tipografilorButton = document.getElementById("btn-tipografilor");
  const ghirodaButton = document.getElementById("btn-ghiroda");
  const padureaButton = document.getElementById("btn-padurea");
  const dumbravitaButton = document.getElementById("btn-dumbravita");
  const mosnitaButton = document.getElementById("btn-mosnita");
  const girocButton = document.getElementById("btn-giroc");
  const urseniButton = document.getElementById("btn-urseni");
  const saguluiButton = document.getElementById("btn-sagului");

  // Add references to other category buttons

  const factList = document.querySelector(".fact-list");
  const allFacts = factList.querySelectorAll(".fact");

  function showAllFacts() {
    fetch("/api/getFacts")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((facts) => {
        const factList = document.querySelector(".fact-list");

        // Clear existing list items
        factList.innerHTML = "";

        facts.forEach((fact) => {
          const li = document.createElement("li");
          li.className = "fact";

          const paragraph = document.createElement("p");
          paragraph.textContent = fact.text;

          const sourceLink = document.createElement("a");
          sourceLink.className = "source";
          sourceLink.href = fact.source;
          sourceLink.target = "_blank";
          sourceLink.textContent = "(Source)";

          const dateParagraph = document.createElement("p");
          dateParagraph.textContent = new Date(fact.date);

          paragraph.appendChild(sourceLink);
          paragraph.appendChild(dateParagraph);
          li.appendChild(paragraph);

          const tagSpan = document.createElement("span");
          tagSpan.className = "tag";
          tagSpan.style.backgroundColor = fact.tagColor;
          tagSpan.textContent = fact.area;
          li.appendChild(tagSpan);

          const voteButtonsDiv = document.createElement("div");
          voteButtonsDiv.className = "vote-buttons";

          const likeButton = document.createElement("button");
          likeButton.textContent = `👍 ${fact.likes}`;
          const dislikeButton = document.createElement("button");
          dislikeButton.textContent = `⛔️ ${fact.dislikes}`;

          voteButtonsDiv.appendChild(likeButton);
          voteButtonsDiv.appendChild(dislikeButton);
          li.appendChild(voteButtonsDiv);

          factList.appendChild(li);
        });
      })
      .catch((error) => {
        console.error("Fetch error: ", error);
      });
  }

  function filterFacts(category) {
    allFacts.forEach((fact) => {
      const tag = fact.querySelector(".tag").textContent.toLowerCase();
      if (tag === category) {
        fact.style.display = "block";
      } else {
        fact.style.display = "none";
      }
    });

    // Check if there are any facts displayed for the selected category
    const factsForCategory = Array.from(allFacts).some((fact) => {
      const tag = fact.querySelector(".tag").textContent.toLowerCase();
      return tag === category;
    });

    if (!factsForCategory) {
      // Show all facts if no facts are available for the selected category
      const noResult = document.getElementById(".no-result");
      return noResult;
    }
  }

  allCategoriesButton.addEventListener("click", function () {
    showAllFacts();
  });

  cetateButton.addEventListener("click", function () {
    filterFacts("cetate");
  });

  araduluiButton.addEventListener("click", function () {
    filterFacts("aradului");
  });
  blascoviciButton.addEventListener("click", function () {
    filterFacts("blascovici");
  });

  saguluiButton.addEventListener("click", function () {
    filterFacts("sagului");
  });
  mehalaButton.addEventListener("click", function () {
    filterFacts("mehala");
  });
  elisabetinButton.addEventListener("click", function () {
    filterFacts("elisabetin");
  });
  plopiButton.addEventListener("click", function () {
    filterFacts("plopi");
  });
  iosefinButton.addEventListener("click", function () {
    filterFacts("iosefin");
  });
  frateliaButton.addEventListener("click", function () {
    filterFacts("fratelia");
  });
  ciardaButton.addEventListener("click", function () {
    filterFacts("ciarda rosie");
  });
  torontaluluiButton.addEventListener("click", function () {
    filterFacts("torontalului");
  });
  soareluiButton.addEventListener("click", function () {
    filterFacts("soarelui");
  });
  giroculuiButton.addEventListener("click", function () {
    filterFacts("girocului");
  });
  fabricButton.addEventListener("click", function () {
    filterFacts("fabric");
  });
  freidorfButton.addEventListener("click", function () {
    filterFacts("freidorf");
  });
  lipoveiButton.addEventListener("click", function () {
    filterFacts("lipovei");
  });
  braytimButton.addEventListener("click", function () {
    filterFacts("braytim");
  });
  circumvalatiuniiButton.addEventListener("click", function () {
    filterFacts("circumvalatiunii");
  });
  ronatButton.addEventListener("click", function () {
    filterFacts("ronat");
  });
  complexButton.addEventListener("click", function () {
    filterFacts("complexul studentesc");
  });
  tipografilorButton.addEventListener("click", function () {
    filterFacts("tipografilor");
  });
  ghirodaButton.addEventListener("click", function () {
    filterFacts("ghiroda");
  });
  padureaButton.addEventListener("click", function () {
    filterFacts("padurea");
  });
  dumbravitaButton.addEventListener("click", function () {
    filterFacts("dumbravita");
  });
  mosnitaButton.addEventListener("click", function () {
    filterFacts("mosnita noua");
  });
  girocButton.addEventListener("click", function () {
    filterFacts("giroc");
  });
  urseniButton.addEventListener("click", function () {
    filterFacts("urseni");
  });
  saguluiButton.addEventListener("click", function () {
    filterFacts("sagului");
  });
});

function openLoginForm() {
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to close the login form
function closeLoginForm() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Show or hide the button based on the scroll position
window.addEventListener("scroll", function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

// Scroll to the top when the button is clicked
scrollToTopBtn.addEventListener("click", function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// Define the initMap function to be called by the Google Maps API callback
function initMap() {
  var mapProp = {
    center: new google.maps.LatLng(45.7494, 21.2272),
    zoom: 5,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  // Call the function to add markers from the script.js file

  addMarkers(map);
}

// Amână apelul funcției initMap până când API-ul Google Maps este încărcat
/*function addMarkers(map) {
  // Fetch coordinates from the server
  //fetch("/api/getCoordinates")
  console.log("Coordonatele obținute!!!!!!!");
  var testMarker = new google.maps.Marker({
    position: new google.maps.LatLng(45.7494, 21.2272),
    map: map,
    title: "Test Marker",
  });

  fetch("/api/postData")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((coordinates) => {
      console.log(coordinates);
      // Add markers to the map using the fetched coordinates
      coordinates.forEach((coord) => {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(coord.latitude, coord.longitude),
          map: map,
          title: coord.name, // Replace with the property that contains the marker title
        });
      });
    })
    .catch((error) =>
      console.error("Error fetching or processing coordinates:", error)
    );
}
*/

function addMarkers(map) {
  // Fetch coordinates from the server
  fetch("/api/getCoordinates")
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      try {
        const coordinates = JSON.parse(text); // Încearcă să convertești textul în JSON
        console.log(coordinates);
        console.log(typeof coordinates);
        const coordArray = coordinates.coordinates;

        // Acum poți itera prin array-ul de coordonate
        coordArray.forEach((coordinate) => {
          const longitude = coordinate.longitude;
          const latitude = coordinate.latitude;

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
            title: "Marker Title", // Replace with the property that contains the marker title
          });
        });
        // Continuă cu procesarea datelor...
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    })
    .catch((error) =>
      console.error("Error fetching or processing coordinates:", error)
    );
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
  alert("Geolocation is not supported by this browser.");
}

function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  alert("Latitude: " + latitude + "\nLongitude: " + longitude);
  // Aici puteți trimite datele de locație la server sau să le procesați în alt mod.
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
