import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
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

const taskForm = document.getElementById("taskForm");
const userEmailDisplay = document.getElementById("user-email");
const userDetails = document.getElementById("user-details");
const signInBtn = document.getElementById("google-login");

onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed");
  if (user) {
    console.log("User logged in:", user.email);
    if (userEmailDisplay) {
      userEmailDisplay.textContent = user.email;
      userDetails.style.display = "block";
    }
    if (signInBtn) {
      signInBtn.style.display = "none";
    }
  } else {
    console.log("User is not logged in");
    window.location.href = "../Login/Login.html";
    if (signInBtn) {
      signInBtn.style.display = "inline-block";
    }
  }
});

if (taskForm) {
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const assignedTo = document.getElementById("assignedTo").value.trim();
    const status = document.getElementById("status").value;

    const user = auth.currentUser;

    if (!user) {
      alert("Login first to save the task.");
      return; 
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        assignedTo: assignedTo,
        status: status,
        userEmail: user.email, 
        createdAt: serverTimestamp(), 
        pakistanTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
      });

      alert("✅ Task saved successfully!");
      taskForm.reset();
       window.location.href = "../My Task/MyTask.html";
    } catch (error) {
      console.error(" Error saving task:", error);
      alert(" Failed to save task. Please try again!");
    }
  });
}