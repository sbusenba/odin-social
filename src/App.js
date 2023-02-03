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
   where, exists,
   orderBy,
   getDocs,
   } from "firebase/firestore";


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
  let userInfo = await getDoc(doc(db,'users',`${auth.currentUser.uid}`))
  if (!userInfo.exists()) {
    // user Doesn't exist, attempt to add to DB
    const userInfo = await setDoc(doc(db, 'users',`${auth.currentUser.uid}`), {
      userName: getUserName(),
      profilePicUrl: getProfilePicUrl(),
      likes:[],
    });
  }
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
    // user is signed in
    setSignedIn(true)
    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();
  } else {
    // User is signed out!
    setSignedIn(false)
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
    console.error('There was an error uploading your post:', error);
  }
  updatePosts()
}


const linkStyle = {
  margin: "0rem",
  textDecoration: "none",
  color: "rgb(255,255,255)",
};

async function updatePosts (){
    if(signedIn){
      setPosts([])
      let recentLogsQuery = await query(collection(db,'posts'),limit(100),orderBy('timestamp','desc'));
      let docs = await getDocs(recentLogsQuery)
      let users = await getDocs(query(collection(db,'users'),limit(100)))
      docs.forEach((doc)=>{
        let post = doc.data();
        let postLikes = 0;
        users.forEach((user)=>{if ((user.data().likes!= undefined) &&( user.data().likes.includes(doc.id))){ 
          postLikes++;
          if (user.id=== auth.currentUser.uid){post.currentUserLiked = true}
        }})
        post.likes = postLikes;
        addPost(doc.id, post);
      })
    }
  }
async function sortFeedByDate(){
  let sortArray = posts
    setPosts([])
    await sortArray.sort((a,b)=> a.timestamp.seconds < b.timestamp.seconds? 1: -1)
    setPosts(sortArray)
}
async function sortFeedByDateRev(){
  let sortArray = posts
    setPosts([])
    await sortArray.sort((a,b)=> a.timestamp.seconds > b.timestamp.seconds? 1: -1)
    setPosts(sortArray)
}

async function sortFeedByLikes(){
  let sortArray = posts
    setPosts([])
    await sortArray.sort((a,b)=> a.likes < b.likes? 1: -1)
    setPosts(sortArray)
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
      likes:[],
    });

    console.log("No such document!");
  }

  let user = await userInfo.data();
  newPost.name = user.userName 
  newPost.profilePicUrl = user.profilePicUrl
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
  try{
  await deleteDoc(doc(db, "posts", id))
  deletePost(id)
  } catch (error){
    console.error('unable to delete:', error)
  }
}

async function updateProfilePic(){
  console.log('profile pic update attempted')
  let file = document.querySelector("#img-input").files[0]
  let userDocRef =doc(db, "users", auth.currentUser.uid)
  const filePath = `${getAuth().currentUser.uid}/profile/${file.name}`;
  const newImageRef = ref(getStorage(app), filePath);
  const fileSnapshot = await uploadBytesResumable(newImageRef, file);
  // 3 - Generate a public URL for the file.
  const publicImageUrl = await getDownloadURL(newImageRef);
  await updateDoc(userDocRef,{
    profilePicUrl: publicImageUrl,
    profilePicUri: fileSnapshot.metadata.fullPath
  });
}
async function likeFn(id){
  console.log('liking: ',id)
  let userDocRef =doc(db, "users", auth.currentUser.uid)
  let myUserDoc = await getDoc(userDocRef)
  let myLikes = myUserDoc.data().likes
  await myLikes.push(id)
  await updateDoc(userDocRef,{
    likes:myLikes
  });
  navigate('/')
  await updatePosts()
}
initFirebaseAuth();
useEffect(()=>{updatePosts()},[signedIn])

    return (
      <div className="app">
        <header className="App-header">
            <Link to="/" style={linkStyle}><div id ='app-logo'>Something Social</div></Link>
            <Link to="/createpost" style={linkStyle}><div id ='new-post'>+</div></Link>
            <div id ='user-container'>
                <Link to="/editprofile" style ={linkStyle}>
                    <img alt="your user pic"hidden id="user-pic" 
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
        {signedIn? <Outlet context={[postFn,
          posts,auth.currentUser.uid,deleteFn,
          updateProfilePic,likeFn,sortFeedByDate,
          sortFeedByDateRev,sortFeedByLikes]}/>:<PleaseSignIn/>}
      </div>
    );
}
export default App;