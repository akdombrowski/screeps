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
    Memory.s1 = s1;

    let rm = s1.room;
    Memory.rm = rm;
    Memory.homeRoomName = "E59S48";
    Memory.northRoomName = "E59S47";

    let enAvail = rm.energyAvailable;
    let enCapRm = rm.energyCapacityAvailable;
    Memory.enAvail = enAvail;
    Memory.enCapRm = enCapRm;

    Memory.source1 = "59bbc5d22052a716c3cea136";
    Memory.source2 = "59bbc5d22052a716c3cea135";
    Memory.nSource1 = "59bbc5d22052a716c3cea131";
    Memory.nSource2 = "59bbc5d22052a716c3cea132";

    Memory.attackDurationSafeCheck = 1000;
    Memory.nattackDurationSafeCheck = 1000;

    // towersAttackInvader(invader, towers);

    Memory.e59s48fixables = findFixables(Game.rooms[Memory.homeRoomName]);

    Memory.e59s47fixables = findFixables(Game.rooms[Memory.northRoomName]);

    checkForAttackers();

    let crps = Memory.creeps || [];
    Memory.creeps = crps;
    let numCrps = reCheckNumOfCreeps(crps);
    areCreepsDying(numCrps);

    deleteDeadCreeps();
    crps = Game.creeps;

    if (Game.cpu.bucket > 15) {
      runRoles();
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }

    if (Game.cpu.bucket > 25) {
      spawnCreepTypes(enAvail);

      // spawnToSource1Chain();
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }

    // if (Game.cpu.bucket > 30) {
    //   linkTransfer(linkSpawn, slinkMiddle);
    //   linkTransfer(linkSpawn, slinkMiddle2);
    // } else {
    //   console.log("low cpu bucket: " + Game.cpu.bucket);
    // }

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
function findFixables(room) {
  if (!room) {
    return null;
  }

  let fixables = room.find(FIND_STRUCTURES, {
    filter: function (struct) {
      if (struct.structureType === STRUCTURE_ROAD) {
        return struct.hits < struct.hitsMax;
      } else if (struct.structureType === STRUCTURE_STORAGE) {
        return struct.hits < struct.hitsMax;
      } else if (structTAINER) {
        return struct.hits < struct.hitsMax;
      } else {
        return false;
      }
    },
  });

  fixables.sort(function compareFn(firstEl, secondEl) {
    if (firstEl.hitsMax / firstEl.hits >= 2) {
      return firstEl;
    }

    if (secondEl.hitsMax / secondEl.hits >= 2) {
      return secondEl;
    }

    if (firstEl.hitsMax - firstEl.hits > secondEl.hitsMax - secondEl.hits) {
      return firstEl;
    }
  });

  return fixables.map((f) => f.id);
}

function reCheckNumOfCreeps(crps) {
  let numCrps = Object.keys(crps).length;
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

    let rmControllerId = "59bbc5d22052a716c3cea137";
    let rmController = Game.getObjectById(rmControllerId);
    const rmLvl = rmController.level;
    const rmProg = rmController.progress;
    const rmProgTotal = rmController.progressTotal;
    const rmProgPerc = (rmProg / rmProgTotal) * 100;

    Memory.rmProg = rmProg;

    console.log("Creeps: " + numCrps);

    console.log(
      "S: " +
        rmLvl +
        ":" +
        rmProg / 1000 +
        "/" +
        rmProgTotal / 1000 +
        " - " +
        rmProgPerc +
        "%"
    );

    let enAvail = rm.energyAvailable;
    let enCap = rm.energyCapacityAvailable;
    console.log("S:" + enAvail + "," + enCap);

    Game.notify(
      rmLvl +
        ":" +
        rmProg / 1000 +
        "/" +
        rmProgTotal / 1000 +
        "\n" +
        rmProgPerc +
        "%"
    );
  }
}

function towersAttackInvader(invader, towers) {
  if (invader) {
    for (let i = 0; i < towers.length; i++) {
      towers[i].attack(invader);
    }
  }
}
