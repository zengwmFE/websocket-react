import React from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import App from "../App";
import chatRoom from "../chatRoom";
const myRouter = () => {
  return (
    <HashRouter>
      <Route component={App} path="/App"></Route>
      <Route component={chatRoom} path="/chatRoom"></Route>
      <Redirect path="/" to="/App" exact />
    </HashRouter>
  );
};
// 懒加载路由

export default myRouter;
