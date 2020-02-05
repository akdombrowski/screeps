const spawnBackupCreeps = require("./spawnBackupCreeps");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}

function birthCreep(
  s2,
  parts,
  name,
  chosenRole,
  direction,
  sourceId,
  sourceDir,
  buildRoom,
  spawnDirection
) {
  let retval;
  s2 = Game.getObjectById(Memory.s2);
  if (!s2.room.lookForAt(LOOK_CREEPS, s2.pos.x, s2.pos.y - 1)) {
    retval = s2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir,
        buildRoom: buildRoom
      },
      directions: spawnDirection
    });
  } else {
    retval = s2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir,
        buildRoom: buildRoom
      }
    });
  }

  if (retval == OK) {
    console.log("spawned." + name);
  }
  return retval;
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let eworkers = Memory.eworkers || [];
  let neworkers = Memory.neworkers || [];

  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let northHarvesters = Memory.northHarvesters || [];
  let westHarvesters = Memory.westHarvesters || [];

  let eastHarvesters = Memory.eastHarvesters || [];
  let eastWorkers = Memory.eastWorkers || [];
  let eastUpControllers = Memory.eastUpControllers || [];
  let ermHarvesters = Memory.ermHarvesters || [];
  let ermNeHarvesters = Memory.ermNeHarvesters || [];
  let etowerHarvesters = Memory.etowerHarvesters || [];
  let eeUps = Memory.eeUps || [];

  let claimers = Memory.claimers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s2 = Game.spawns.s2;

  let attackers = Memory.attackers || [];

  // 300
  let upContrParts = [];
  addPart(upContrParts, 1, CARRY);
  addPart(upContrParts, 2, WORK);
  addPart(upContrParts, 1, MOVE);

  // 800
  let medupContrParts = [];
  addPart(medupContrParts, 1, CARRY);
  addPart(medupContrParts, 7, WORK);
  addPart(medupContrParts, 1, MOVE);

  // 800
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 1, CARRY);
  addPart(medsouthHvParts, 6, WORK);
  addPart(medsouthHvParts, 3, MOVE);

  // 800
  let mednewhvParts = [];
  addPart(mednewhvParts, 1, CARRY);
  addPart(mednewhvParts, 5, WORK);
  addPart(mednewhvParts, 5, MOVE);

  // 800
  let medworkerParts = [];
  addPart(medworkerParts, 1, CARRY);
  addPart(medworkerParts, 7, WORK);
  addPart(medworkerParts, 1, MOVE);

  // 800
  let medrepairerParts = [];
  addPart(medrepairerParts, 1, CARRY);
  addPart(medrepairerParts, 4, WORK);
  addPart(medrepairerParts, 7, MOVE);

  // 800
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 1, CARRY);
  addPart(medlinkGetsParts, 6, WORK);
  addPart(medlinkGetsParts, 3, MOVE);

  // 1100
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 9, WORK);
  addPart(southHvParts, 3, MOVE);

  // 1100
  let newhvParts = [];
  addPart(newhvParts, 1, CARRY);
  addPart(newhvParts, 7, WORK);
  addPart(newhvParts, 7, MOVE);

  // 1100
  let workerParts = [];
  addPart(workerParts, 1, CARRY);
  addPart(workerParts, 9, WORK);
  addPart(workerParts, 3, MOVE);

  // 1100
  let repairerParts = [];
  addPart(repairerParts, 1, CARRY);
  addPart(repairerParts, 6, WORK);
  addPart(repairerParts, 9, MOVE);

  // 1100
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 3, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "E";
    let chosenRole = "h";
    let direction = "east";
    let parts = upContrParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "";
    let birth = false;
    let buildRoom = "";

    if (ermHarvesters.length < 2) {
      ermHarvesters.push(name);
      parts = basicHv;
      sourceDir = "east";
      birth = true;
    } else if (eastUpControllers.length < 1) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      direction = "east";
      parts = simpleParts;
      eastUpControllers.push(name);
      birth = true;}
    // } else if (eeUps.length < 2) {
    //   chosenRole = "eeUp";
    //   name = chosenRole + t;
    //   direction = "ee";
    //   parts = simpleParts;
    //   eeUps.push(name);
    //   birth = true;
    // }
    else if (ermNeHarvesters.length < 2) {
      ermHarvesters.push(name);
      name = "h" + t + "NE";
      parts = basicHv;
      sourceDir = "north2";
      birth = true;
    } else if (eworkers.length < 1) {
      eworkers.push(name);
      chosenRole = "eBuilder";
      buildRoom = "E36N31";
      name = chosenRole + t;
      parts = simpleParts;
      birth = true;
    } else if (neworkers.length < 1) {
      eworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = simpleParts;
      birth = true;
    }

    if (birth) {
      console.log(
        name +
          " role birth: " +
          birthCreep(
            s2,
            parts,
            name,
            chosenRole,
            direction,
            sourceId,
            sourceDir,
            buildRoom,
            spawnDirection
          )
      );
    }
  }

  if (enAvail >= 800) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "E";
    let chosenRole = "h";
    let direction = "east";
    let parts = mednewhvParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "eeast";
    let birth = false;
    let buildRoom = "E37N31";

    if (eastUpControllers.length < 2) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      direction = "east";
      parts = medupContrParts;
      eastUpControllers.push(name);
      birth = true;
    } else if (ermNeHarvesters.length < 4) {
      ermNeHarvesters.push(name);
      name = "h" + t + "NE";
      parts = mednewhvParts;
      sourceDir = "north1";
      birth = true;
    } else if (etowerHarvesters.length < 1) {
      chosenRole = "etowerHarvester";
      name = chosenRole + t;
      etowerHarvesters.push(name);
      harvesters.push(name);
      parts = mednewhvParts;
      sourceDir = "east1";
      birth = true;
    } else if (eastWorkers.length < 2) {
      chosenRole = "worker";
      name = chosenRole + t;
      eastWorkers.push(name);
      parts = medworkerParts;
      birth = true;
    } else if (eastUpControllers.length < 3) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      direction = "east";
      parts = medupContrParts;
      eastUpControllers.push(name);
      birth = true;
    }

    if (birth) {
      console.log(
        name +
          " role birth: " +
          birthCreep(
            s2,
            parts,
            name,
            chosenRole,
            direction,
            sourceId,
            sourceDir,
            buildRoom,
            spawnDirection
          )
      );
    }
  }

  if (enAvail >= 1100) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "NE";
    let chosenRole = "h";
    let direction = "east";
    let parts = mednewhvParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "";

    if (ermNeHarvesters.length < 5) {
      ermNeHarvesters.push(name);
      parts = mednewhvParts;
      sourceDir = "north";
    } else if (eastUpControllers.length < 3) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      parts = medworkerParts;
      eastUpControllers.push(name);
    } else if (eastWorkers.length < 3) {
      chosenRole = "worker";
      name = chosenRole + t;
      eastWorkers.push(name);
      parts = medworkerParts;
    }

    console.log(
      name +
        " role birth: " +
        birthCreep(
          s2,
          parts,
          name,
          chosenRole,
          direction,
          sourceId,
          sourceDir,
          spawnDirection
        )
    );
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.eworkers = eworkers;
  Memory.neworkers = neworkers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.linkGets = linkGets;

  Memory.eastHarvesters = eastHarvesters;
  Memory.eastWorkers = eastWorkers;
  Memory.eastUpControllers = eastUpControllers;
  Memory.ermHarvesters = ermHarvesters;
  Memory.ermNeHarvesters = ermNeHarvesters;
  Memory.etowerHarvesters = etowerHarvesters;
  Memory.eeUps = eeUps;
}

module.exports = spawnCreepTypes;
