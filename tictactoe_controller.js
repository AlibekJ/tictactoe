"use strict";

const tictac = {};

tictac.rooms = {};



module.exports.start = async (ctx) => {
  console.log("Start".green);

  let room = {};
  room.roomId = Math.random().toString(36).substring(2, 10);
  room.token_0 = Math.random().toString(36).substring(2, 10);
  room.state = ["", "", "", "", "", "", "", "", ""];
  room.isStarted = false;
  room.isEnded = false;
  room.winner = null;
  room.nextPlayer = 0;

  tictac.rooms[room.roomId] = room;

  ctx.body = {
    success: true,
    dts: (new Date()),
    room: room
  }
};




module.exports.join = async (ctx, roomId) => {
  console.log("Will try to join".green, roomId);

  let room = tictac.rooms[roomId];

  if (!room) return ctx.throw(404);
  if (room.isEnded || room.isStarted || room.token_1) return ctx.throw(406);

  room.token_1 = Math.random().toString(36).substring(2, 10);
  room.isStarted = true;


  ctx.body = {
    success: true,
    dts: (new Date()),
    room: {
      token_1: room.token_1,
      state: room.state
    }
  };
};






module.exports.state = async (ctx) => {
  console.log("State".green, ctx.room.roomId);



  ctx.body = {
    success: true,
    dts: (new Date()),
    room: {
      state: ctx.room.state,
      isEnded: ctx.room.isEnded,
      isStarted: ctx.room.isStarted,
      winner: ctx.room.winner,
      nextPlayer: ctx.room.nextPlayer
    }
  };
};








module.exports.checkToken = async (ctx) => {
  console.log("Auth".green);

  if (!ctx || !ctx.request || !ctx.request.headers || !ctx.request.headers.token || !ctx.request.headers.roomid) {
    ctx.throw(401, "No token or no room id");
    return;
  };



  let room = tictac.rooms[ctx.request.headers.roomid];
  if (!room) return ctx.throw(401);

  ctx.room = room;

  if (ctx.request.headers.token === room.token_0) {
    ctx.player = 0;
  } else if (ctx.request.headers.token === room.token_1) {
    ctx.player = 1;
  } else {
    return ctx.throw(401, "Wrong token");
  };

};





module.exports.move = async (ctx, x, y) => {
  console.log("Move".green, ctx.room.roomId, x, y);

  x = parseInt(x);
  y = parseInt(y);

  if (x < 0 || y < 0) ctx.throw(404, "Wrong X or Y");
  if (x > 2 || y > 2) ctx.throw(404, "Wrong X or Y");

  if (ctx.room.state[x * 3 + y] !== "") ctx.throw(404, `Cell taken`);
  if (ctx.room.nextPlayer !== ctx.player) ctx.throw(404, `Not your turn`);

  if (ctx.room.isEnded) ctx.throw(404, `Game ended`);
  if (!ctx.room.isStarted) ctx.throw(404, `Game has not yet started`);

  ctx.room.state[x * 3 + y] = ctx.player;
  ctx.room.nextPlayer = (ctx.player === 0 ? 1 : 0);




  //check if game is over
  if (ctx.room.state[0 * 3 + 0] !== "" && ctx.room.state[0 * 3 + 0] === ctx.room.state[0 * 3 + 1] && ctx.room.state[0 * 3 + 1] === ctx.room.state[0 * 3 + 2]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };
  if (ctx.room.state[1 * 3 + 0] !== "" && ctx.room.state[1 * 3 + 0] === ctx.room.state[1 * 3 + 1] && ctx.room.state[1 * 3 + 1] === ctx.room.state[1 * 3 + 2]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };
  if (ctx.room.state[2 * 3 + 0] !== "" && ctx.room.state[2 * 3 + 0] === ctx.room.state[2 * 3 + 1] && ctx.room.state[2 * 3 + 1] === ctx.room.state[2 * 3 + 2]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };

  if (ctx.room.state[0 * 3 + 0] !== "" && ctx.room.state[0 * 3 + 0] === ctx.room.state[1 * 3 + 0] && ctx.room.state[1 * 3 + 0] === ctx.room.state[2 * 3 + 0]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };
  if (ctx.room.state[0 * 3 + 1] !== "" && ctx.room.state[0 * 3 + 1] === ctx.room.state[1 * 3 + 1] && ctx.room.state[1 * 3 + 1] === ctx.room.state[2 * 3 + 1]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };
  if (ctx.room.state[0 * 3 + 2] !== "" && ctx.room.state[0 * 3 + 2] === ctx.room.state[1 * 3 + 2] && ctx.room.state[1 * 3 + 2] === ctx.room.state[2 * 3 + 2]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };

  if (ctx.room.state[0 * 3 + 0] !== "" && ctx.room.state[0 * 3 + 0] === ctx.room.state[1 * 3 + 1] && ctx.room.state[1 * 3 + 1] === ctx.room.state[2 * 3 + 2]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };
  if (ctx.room.state[0 * 3 + 2] !== "" && ctx.room.state[0 * 3 + 2] === ctx.room.state[1 * 3 + 1] && ctx.room.state[1 * 3 + 1] === ctx.room.state[2 * 3 + 0]) { ctx.room.isEnded = true; ctx.room.winner = ctx.player };








  ctx.body = {
    success: true,
    dts: (new Date()),
    room: {
      state: ctx.room.state,
      isEnded: ctx.room.isEnded,
      isStarted: ctx.room.isStarted,
      winner: ctx.room.winner,
      nextPlayer: ctx.room.nextPlayer
    }
  };
};
