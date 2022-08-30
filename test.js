const request = require("request-promise-native");



(async () => {



  let data = await request({
    method: "GET",
    uri: "http://127.0.0.1:6000/ping",
    json: true,
    timeout: 300000,
  });

  console.log(data);

  data = await request({
    method: "POST",
    uri: "http://127.0.0.1:6000/start",
    json: true,
    timeout: 300000,
  });
  console.log(data);
  console.log("Started a room", data.room.roomId);

  let roomId = data.room.roomId
  let player0Token = data.room.token_0;

  data = await request({
    method: "POST",
    uri: `http://127.0.0.1:6000/join/${roomId}`,
    json: true,
    timeout: 300000,
  });
  console.log(data);
  let player1Token = data.room.token_1;
  console.log("Joind the room as player 1");


  let headers = {
    roomId: roomId,
    token: player0Token
  };
  data = await request({
    method: "GET",
    uri: `http://127.0.0.1:6000/state`,
    headers: headers,
    json: true,
    timeout: 300000,
  });
  console.log(data);
  console.log("Got state as player 0");


  headers = {
    roomId: roomId,
    token: player1Token
  };
  data = await request({
    method: "GET",
    uri: `http://127.0.0.1:6000/state`,
    headers: headers,
    json: true,
    timeout: 300000,
  });
  console.log(data);
  console.log("Got state as player 1");

})()