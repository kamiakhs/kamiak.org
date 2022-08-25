import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmq6TPQkTz8-gILGlfztha41Uo8400brU",
  authDomain: "auth.kamiak.org",
  // authDomain: "kamiak-chat.firebaseapp.com",
  projectId: "kamiak-chat",
  storageBucket: "kamiak-chat.appspot.com",
  messagingSenderId: "606268222806",
  appId: "1:606268222806:web:6497ac82fb82434d397af7"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'login_hint': 'user@mukilteo.wednet.edu'
});

const auth = getAuth();
let user = null;

signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    user = result.user;
    // ...
    // console.log(user);
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.log(error.code);
    console.log(error.message);
  })
;

onAuthStateChanged(auth, user => {
  console.log(user);
});