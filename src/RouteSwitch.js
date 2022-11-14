import { BrowserRouter,Routes,Route } from "react-router-dom";
import App from "./App";


const RouteSwitch = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path= "/" element = {<Interface/>}>
                    <Route path = "/" element = {<App/>}/>
                    {/* <Route path="/app" element = {<App/>}/>
                    <Route path="/profile" element = {<Profile/>}/> */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default RouteSwitch;