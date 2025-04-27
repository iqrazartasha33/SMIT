import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-0EKNc4OaswnypRvy-yMzsLYXQUsqSsI",
  authDomain: "authentication-31e62.firebaseapp.com",
  projectId: "authentication-31e62",
  storageBucket: "authentication-31e62.firebasestorage.app",
  messagingSenderId: "183510381807",
  appId: "1:183510381807:web:e34a64010bb4f8c4fad71a",
  measurementId: "G-4YSCTC1PE4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Nav

const userEmailDisplay = document.getElementById("user-email");
const userDetails = document.getElementById("user-details");
const signInBtn = document.getElementById("google-login");

// ----------------- AUTH STATE CHANGE ------------------
// Check if the user is logged in and display the email
onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed");
  if (user) {
    console.log("User logged in:", user.email); // Log user email for debugging
    userEmailDisplay.textContent = user.email;
    userDetails.style.display = "block"; // Show email and logout button
    if (signInBtn) {
      signInBtn.style.display = "none"; // Hide the sign-in button
      console.log("Sign In button hidden");
    }
  } else {
    console.log("User is not logged in");
    window.location.href = "../Login/Login.html"; // Redirect if user is not logged in
    if (signInBtn) {
      signInBtn.style.display = "inline-block"; // Show the sign-in button if not logged in
      console.log("Sign In button visible");
    }
  }
});
// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
    fetchUserPosts();
  } else {
    alert("Please log in to view and manage your posts.");
    window.location.href = "../login/login.html"; // Redirect to login page
  }
});
// Nav

// Search Code
let debounceTimeout;

document
  .getElementById("search-categories")
  .addEventListener("input", (event) => {
    clearTimeout(debounceTimeout);
    const searchQuery = event.target.value.toLowerCase();

    debounceTimeout = setTimeout(() => {
      searchPostsByCategory(searchQuery);
    }, 1200); // Wait for 2 seconds after typing stops
  });

async function searchPostsByCategory(category) {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Clear old posts

  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const filteredPosts = querySnapshot.docs.filter((doc) => {
      const post = doc.data();
      return post.category && post.category.toLowerCase().includes(category);
    });

    if (filteredPosts.length === 0) {
      postsContainer.innerHTML = '<p class="text-center">No Data Found</p>';
      return;
    }

    filteredPosts.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement("div");
      postElement.className = "col-12";

      postElement.innerHTML = `
        <div class="card w-100 mb-4 shadow-sm" style="height: 250px;">
          <div class="card-body overflow-auto">
            <h5 class="card-title">${post.title || "No Title"}</h5>
            <p class="card-text">${post.content || "No Content"}</p>
            <p class="card-text"><strong>Category:</strong> ${
              post.category || "No Category"
            }</p>
            <p class="card-text"><strong>Guide Category:</strong> ${
              post.guideCategory || "No Guide"
            }</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">Posted by: ${
              post.authorEmail || "Unknown"
            }</small>
          </div>
        </div>
      `;

      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    postsContainer.innerHTML =
      '<p class="text-center text-danger">Failed to load posts.</p>';
  }
}

// Search Code

// Fetch and display posts with categories
async function displayPosts() {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Clear old posts

  try {
    const querySnapshot = await getDocs(collection(db, "posts"));

    if (querySnapshot.empty) {
      postsContainer.innerHTML = '<p class="text-center">No posts found.</p>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement("div");
      postElement.className = "col-12";

      postElement.innerHTML = `
        <div class="card w-100 mb-4 shadow-sm" style="height: 250px;">
          <div class="card-body overflow-auto">
            <h5 class="card-title">${post.title || "No Title"}</h5>
            <p class="card-text">${post.content || "No Content"}</p>
<p class="card-text"><strong>Category:</strong> ${
        post.category || "No Category"
      }</p>
              <p class="card-text"><strong>Guide Category:</strong> ${
                post.guideCategory || "No Guide"
              }</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">Posted by: ${
              post.authorEmail || "Unknown"
            }</small>
          </div>
        </div>
      `;

      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    postsContainer.innerHTML =
      '<p class="text-center text-danger">Failed to load posts.</p>';
  }
}

// Call function on page load
window.addEventListener("DOMContentLoaded", displayPosts);
