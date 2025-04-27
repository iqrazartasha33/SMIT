import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

let currentUserEmail = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
    fetchUserPosts();
  } else {
    alert("Please log in to view and manage your posts.");
    window.location.href = "../login/login.html"; 
  }
});

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
// Nav

// Fetch user's posts from Firestore
async function fetchUserPosts() {
  const postsContainer = document.getElementById("my-posts-container");
  postsContainer.innerHTML = "Loading your posts...";

  try {
    const q = query(
      collection(db, "posts"),
      where("authorEmail", "==", currentUserEmail)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      postsContainer.innerHTML = "<p>You have no posts yet.</p>";
      return;
    }

    let postsHTML = "";
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      postsHTML += `
        <div class="post-card">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><strong>Category:</strong> ${post.category}</p>
          <p><strong>Guide Category:</strong> ${
            post.guideCategory || "No Guide"
          }</p>
          <p><small>Posted by: ${post.authorEmail}</small></p>
          <button class="btn btn-primary" onclick="editPost('${
            doc.id
          }')">Edit</button>
          <button class="btn btn-danger" onclick="deletePost('${
            doc.id
          }')">Delete</button>
        </div>
        <hr>
      `;
    });

    postsContainer.innerHTML = postsHTML;
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsContainer.innerHTML =
      "<p>Failed to load your posts. Try again later.</p>";
  }
}

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
  const postsContainer = document.getElementById("my-posts-container");
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

// Edit post function
async function editPost(postId) {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  const postData = postDoc.data();

  // Check if current user is the author
  if (postData.authorEmail === currentUserEmail) {
    const newTitle = prompt("Edit post title:", postData.title);
    const newContent = prompt("Edit post content:", postData.content);
    const newCategory = prompt("Edit post category:", postData.category);

    if (newTitle && newContent && newCategory) {
      await updateDoc(postRef, {
        title: newTitle,
        content: newContent,
        category: newCategory,
        updatedAt: serverTimestamp(),
      });

      alert("Post updated successfully!");
      fetchUserPosts(); // Refresh posts
    }
  } else {
    alert("You are not authorized to edit this post.");
  }
}

// Delete post function
async function deletePost(postId) {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  const postData = postDoc.data();

  // Check if current user is the author
  if (postData.authorEmail === currentUserEmail) {
    const confirmation = confirm("Are you sure you want to delete this post?");
    if (confirmation) {
      await deleteDoc(postRef);
      alert("Post deleted successfully!");
      fetchUserPosts(); // Refresh posts
    }
  } else {
    alert("You are not authorized to delete this post.");
  }
}

// Make the functions accessible globally
window.editPost = editPost;
window.deletePost = deletePost;
