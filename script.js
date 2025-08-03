// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBu4zs_j5LS6WXt83U7acBljCO6WvW9NUE",
  authDomain: "smartnest-home.firebaseapp.com",
  databaseURL: "https://smartnest-home-default-rtdb.firebaseio.com",
  projectId: "smartnest-home",
  storageBucket: "smartnest-home.firebasestorage.app",
  messagingSenderId: "391039769255",
  appId: "1:391039769255:web:0f97ce766aa5d3e586d982",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get DOM elements
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");

// Login event listener
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Signed in as", userCredential.user.email);
      loginForm.style.display = "none";
      dashboard.style.display = "block";
      startRelayControl();
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Start relay control functionality
function startRelayControl() {
  const db = firebase.database();

  const relays = [
    { id: 1, path: "relay1" },
    { id: 2, path: "relay2" },
    { id: 3, path: "relay3" },
    { id: 4, path: "relay4" },
  ];

  relays.forEach((relay) => {
    const statusText = document.getElementById(`status${relay.id}`);
    const toggleButton = document.getElementById(`btn${relay.id}`);
    const relayRef = db.ref("/" + relay.path);

    // Listen for relay state changes
    relayRef.on("value", (snapshot) => {
      const state = snapshot.val();
      statusText.innerText = state ? "ON" : "OFF";
      toggleButton.style.backgroundColor = state ? "green" : "blue";
    });

    // Toggle relay state on button click
    toggleButton.onclick = () => {
      relayRef.get().then((snap) => {
        relayRef.set(!snap.val());
      });
    };
  });

  // All OFF button functionality
  document.getElementById("allOffBtn").onclick = () => {
    relays.forEach((relay) => {
      db.ref("/" + relay.path).set(false);
    });
  };
}

// Logout functionality
document.getElementById("logoutBtn").onclick = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dashboard.style.display = "none";
      loginForm.style.display = "block";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
};