import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";

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
const auth = getAuth(app);

getRedirectResult(auth)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    window.user = result.user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error.code);
    console.log(error.message);
  })
;

onAuthStateChanged(auth, user => {
  window.user = user;
  if (window.user) {
    console.log(window.user);
    document.querySelector('body').style.background = 'blue';
    $('.avatar, .avatarLarge').attr('src', window.user.photoURL);
  } else {
    signInWithRedirect(auth, provider);
  }
});


window.signOut = () => signOut(auth);
window.getToken = async () => await window.user.getIdToken();