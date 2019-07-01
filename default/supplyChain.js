/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('supplyChain');
 * mod.thing == 'a thing'; // true
 */

function supplyChain(creeps, harvester, source, energyStoredPlace) {
  let hv = Game.creeps[harvester];
  let pickUpper = Game.creeps[creeps[0]];
  let storer = Game.creeps[creeps[creeps.length - 1]];
  let storeVal = -16;
  let transferVal = -16;
  let pickupVal = -16;
  let harvestVal = -16;

  let energy;

  if (hv) {
    harvestVal = hv.harvest(source);
    hv.say("h" + harvestVal);
    energy = pickUpper.room.lookForAt(LOOK_ENERGY, hv.pos)[0];
  } else {
    console.log("Need harvester for supply chain. harvester:" + harvester);
  }

  if (!energy) {
    energy = pickUpper.pos.findInRange(FIND_DROPPED_RESOURCES, 1).pop();
  }
  pickupVal = pickUpper.pickup(energy);
  if (pickupVal === OK) {
    pickUpper.say("p");
  }

  _.each(creeps, (name, i, c) => {
    let creep = Game.creeps[name];
    let creepNext = Game.creeps[creeps[i + 1]];
    console.log("creep:" + c + " i:" + i + " next:" + creepNext);
    if (creepNext) {
      if (creep) {
        transferVal = creep.transfer(creepNext, RESOURCE_ENERGY);
        if (transferVal === OK) {
          creep.say("t");
          creepNext.say("re");
        }
      }
    }
  });

  storeVal = storer.transfer(energyStoredPlace, RESOURCE_ENERGY);
  console.log("transferval: " + transferVal);
  if (storeVal === OK) {
    storer.say("s");
  }
  return transferVal;
}

module.exports = supplyChain;
