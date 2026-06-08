let socket = null;
let lockReconnet = false; //避免重复连接
const wsUrl = 'ws://10.10.10.93:8888';
let isReconnet = false;
let globalCallback = null,sendData = null; //把要发送给socket的数据和处理socket返回数据的回调保存起来
let createSocket = url=>{ //创建socket
  try{
    if('WebSocket' in window){
      socket = new WebSocket(url)
    }
    else if('MozWebSocket' in window){
      socket = new MozWebSocket(url)
    }
    //Vue.prototype.socket = socket //需要主动关闭的话就可以直接调用this.socket.close()进行关闭，不需要的话这个可以去掉
    initSocket()
  }catch(e){
    reconnet(url)
  }
}
//发送数据,接收数据
let sendMsg = (data,callback)=>{
  if(socket.readyState===1){
    globalCallback = callback;
    sendData = data;
    data = JSON.stringify(data);
    socket.send(data);
  }else{
    setTimeout(()=>{
    console.log(socket,'等待socket链接成功')
    sendMsg(data,callback)
  },1500)
    return false
  }
  socket.onmessage = ev=>{
    callback && callback(ev)
  }
}
//初始化websocket
let initSocket = ()=>{
  socket.onopen = ()=>{
  console.log('socket连接成功')
//heartCheck.reset().start() //暂时不需要做心跳检测
  if(isReconnet){//执行全局回调函数
  //console.log('websocket重新连接了')
  sendMsg(sendData,globalCallback)
  isReconnet = false
  }
}
  socket.onmessage = (ev)=>{
  console.log(ev,'连接正常')
  //heartCheck.reset().start() //暂时不需要做心跳检测
  }

  socket.onerror = ()=>{
  console.log('websocket服务出错了---onerror');
  reconnet(wsUrl)
  }
  socket.onclose = ()=>{
  console.log('websocket服务关闭了+++onclose');
  reconnet(wsUrl)
  }
}

//重新连接websock函数
let reconnet = url=>{
  if(lockReconnet)
    return false
  isReconnet = true;
  lockReconnet = true
  setTimeout(()=>{
    createSocket(url)
    lockReconnet = false
  },100000)
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
    socket.send('heart check')
    this.serverTimeoutObj = setTimeout(()=>{
      socket.close()
    },that.timeout)
    },this.timeout)
  }
}
let webSocketClose = ()=>{
  socket.close();
  console.log("对话连接已关闭");
}

createSocket(wsUrl)
export default {sendMsg,webSocketClose}
