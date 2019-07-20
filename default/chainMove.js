const smartMove = require("./action.smartMove");
function chainMove(pullerName, creepNames, destPos, rngToDest) {
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

  creepNames.forEach(element => {
    let creep = Game.creeps[element];
    let waterproof = 0;
    // console.log("n:" + element + "\ncreep:" + JSON.stringify(creep));
    if (creep) {
      puller.pull(creep);
      creep.move(puller);
    }
  });
  return smartMove(puller, destPos, rngToDest);
}

module.exports = chainMove;
