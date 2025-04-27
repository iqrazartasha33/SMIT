
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

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
const analytics = getAnalytics(app);
const auth = getAuth();

const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: "New User", 
        })
          .then(() => {
            Swal.fire({
              title: "Sign-Up Successful!",
              text: "You have registered successfully.",
              icon: "success",
              confirmButtonText: "Proceed to Login",
            }).then(() => {
              window.location.href = "./Login/Login.html";
            });
          })
          .catch((error) => {
            const errorMessage = error.message;
            Swal.fire({
              title: "Error",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "Try Again",
            });
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  } else {
    Swal.fire({
      title: "Please fill in both fields.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  }
});