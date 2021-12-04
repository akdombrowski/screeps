const checkForAttackers = require("./invasion.checkForAttackers");
const spawnHarvesterChain = require("./spawnHarvesterChain");
const roleTower = require("role.tower");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");
const smartMove = require("./action.smartMove");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const spawnCreepTypeseRm = require("./spawn.eRmspawnCreepTypes");
const spawnCreepTypeseeRm = require("./spawn.eeRmspawnCreepTypes");
const spawnCreepTypesNE = require("./spawn.spawnCreepTypesNE");
const spawnCreepTypesN = require("./spawn.spawnCreepTypesN");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");
const linkTransfer = require("./linkTransfer");
const profiler = require("./screeps-profiler");
const findDecayed = require("./action.findDecayed");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function () {
  profiler.wrap(function () {
    let lastEnAvail = Memory.enAvail || 0;

    let s1 = Game.spawns.Spawn1;
    let rm = Game.rooms.W63N36;

    let enAvaileRm = rm.energyAvailable;
    let enCapeRm = rm.energyCapacityAvailable;


    towersAttackInvader(invader, towers);

    checkForAttackers();

    let crps = Game.creeps;
    let numCrps = reCheckNumOfCreeps(numCrps, crps);
    areCreepsDying(numCrps);

    deleteDeadCreeps();
    crps = Game.creeps;
    numCrps = reCheckNumOfCreeps(numCrps, crps);

    if (Game.cpu.bucket > 15) {
      runRoles();
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }

    if (Game.cpu.bucket > 25) {
      spawnCreepTypes(enAvail);

      spawnToSource1Chain();
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }

    if (Game.cpu.bucket > 30) {
      linkTransfer(linkSpawn, slinkMiddle);
      linkTransfer(linkSpawn, slinkMiddle2);
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }


    checkProgress(numCrps, rm);
  });

  // Profiler stats
  let pTime = Memory.profilerTime;
  let profilerDur = 15000;
  if (!pTime || Game.time - Memory.profilerTime > profilerDur * 1.1) {
    Memory.profilerTime = Game.time;
    Game.profiler.email(profilerDur);
  }
};
function reCheckNumOfCreeps(numCrps, crps) {
  numCrps = Object.keys(crps).length;
  return numCrps;
}

function deleteDeadCreeps() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("del.", name);
    }
  }
}

function areCreepsDying(numCrps) {
  if (numCrps < 4 && Object.keys(Memory.creeps).length >= 4) {
    Game.notify("Creeps are dying. " + numCrps + " left.");
  } else if (numCrps < 10 && Object.keys(Memory.creeps).length >= 10) {
    Game.notify("Less than 10 creeps left.");
  }
}

function checkProgress(numCrps, rm) {
  if (Game.time % 3600 == 0) {
    if (!Memory.rmProg) {
      Memory.rmProg = 0;
    }


    let rmControllerId = Memory.rmControllerId || "5bbcaefa9099fc012e639e90";
    let rmController = Game.getObjectById(rmControllerId);
    const rmLvl = rmController.level;
    const rmProg = rmController.progress;

    Memory.rmProg = rmProg;

    console.log("Creeps: " + numCrps);

    console.log(
      "S: " +
      rmLvl +
      ":" +
      rmProg / 1000 +
      "/" +
      rmProgTot / 1000 +
      " - " +
      rmProgPerc +
      "%"
    );

    let enAvail = rm.energyAvailable;
    let enCap = rm.energyCapacityAvailable;
    console.log("S:" + enAvail + "," + enCap);

    Game.notify(
      "S: " +
      rmLvl +
      ":" +
      rmProg / 1000 +
      "/" +
      rmProgTot / 1000 +
      "\n" +
      rmProgPerc +
      "%"
    );
  }
}

function towersAttackInvader(invader, towers) {
  if (invader) {
    for(let i = 0; i < towers.length; i++) {
      towers[i].attack(invader);
    }
  }
}

