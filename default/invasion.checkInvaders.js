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
  creeps = room.lookForAt(LOOK_CREEPS, ytop, xleft, ybottom, xright, true);
  console.log(JSON.stringify(creeps));
  for (c in creeps) {
    console.log(JSON.stringify(c));
    // if (!c.my) {
    //   invader = c;
    //   incaderId = c;
    // }
  }

  return invaderId;
}

module.exports = checkInvaders;
