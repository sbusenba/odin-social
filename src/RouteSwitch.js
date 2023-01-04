import { BrowserRouter,Routes,Route} from "react-router-dom";
import App from "./App";
import Post from "./components/Post"
import Feed from "./components/Feed"

const RouteSwitch = () =>{
    return(
        <BrowserRouter>
            <Routes>
                    <Route path = "/" element = {<App/>}>
                        <Route path="post" element = {<Post/>}/>
                        <Route path="/" element = {<Feed/>}/>
                    </Route>        
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;