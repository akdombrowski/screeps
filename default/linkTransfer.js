function linkTransferToAnotherLink(linkFrom, linkTo, energy) {
  let retval = -16;

  if (linkTo.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    return ERR_FULL;
  }

  if (
    !linkFrom.store[RESOURCE_ENERGY] ||
    linkFrom.store.getUsedCapacity(RESOURCE_ENERGY)
  ) {
    return ERR_NOT_ENOUGH_ENERGY;
  }

  console.log("link transfer:");
  if (energy && energy > 0) {
    retval = linkFrom.transferEnergy(linkTo, energy);
  } else {
    retval = linkFrom.transferEnergy(linkTo);
  }
  console.log(retval);

  return retval;
}

module.exports = linkTransferToAnotherLink;
