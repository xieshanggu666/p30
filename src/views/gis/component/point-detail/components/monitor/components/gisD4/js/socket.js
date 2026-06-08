var webSocket = null;
var globalCallback = null;//定义外部接收数据的回调函数

//初始化websocket
function initWebSocket(url) {
    webSocket = new WebSocket(url);//创建socket对象
    console.log(webSocket)
  //打开
  webSocket.onopen = function() {
    // 建立连接的时候先发送一条数据，用于确定当前连接的状态
    webSocketOpen();
    heartCheck.reset().start() //暂时不需要做心跳检测
  };
  //收信
  webSocket.onmessage = function(e) {
    webSocketOnMessage(e);
     //heartCheck.reset().start() //暂时不需要做心跳检测
  };
  //关闭
  webSocket.onclose = function() {
    webSocketClose();
  };
  //连接发生错误的回调方法
  webSocket.onerror = function() {
    console.log("WebSocket连接发生错误");
  };
}

//连接socket建立时触发
function webSocketOpen() {
    const data = {
      type: "CONNECT",
    //   token: sessionStorage.getItem("token") || ""
    };
    sendSock(data, function() {});
  console.log("WebSocket连接成功");
}

//客户端接收服务端数据时触发,e为接受的数据对象
function webSocketOnMessage(e) {
  const data = JSON.parse(e.data);//根据自己的需要对接收到的数据进行格式化
  globalCallback(data);//将data传给在外定义的接收数据的函数

}

//发送数据
function webSocketSend(data) {
  // webSocket.send(JSON.stringify(data))
  webSocket.send(data);//在这里根据自己的需要转换数据格式
}

//关闭socket
function webSocketClose() {
    webSocket.close();
    console.log("对话连接已关闭");
}


//在其他需要socket地方调用的函数，用来发送数据及接受数据
function sendSock(agentData, callback) {
  globalCallback = callback;//此callback为在其他地方调用时定义的接收socket数据的函数，此关重要。
  //下面的判断主要是考虑到socket连接可能中断或者其他的因素，可以重新发送此条消息。
  switch (webSocket.readyState) {
    //CONNECTING：值为0，表示正在连接。
    case webSocket.CONNECTING:
      setTimeout(function() {
        webSocketSend(agentData, callback);
      }, 1000);
      break;
    //OPEN：值为1，表示连接成功，可以通信了。
    case webSocket.OPEN:
      webSocketSend(agentData);
      break;
    //CLOSING：值为2，表示连接正在关闭。
    case webSocket.CLOSING:
      setTimeout(function() {
        webSocketSend(agentData, callback);
      }, 1000);
      break;
    //CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
    case webSocket.CLOSED:
      // do something
      break;
    default:
      // this never happens
      break;
  }
}

//心跳检测
let heartCheck = {
    timeout: 60*1000,
    timeoutObj: null,
    serverTimeoutObj: null,
    reset(){
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      return this;
    },
    start(){
      let that = this;
      this.timeoutObj = setTimeout(()=>{
      //发送数据，如果onmessage能接收到数据，表示连接正常,然后在onmessage里面执行reset方法清除定时器
      webSocket.send('heart check')
      this.serverTimeoutObj = setTimeout(()=>{
        webSocket.close()
      },that.timeout)
      },this.timeout)
    }
  }

//将初始化socket函数、发送（接收）数据的函数、关闭连接的函数export出去
export default {
  initWebSocket,
  webSocketClose,
  sendSock
};