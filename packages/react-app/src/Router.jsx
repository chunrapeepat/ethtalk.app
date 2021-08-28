import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage";
import EmbedPage from "./EmbedPage";

import "antd/dist/antd.css";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/embed">
            <EmbedPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Router;
