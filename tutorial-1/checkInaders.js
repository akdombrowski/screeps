function checkInvaders(room, ytop, xleft, ybottom, xright) {
  if (!xleft || !xright || !ybottom || !ytop) {
    xleft = 0;
    xright = 2;
    ybottom = 20;
    ytop = 2;
  }

  let retval;
  let invaderId;
  let invader;
  let creeps = [];

  // asArray
  // optional	boolean
  // Set to true if you want to get the result as a plain array.
  //   [
  //     {x: 5, y: 10, structure: {...}},
  //     {x: 6, y: 11, structure: {...}},
  //     {x: 6, y: 11, structure: {...}}
  // ]
//   console.log(JSON.stringify(room));
  creeps = room.lookForAtArea(LOOK_SOURCES, ytop, xleft, ybottom, xright, true).concat();
  console.log(ytop + "," + xleft +","+ybottom+","+xright);
//   console.log(JSON.stringify(creeps));
  console.log(creeps instanceof Array);
  console.log(Array.isArray(creeps));
  invader = creeps.find((creep) => {
      return !creep.my;
  });
  console.log("invader: " + JSON.stringify(invader));
//   creeps.values();
//   console.log(creeps.every());
//   console.log(creeps.values());
//   for (let c of creeps) {
//     console.log("c" + JSON.stringify(c));
//     // if (!c.my) {
//     //   invader = c;
//     //   incaderId = c;
//     // }
//   }

  return invaderId;
}

module.exports = checkInvaders;
