const express = require("express");
const app = express();
const webSocket = require("ws");
const SocketServer = require("ws").Server;
const server = app.listen(8081, () => console.log(`Listening on ${8081}`));
const wss = new SocketServer({ server });
// 定义用户的数组
const user = [];
const chatMessage = [];
let userName = "";
wss.on("connection", function (connection) {
  connection.on("message", function (data) {
    try {
      const wsData = JSON.parse(data);
      console.log(wsData);
      // 根据data返回的内容来判断当前人物执行的操作
      switch (wsData.type) {
        case "login":
          // 循环当前用户数组，判断是否有这个用户
          let isReply = user.filter((item) => {
            if (item === wsData.userName) {
              return item;
            }
          });
          if (!isReply || isReply.length) {
            connection.send(
              JSON.stringify({
                type: "LOGIN_FAIL",
                message: "用户名发生重复，请重新尝试！",
              })
            );
          } else {
            user.push(wsData.userName);
            userName = wsData.userName;
            connection.send(
              JSON.stringify({
                type: "LOGIN_SUCCESS",
                message: "登陆成功",
              })
            );
          }
          break;
        case "CONNECTION":
          connection.send(
            JSON.stringify({
              type: "CONNECTION_SUCCESS",
              message: "连接成功",
            })
          );
          break;
        case "LOGINOUT":
          // user.splice(user.find(wsData.userName));
          connection.send(
            JSON.stringify({
              type: "LOGINOUT",
              message: `${userName}退出群聊`,
            })
          );
          break;
        case "JOININ":
          wss.clients.forEach((client) => {
            if (client.readyState === webSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "JOININ",
                  message: `${userName}加入群聊`,
                })
              );
            }
          });
          // 每个用户登陆的时候，向他推送当前的聊天记录
          connection.send(
            JSON.stringify({ type: "CHAT", message: chatMessage })
          );
          break;
        case "CHAT":
          chatMessage.push({
            userName: wsData.userName,
            msg: wsData.chatMsg,
          });
          wss.clients.forEach((client) => {
            if (client.readyState === webSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "CHAT",
                  message: chatMessage,
                })
              );
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  });
});
