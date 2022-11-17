import { Outlet,Link } from "react-router-dom";
import{useState}from 'react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import './styles/header.css'
import PleaseSignIn from "./components/PleaseSignIn";

function Header() {
  
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPbuSvifzyolZ6rO83Bzv1HEyRAaMhsyM",
  authDomain: "odin-social-bb257.firebaseapp.com",
  projectId: "odin-social-bb257",
  storageBucket: "odin-social-bb257.appspot.com",
  messagingSenderId: "512601198050",
  appId: "1:512601198050:web:6cd6ae9320f6d4778bbdbb"
};
const [signedIn, setSignedIn] = useState(false);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

async function signIn() {
  //Sign in Firebase with credential from the Google user.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(auth,provider)
  setSignedIn(true);
}

function signOutUser() {
  // Sign out of Firebase.
  signOut(auth);
  setSignedIn(false);
}


function initFirebaseAuth() {
  // Subscribe to the user's signed-in status
  onAuthStateChanged(auth, authStateObserver);
}
// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  // TODO 4: Return the user's profile pic URL.
  return auth.currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  // TODO 5: Return the user's display name.
  return auth.currentUser.displayName;
}


// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    document.querySelector('#user-pic').style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
      document.querySelector('#user-name').textContent = userName;

    // Show user's profile and sign-out button.
    document.querySelector('#user-pic').removeAttribute('hidden');
    document.querySelector('#user-name').removeAttribute('hidden');
    document.querySelector('#sign-out').removeAttribute('hidden');

    // Hide sign-in button.
    document.querySelector('#sign-in').setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    document.querySelector('#user-pic').setAttribute('hidden', 'true');
    document.querySelector('#user-name').setAttribute('hidden', 'true');
    document.querySelector('#sign-out').setAttribute('hidden', 'true');

    // Show sign-in button.
    document.querySelector('#sign-in').removeAttribute('hidden');
  }
}
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}
const linkStyle = {
  margin: "0rem",
  textDecoration: "none",
  color: "rgb(255,255,255)",
};

initFirebaseAuth();
    return (
      <div className="app">
        <header className="App-header">
            <Link to="/" style={linkStyle}><div id ='app-logo'>Something Social</div></Link>
            <Link to="/post" style={linkStyle}><div id ='new-post'>+</div></Link>
            <div id ='user-container'>
                <div hidden id="user-pic"></div>
                <div>
                <div hidden id="user-name"></div>
                <button hidden id="sign-out" onClick = {signOutUser}>
                    Sign-out
                </button>
                </div>
            <button id="sign-in" onClick={signIn}>
                Sign-in with Google
            </button>
            </div>             
        </header>
        {signedIn? <Outlet/>:<PleaseSignIn/>}
      </div>
    );
  }
  
  export default Header;