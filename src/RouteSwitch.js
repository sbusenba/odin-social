import { BrowserRouter,Routes,Route} from "react-router-dom";
import App from "./App";
import Post from "./components/Post"
import Header from "./Header";


const RouteSwitch = () =>{
    return(
        <BrowserRouter>
            <Routes>
                    <Route path = "/" element = {<Header/>}>
                        <Route path="app" element = {<App/>}/>
                        <Route path="post" element = {<Post/>}/>
                        <Route path="/" element = {<div>show feed</div>}/>
                    </Route>        
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;