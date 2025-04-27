import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-0EKNc4OaswnypRvy-yMzsLYXQUsqSsI",
  authDomain: "authentication-31e62.firebaseapp.com",
  projectId: "authentication-31e62",
  storageBucket: "authentication-31e62.firebasestorage.app",
  messagingSenderId: "183510381807",
  appId: "1:183510381807:web:e34a64010bb4f8c4fad71a",
  measurementId: "G-4YSCTC1PE4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userEmailDisplay = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const userDetails = document.getElementById("user-details");
const signInBtn = document.getElementById("google-login");


onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed"); 
  if (user) {
    console.log("User logged in:", user.email); 
    userEmailDisplay.textContent = user.email;
    userDetails.style.display = "block"; 
    if (signInBtn) {
      signInBtn.style.display = "none"; 
      console.log("Sign In button hidden");
    }
  } else {
    console.log("User is not logged in");
    window.location.href = "../Login/Login.html";
    if (signInBtn) {
      signInBtn.style.display = "inline-block"; 
      console.log("Sign In button visible");
    }
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      Swal.fire("Success", "You have been logged out.", "success");
      setTimeout(() => {
        window.location.href = "../Login/Login.html";
      }, 1500);
    })
    .catch((error) => {
      console.error("Logout error:", error);
      Swal.fire("Error", "Something went wrong while logging out.", "error");
    });
});

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      Swal.fire("Success", "You have been logged out.", "success");
      setTimeout(() => {
        window.location.href = "../Login/Login.html";
      }, 1500);
    })
    .catch((error) => {
      console.error("Logout error:", error);
      Swal.fire("Error", "Something went wrong while logging out.", "error");
    });
});
