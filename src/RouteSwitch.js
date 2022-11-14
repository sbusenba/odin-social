import { BrowserRouter,Routes,Route} from "react-router-dom";
import App from "./App";
import Header from "./Header";


const RouteSwitch = () =>{
    return(
        <BrowserRouter>
            <Routes>
                
                    <Route path = "/" element = {<Header/>}>
                        <Route path="app" element = {<App/>}/>
                    </Route>        
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;