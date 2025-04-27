import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-0EKNc4OaswnypRvy-yMzsLYXQUsqSsI",
  authDomain: "authentication-31e62.firebaseapp.com",
  projectId: "authentication-31e62",
  storageBucket: "authentication-31e62.firebasestorage.app",
  messagingSenderId: "183510381807",
  appId: "1:183510381807:web:e34a64010bb4f8c4fad71a",
  measurementId: "G-4YSCTC1PE4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const todoList = document.getElementById('todo-list');
const inProgressList = document.getElementById('in-progress-list');
const doneList = document.getElementById('done-list');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    fetchTasks(user.email);
  } else {
    console.log("User is not logged in");
    window.location.href = "../Login/Login.html";
  }
});

async function fetchTasks(userEmail) {
  const tasksQuery = query(collection(db, "tasks"), where("userEmail", "==", userEmail));
  const querySnapshot = await getDocs(tasksQuery);
  
  const tasks = {
    "To Do": [],
    "In Progress": [],
    "Done": []
  };

  querySnapshot.forEach((doc) => {
    const task = doc.data();
    const status = task.status;

    task.id = doc.id;

    if (tasks[status]) {
      tasks[status].push(task);
    }
  });

  displayTasks(tasks);
}

function displayTasks(tasks) {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-item');
    taskCard.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <button onclick="moveToNextStatus('${task.id}', '${task.status}')">Move to Next Status</button>
      <button onclick="editTask('${task.id}')">Edit</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    `;
    return taskCard;
  }

  tasks["To Do"].forEach(task => todoList.appendChild(createTaskCard(task)));
  tasks["In Progress"].forEach(task => inProgressList.appendChild(createTaskCard(task)));
  tasks["Done"].forEach(task => doneList.appendChild(createTaskCard(task)));
}

window.moveToNextStatus = async function (taskId, currentStatus) {
  let nextStatus;

  switch (currentStatus) {
    case "To Do":
      nextStatus = "In Progress";
      break;
    case "In Progress":
      nextStatus = "Done";
      break;
    default:
      return;
  }

  const taskRef = doc(db, "tasks", taskId);
  try {
    await updateDoc(taskRef, {
      status: nextStatus
    });

    const user = auth.currentUser;
    if (user) {
      fetchTasks(user.email);
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

window.editTask = async function (taskId) {
  const taskRef = doc(db, "tasks", taskId);
  const newTitle = prompt("Enter the new title:");
  const newDescription = prompt("Enter the new description:");

  try {
    await updateDoc(taskRef, {
      title: newTitle,
      description: newDescription
    });
    const user = auth.currentUser;
    if (user) {
      fetchTasks(user.email);
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

window.deleteTask = async function (taskId) {
  const taskRef = doc(db, "tasks", taskId);

  try {
    await deleteDoc(taskRef);
    const user = auth.currentUser;
    if (user) {
      fetchTasks(user.email);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};