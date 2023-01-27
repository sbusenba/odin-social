import { Outlet,Link, useNavigate} from "react-router-dom";
import{useEffect, useState}from 'react';
import './styles/App.css'
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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { getFirestore,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp, doc, setDoc, deleteDoc,
   getDoc, query, limit,onSnapshot,
   } from "firebase/firestore";
import Feed from "./components/Feed";

function App() {


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPbuSvifzyolZ6rO83Bzv1HEyRAaMhsyM",
  authDomain: "odin-social-bb257.firebaseapp.com",
  projectId: "odin-social-bb257",
  storageBucket: "gs://odin-social-bb257.appspot.com",
  messagingSenderId: "512601198050",
  appId: "1:512601198050:web:6cd6ae9320f6d4778bbdbb"
};
const [signedIn, setSignedIn] = useState(false);
const [posts,setPosts] = useState([]);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//initialize firestore DB and get reference
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const navigate = useNavigate()
const [userPic,setUserPic] =useState('')
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
  return auth.currentUser.photoURL ;
}

// Returns the signed-in user's display name.
function getUserName() {
  // TODO 5: Return the user's display name.
  return auth.currentUser.displayName;
}


// Triggers when the auth state change for instance when the user signs-in or signs-out.
async function authStateObserver(user) {
  if (user) {
    // User is signed in!
    console.log('user:',auth.currentUser.uid)

    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    let userInfo = await getDoc(doc(db,'users',`${auth.currentUser.uid}`))
    if (userInfo.exists()) {
      let user = userInfo.data();
      document.querySelector('#user-name').textContent = user.userName
      setUserPic (user.profilePicUrl)
    } else {
      // user Doesn't exist, attempt to add to DB
      const userInfo = await setDoc(doc(db, 'users',`${auth.currentUser.uid}`), {
        userName: userName,
        profilePicUrl:  addSizeToGoogleProfilePic(profilePicUrl),
        
      });
      document.querySelector('#user-pic').style.src =
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
      document.querySelector('#user-name').textContent = userName;

    }
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

async function postFn(){
  try{
    //saves posts
    let file = document.querySelector("#img-input").files[0]
    let msgText = document.querySelector("#text-input").value
    console.log(`${file} and ${msgText}`)
    const postRef = await addDoc(collection(db, 'posts'), {
      userID: auth.currentUser.uid,
      name: getUserName(),
      imageUrl: null,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp(),
      message: msgText,
    });
    // 2 - Upload the image to Cloud Storage.
    console.log('uploading to cloud storage')
    const filePath = `${getAuth().currentUser.uid}/${postRef.id}/${file.name}`;
    const newImageRef = ref(getStorage(app), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    console.log('image uploaded')
    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);
    await updateDoc(postRef,{
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath
    });
    console.log('image url updated')
  } catch (error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  }
  updatePosts()
}


const linkStyle = {
  margin: "0rem",
  textDecoration: "none",
  color: "rgb(255,255,255)",
};

async function updatePosts (){
    let recentLogsQuery = await query(collection(db,'posts'),limit(100));
    setPosts([])
    console.log('update posts')
    onSnapshot(recentLogsQuery, function(snapshot) {
      console.log(snapshot.docChanges())
      snapshot.docChanges().forEach(function(change) {
        console.log(change.type)
        if (change.type === 'removed') {
          deletePost(change.doc.id);
        } else if (change.type ==='added'){ 
          let post = change.doc.data();
          addPost(change.doc.id, post);
        }
      });
    });
  }



async function addPost(id,newPost){
  newPost.id = id
  let userInfo = await getDoc(doc(db,'users',`${newPost.userID}`))
  if (userInfo.exists()) {
    let user = userInfo.data();
    newPost.name = user.userName
    newPost.profilePicUrl = user.profilePicUrl
  } else {
    // user Doesn't exist, attempt to add to DB
    const userInfo = await setDoc(doc(db, 'users',`${newPost.userID}`), {
      userName: newPost.name,
      profilePicUrl: newPost.profilePicUrl,
    });

    console.log("No such document!");
  }

  let user = await userInfo.data();
  newPost.name = user.userName 
  newPost.profilePicUrl = user.profilePicUrl
  console.log('user',user)
  console.log('adding',newPost) 
  setPosts(oldArray=>[...oldArray,newPost])
  navigate('/')
}

function deletePost(id){
  console.log(`deleting`,id)
  setPosts((oldArray)=>{
    let newArray = oldArray.filter(post=>post.id!==id);
    return newArray})
}

async function deleteFn(id){
  navigate('/')
  const myDoc = await getDoc(doc(db, "posts", id));
  const filePath = `${myDoc.data().storageUri}`;
  const imageRef = ref(getStorage(app), filePath);
  deleteObject(imageRef).then(() => {
    // File deleted successfully
    console.log('Image Deleted')
  }).catch((error) => {
    // Uh-oh, an error occurred!
    console.log(error)
  });
  await deleteDoc(doc(db, "posts", id))
  deletePost(id)
  
}

async function updateUserPic(){
  
}

initFirebaseAuth();
useEffect(()=>{updatePosts()},[])

    return (
      <div className="app">
        <header className="App-header">
            <Link to="/" style={linkStyle}><div id ='app-logo'>Something Social</div></Link>
            <Link to="/createpost" style={linkStyle}><div id ='new-post'>+</div></Link>
            <div id ='user-container'>
                <Link to="/editprofile" style ={linkStyle}>
                    <img hidden id="user-pic" 
                    referrerPolicy="no-referrer"
                    src ={userPic}></img>
                </Link>
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
        {signedIn? <Outlet context={[postFn,posts,auth.currentUser.uid,deleteFn]}/>:<PleaseSignIn/>}
      </div>
    );
}
export default App;