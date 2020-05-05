import React, { useState, useEffect } from "react";
import "./index.css";
import avatar from "../img/1.jpg";
import singImg from "../img/2.jpg";
import { Input, message } from "antd";
import store from "../store/createStore";
function ChatRoom() {
  const [chatMsg, setChatMsg] = useState("");
  const [tip, setTip] = useState("");
  const [ws, setws] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [userName, setUserName] = useState("");
  store.subscribe(onChange);
  useEffect(() => {
    initWs();
  }, [ws]);
  function initWs() {
    console.log(ws, "ws");
    if (ws) {
      console.log(ws);
      ws.onmessage = function (msg) {
        console.log(ws);
        const data = JSON.parse(msg.data);
        if (data.type === "CHAT") {
          setChatList(data.message);
          return;
        }
        message.success(data.message);
      };
      ws.onerror = function (data) {
        console.log("发生了错误");
      };
    }
  }
  function onsubmit(ev) {
    // 提交
    ws.send(
      JSON.stringify({
        type: "CHAT",
        userName: userName,
        chatMsg: chatMsg,
      })
    );
    setChatMsg("");
  }
  function onChange() {
    setws(store.getState().ws);
    setUserName(store.getState().userName);
  }
  function handleChatList() {
    return chatList.map((item, index) => (
      <div key={index} class={userName === item.userName ? "parentLabel" : ""}>
        <div>
          <p className="chat__userName">{item.userName}</p>
          <p
            className={`chat__message ${
              userName === item.userName ? "rightLabel" : "leftLabel"
            }`}
          >
            {item.msg}
          </p>
        </div>
      </div>
    ));
  }
  function handleClassName(labelUserName) {
    let defaultClass = "";
    return (defaultClass =
      userName === labelUserName ? "rightLabel" : "leftLabel");
  }
  function parentClassName(labelUserName) {
    let defaultClass = "";
    if (userName === labelUserName) {
      defaultClass = "rightLabel";
    } else {
      defaultClass = "leftLabel";
    }
    return defaultClass;
  }
  return (
    <div className="chatroom__container">
      {/* 用户信息条 */}
      <div className="chatroom__userMsg">
        <img src={avatar} alt="" />
      </div>
      {/* 用户群聊条 */}
      <div className="chatroom__userchat">
        <div className="chatroom__single">
          <img src={singImg} alt="" />
          <span>小拾</span>
        </div>
      </div>
      {/* 用户 */}
      <div className="list__content">
        <div className="list__name">
          <span>小拾</span>
        </div>
        <div className="list__item">
          <div className="list__tip">{tip}</div>
          <div>{handleChatList()}</div>
        </div>
        <div className="list__input">
          <Input
            value={chatMsg}
            className="list__input--area"
            onChange={(ev) => {
              setChatMsg(ev.target.value);
            }}
            onPressEnter={onsubmit.bind(this)}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
