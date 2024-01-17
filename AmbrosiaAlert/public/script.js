const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form"); // Corrected the selector
let globalLatitude;
let globalLongitude;
let globalUsername;

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
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString(); // Converteste la format ISO pentru a obtine data si ora completa
  const information = {
    text: document.querySelector('input[type="text"]').value,
    date: formattedDate,
    area: document.querySelector("select").value,
    latitude: globalLatitude,
    longitude: globalLongitude,
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
          paragraph.textContent = fact.text._;

          const sourceLink = document.createElement("a");
          sourceLink.className = "source";
          sourceLink.href = fact.source;
          sourceLink.target = "_blank";
          sourceLink.textContent = "(Source)";

          const dateParagraph = document.createElement("p");
          dateParagraph.textContent = new Date(fact.Timestamp._);

          paragraph.appendChild(sourceLink);
          paragraph.appendChild(dateParagraph);
          li.appendChild(paragraph);

          const tagSpan = document.createElement("span");
          tagSpan.className = "tag";
          tagSpan.style.backgroundColor = fact.tagColor;
          tagSpan.textContent = fact.area._;
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
});

async function closeLoginForm() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

async function submitFormData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  let longitude = globalLongitude;
  let latitude = globalLatitude;
  globalUsername = name;

  console.log("Name:", name);
  console.log("Email:", email);

  try {
    const response = await fetch("/api/saveUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${name}&email=${email}&longitude=${longitude}&latitude=${latitude}`,
    });

    console.log(
      "Request body:",
      `name=${name}&email=${email}&longitude=${longitude}&latitude=${latitude}`
    ); // Log the request body

    if (response.ok) {
      console.log("Data submitted successfully!");
      closeLoginForm(); // Închide formularul după trimitere
    } else {
      console.error("Error submitting data:", response.status);
      // Poți adăuga și manipulare suplimentară aici, dacă este cazul
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    // Poți adăuga și manipulare suplimentară aici, dacă este cazul
  }
}

function openLoginForm() {
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("overlay").style.display = "block";
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
    zoom: 9,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  // Call the function to add markers from the script.js file

  addMarkers(map);
}

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

//GEOLOCATIE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
  alert("Geolocation is not supported by this browser.");
}

function showPosition(position) {
  var latitude = position.coords.latitude.toFixed(4);
  var longitude = position.coords.longitude.toFixed(4);

  alert("Latitude: " + latitude + "\nLongitude: " + longitude);
  // Salvare coordonate în variabile globale
  globalLatitude = latitude;
  globalLongitude = longitude;
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

function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, buffer);
}

function pollForMessages() {
  setInterval(() => {
    // Faceți o cerere către backend pentru a obține mesajele
    fetch("/api/startReceiver")
      .then((response) => response.json())
      .then((data) => {
        const messages = data.messages;

        // Aici puteți procesa mesajele cum doriți (afișare, manipulare etc.)
        console.log("Received messages:", messages);
        const usernameToCheck = globalUsername;

        // Verificăm dacă username-ul este prezent în oricare dintre mesaje
        //const usernameFound = messages.some((message) =>
        //  message.includes(usernameToCheck)
        //);
        // Căutăm mesajul care conține username-ul
        const foundMessage = messages.find((message) =>
          message.includes(usernameToCheck)
        );

        // Afișăm alerta doar dacă am găsit mesajul
        if (foundMessage) {
          alert("ALERT: " + foundMessage + "\n");
        }

        // if (usernameFound) {
        //  console.log("am gasit", messages);
        //}
        //if (messages.length > 0) alert("ALLERT: " + messages + "\n");
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, 5000);
}

// Funcție pentru a converti un array de bytes în șir de caractere
function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buffer));
}

// Apelați funcția pentru a începe polling-ul
pollForMessages();
