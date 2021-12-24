const smartMove = require("./move.smartMove");
function chainMove(pullerName, creepNames, destPos, range) {
  /** creep chain moving **/
  let puller = Game.creeps[pullerName];
  let retVal = -16;

  // console.log("creepNames:\n" + creepNames);
  if (!puller){
    return -16;
  } else if (puller.fatigue > 0) {
    puller.say("f." + puller.fatigue);
    return ERR_TIRED;
  }

  creepNames.forEach(pulledCreep => {
    let creep = Game.creeps[pulledCreep];
    let waterproof = 0;
    // console.log("n:" + element + "\ncreep:" + JSON.stringify(creep));
    if (creep) {
      puller.pull(creep);
      creep.move(puller);
    }
  });

  return smartMove(puller, destPos, range, false);
}

module.exports = chainMove;
