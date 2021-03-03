import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {MainPage} from "./Components/MainPage";
import './responsive.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={MainPage}/>
        <Redirect to={"/"}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
