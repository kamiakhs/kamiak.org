import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithRedirect, onIdTokenChanged } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";

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
//   hd: 'mukilteo.wednet.edu',
});
const auth = getAuth(app);
window.auth = auth;


onAuthStateChanged(auth, user => {
  window.user = user;
  if (user) {
    // if (!user.email.endsWith('@mukilteo.wednet.edu')) window.signOut();
    document.querySelector('body').style.background = 'blue';
    console.log('Signed into Google')
    $('#myAvatar').addClass(user.uid);
    main();
    // $('.avatar, .avatarLarge').attr('src', window.user.photoURL);
  } else {
    signInWithRedirect(auth, provider);
  }
});


window.signOut = () => signOut(auth);
window.onIdTokenChanged = (_) => onIdTokenChanged(auth, _);