import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Steps, Input, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import store from "./store/createStore";
const { Step } = Steps;
let constUserName = "";
function App(prop) {
  const [current, setCurrent] = useState(0);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [webso, setWebSo] = useState(null);
  let ws = null;
  store.subscribe(setFn);
  useEffect(() => {
    ws = new WebSocket("ws:localhost:8081");
    initWs();
    console.log("执行了几次");
  }, [ws]);
  function initWs() {
    ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      ws.send(
        JSON.stringify({
          type: "CONNECTION",
          data: "link",
        })
      );
      setWebSo(ws);
      ws.onerror = function () {
        console.log("baocuole");
      };
      // 监听服务端消息
      ws.onmessage = function (msg) {
        const data = JSON.parse(msg.data);
        showMessage(data.type, data.message);
      };
    };
  }
  function setFn() {}
  function showMessage(type, msg) {
    if (type === "LOGIN_SUCCESS") {
      prop.history.push("/chatRoom");
      store.dispatch({
        type: "COMBINE",
        ws: ws,
        userName: constUserName,
      });
      ws.send(
        JSON.stringify({
          type: "JOININ",
          userName: userName,
        })
      );
    }
    if (type !== "LOGIN_SUCCESS") {
      message[type.includes("FAIL") ? "error" : "success"](msg);
    }
  }
  function handleClick() {
    if (!userName) {
      return message.error("请输入用户名！");
    }
    constUserName = userName;
    webso.send(JSON.stringify({ type: "login", userName: userName }));
  }

  function handleDomShow() {
    let showDom = "";
    let imgArr = [];
    if (!current) {
      showDom = (
        <Input
          placeholder="请输入用户名"
          prefix={<UserOutlined />}
          onChange={(ev) => {
            setUserName(ev.target.value);
          }}
        />
      );
    } else if (current === 1) {
      showDom = imgArr.map((item) => <img src={item} alt="头像" />);
    } else {
      showDom = (
        <div>
          <p>{userName}</p>
          <img src={avatar} alt="" />
        </div>
      );
    }
    return showDom;
  }
  return (
    <div className="App">
      <div className="app__step">
        <Steps size="small" current={current}>
          <Step title="输入用户名" />
          <Step title="选择头像" />
          <Step title="确认信息" />
        </Steps>
      </div>
      <div className="app__input">
        <div>{handleDomShow()}</div>
        <Button className="app_btn" onClick={handleClick.bind(this)}>
          下一步
        </Button>
      </div>
    </div>
  );
}

export default App;
