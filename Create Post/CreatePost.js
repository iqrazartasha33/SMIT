// Firebase imports
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
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Firebase Configuration
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
const app = initializeApp(firebaseConfig); // Initialize Firebase App
const auth = getAuth(app); // Initialize Firebase Auth
const db = getFirestore(app); // Initialize Firestore

// DOM Elements
const createPostForm = document.getElementById("create-post-form");
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

// ----------------- CREATE POST FORM ------------------
// Handle form submission
createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const postTitle = document.getElementById("post-title").value.trim();
  const postContent = document.getElementById("post-content").value.trim();
  const postCategory = document.getElementById("post-category").value;
  const guideCategory = document.getElementById('guide-category').value;


  // Get the logged-in user
  const user = auth.currentUser;

  // If no user is logged in, show alert
  if (!user) {
    alert("⚠️ You must be logged in to create a post.");
    return;
  }

  try {
    // Add post to Firestore
    await addDoc(collection(db, "posts"), {
      title: postTitle,
      content: postContent,
      category: postCategory,
      authorId: user.uid,
      authorEmail: user.email,
      guideCategory: guideCategory,  // ✅ Add this line
      createdAt: serverTimestamp(),
    });

    // Success: Show message and reset the form
    alert("✅ Post created successfully!");
    createPostForm.reset();
    window.location.href = "../Posts/Allposts.html";
  } catch (error) {
    // Error handling
    console.error("❌ Error creating post:", error);
    alert("❌ Failed to create post. Please try again.");
  }
});
// ----------------- DISPLAY POSTS (Newest First) ------------------
async function displayPosts() {
  const postsContainer = document.getElementById("posts-container");
  if (!postsContainer) return; // Safety check

  postsContainer.innerHTML = ""; // Clear old posts

  try {
    const querySnapshot = await getDocs(collection(db, "posts"));

    // Saare posts ko ek array me le aate hain
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });

    // Posts ko createdAt ke hisaab se newest first sort karte hain
    posts.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0; // Safety: agar createdAt missing ho
      return b.createdAt.seconds - a.createdAt.seconds;
    });

    // Ek hi baar me HTML build karenge
    let postsHTML = "";

    posts.forEach((post) => {
      postsHTML += `
        <div class="post-card">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><strong>Category:</strong> ${post.category}</p>
          <p><strong>Guide Category:</strong> ${post.guideCategory}</p>
          <p><small>Posted by: ${post.authorEmail}</small></p>
          <hr>
        </div>
      `;
    });
    

    postsContainer.innerHTML = postsHTML;
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    alert("Failed to load posts.");
  }
}

// Page load pe posts show karna
window.addEventListener("DOMContentLoaded", () => {
  displayPosts();
});
