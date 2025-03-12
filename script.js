import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase configuration (Replace with your actual Firebase details)
const firebaseConfig = {
    apiKey: "AIzaSyCRfKNIXrZFhksR5jL_o4EBIVLxaf_Hqog",
    authDomain: "medicare-d14d2.firebaseapp.com",
    projectId: "medicare-d14d2",
    storageBucket: "medicare-d14d2.appspot.com",
    messagingSenderId: "279260936101",
    appId: "1:279260936101:web:164351511af90ec27454ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to toggle password visibility
window.togglePassword = function (inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
};


// Function to add medication to Firestore
async function addMedication(medicationType, timeToTake) {
    try {
        const docRef = await addDoc(collection(db, "medications"), {
            type: medicationType,
            time: timeToTake,
            timestamp: new Date()
        });
        console.log("Medication added with ID: ", docRef.id);
        alert("Medication saved successfully!");
    } catch (e) {
        console.error("Error adding medication: ", e);
        alert("Error saving medication.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("formTitle");
    const signupFields = document.getElementById("signupFields");
    const toggleText = document.getElementById("toggleText");
    const message = document.getElementById("message");
    const confirmPassword = document.getElementById("confirmPassword");

    const authContainer = document.getElementById("authContainer");
    const medicationContainer = document.getElementById("medicationContainer");

    window.toggleForm = function () {
        if (formTitle.textContent === "Login") {
            formTitle.textContent = "Sign Up";
            signupFields.classList.remove("hidden");
            confirmPassword.classList.remove("hidden");
            toggleText.textContent = "Login";
        } else {
            formTitle.textContent = "Login";
            signupFields.classList.add("hidden");
            confirmPassword.classList.add("hidden");
            toggleText.textContent = "Sign Up";
        }
    };

    window.submitForm = function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("message");

        if (!email || !password) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        if (formTitle.textContent === "Sign Up") {
            if (!confirmPassword) {
                message.textContent = "Please confirm your password.";
                message.style.color = "red";
                return;
            }

            if (password.length < 6) {
                message.textContent = "Password must be at least 6 characters.";
                message.style.color = "red";
                return;
            }

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                message.style.color = "red";
                return;
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    message.textContent = "Sign-up successful!";
                    message.style.color = "green";
                    switchToMedicationScreen();
                })
                .catch((error) => {
                    message.textContent = error.message;
                    message.style.color = "red";
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    message.textContent = "Login successful!";
                    message.style.color = "green";
                    switchToMedicationScreen();
                })
                .catch((error) => {
                    message.textContent = error.message;
                    message.style.color = "red";
                });
        }
    };

    function switchToMedicationScreen() {
        setTimeout(() => {
            authContainer.classList.add("hidden");
            medicationContainer.classList.remove("hidden");
        }, 1000);
    }

    window.saveMedication = function () {
        const medType = document.getElementById("medType").value;
        const medTime = document.getElementById("medTime").value;

        if (!medType || !medTime) {
            alert("Please select a medication and time.");
            return;
        }

        addMedication(medType, medTime);
    };
});
