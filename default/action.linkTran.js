const smartMove = require("./action.smartMove");

function linkTran(linkEntrance, linkExit, flag, dest) {
  let retval = -16;
  if (Memory.linkGets.length > 0) {
    if (linkEntrance.cooldown <= 0) {
      retval = linkEntrance.transferEnergy(linkExit);
      if (retval != OK) console.log("linkTransferFailed:" + retval);
    }
  }
}

module.exports = linkTran;
