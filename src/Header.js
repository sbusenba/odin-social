import { Outlet } from "react-router-dom";
function Header() {
  
    return (
      <div className="app">
        <header className="App-header">
            <div id ='user-container'>
                <div hidden id="user-pic"></div>
                <div hidden id="user-name"></div>
                <button hidden id="sign-out" className="">
                    Sign-out
                </button>
            <button id="sign-in" className="">
                Sign-in with Google
            </button>
            </div>             
        </header>
        <Outlet/>
      </div>
    );
  }
  
  export default Header;