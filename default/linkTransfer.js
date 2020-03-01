function linkTransferToAnotherLink(linkFrom, linkTo, energy) {
  let retval = -16;
  let freeCap = linkTo.store.getFreeCapacity(RESOURCE_ENERGY);
  let usedCap = linkFrom.store.getUsedCapacity(RESOURCE_ENERGY);
  let store = linkFrom.store[RESOURCE_ENERGY];

  if (freeCap <= 0) {
    return ERR_FULL;
  }

  if (!store || usedCap <= 0) {
    return ERR_NOT_ENOUGH_ENERGY;
  }

  if (energy && energy > 0) {
    retval = linkFrom.transferEnergy(linkTo, energy);
  } else {
    retval = linkFrom.transferEnergy(linkTo);
  }

  return retval;
}

module.exports = linkTransferToAnotherLink;
