import { BrowserRouter,Routes,Route} from "react-router-dom";
import App from "./App";
import Post from "./components/Post"
import Feed from "./components/Feed"
import PostDetail from "./components/PostDetail";
import UserDetail from "./components/UserDetail";
import EditProfile from "./components/EditProfile";

const RouteSwitch = () =>{
    return(
        <BrowserRouter>
            <Routes>
                    <Route path = "/" element = {<App/>}>
                        <Route path="createpost" element = {<Post/>}/>
                        <Route path="" element = {<Feed/>}/>
                        <Route path="/post/:postID"element = {<PostDetail/>}/> 
                        <Route path='/user/:userID' element = {<UserDetail/>}/>
                        <Route path='/editprofile' element = {<EditProfile/>}/>
                    </Route>        
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;