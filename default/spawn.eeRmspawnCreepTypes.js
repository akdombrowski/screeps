const spawnBackupCreeps = require("./spawnBackupCreeps");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}

function birthCreep(
  eespawn,
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
  eespawn = Game.spawns.eespawn;

  // spawn bottom if no creeps
  if (!eespawn.room.lookForAt(LOOK_CREEPS, eespawn.pos.x, eespawn.pos.y + 1)) {
    console.log("birthing: " + name);

    retval = eespawn.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir,
        buildRoom: buildRoom,
      },
      directions: spawnDirection,
    });
  } else {
    retval = eespawn.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir,
        buildRoom: buildRoom,
      },
    });
  }

  if (retval == OK) {
    console.log("spawnedEE." + name);
  }
  return retval;
}

function spawnCreepTypes(enAvail) {
  let eelinkGets = Memory.eelinkGets || [];
  let eeworkers = Memory.eeworkers || [];
  let eeneworkers = Memory.eeneworkers || [];
  let workers = Memory.workers || [];

  let eeharvesters = Memory.eeharvesters || [];
  let eeupControllers = Memory.eeupControllers || [];
  let eeroadRepairers = Memory.eeroadRepairers || [];
  let eenorthHarvesters = Memory.eenorthHarvesters || [];
  let eewestHarvesters = Memory.eewestHarvesters || [];

  let harvesters = Memory.harvesters || [];
  let harvestersN = Memory.harvestersN || [];

  let eeastWorkers = Memory.eeastWorkers || [];
  let eeastUpControllers = Memory.eeastUpControllers || [];
  let eeRmHarvesters = Memory.eeRmHarvesters || [];
  let eeNeHarvesters = Memory.eeNeHarvesters || [];
  let eetowerHarvesters = Memory.eetowerHarvesters || [];
  let eeUps = Memory.eeUps || [];

  let eeclaimers = Memory.eeclaimers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let eespawn = Game.spawns.eespawn;

  let eeattackers = Memory.eeattackers || [];

  // 300
  let upContrParts = [];
  addPart(upContrParts, 3, CARRY);
  addPart(upContrParts, 1, WORK);
  addPart(upContrParts, 1, MOVE);

  // 550
  let medupContrParts = [];
  addPart(medupContrParts, 7, CARRY);
  addPart(medupContrParts, 1, WORK);
  addPart(medupContrParts, 2, MOVE);

  // 550
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 7, CARRY);
  addPart(medsouthHvParts, 1, WORK);
  addPart(medsouthHvParts, 2, MOVE);

  // 550
  let mednewhvParts = [];
  addPart(mednewhvParts, 7, CARRY);
  addPart(mednewhvParts, 1, WORK);
  addPart(mednewhvParts, 2, MOVE);

  // 550
  let medworkerParts = [];
  addPart(medworkerParts, 5, CARRY);
  addPart(medworkerParts, 1, WORK);
  addPart(medworkerParts, 4, MOVE);

  // 550
  let medrepairerParts = [];
  addPart(medrepairerParts, 4, CARRY);
  addPart(medrepairerParts, 1, WORK);
  addPart(medrepairerParts, 5, MOVE);

  // 550
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 7, CARRY);
  addPart(medlinkGetsParts, 1, WORK);
  addPart(medlinkGetsParts, 2, MOVE);

  // 1100
  let southHvParts = [];
  addPart(southHvParts, 13, CARRY);
  addPart(southHvParts, 1, WORK);
  addPart(southHvParts, 7, MOVE);

  // 1100
  let newhvParts = [];
  addPart(newhvParts, 14, CARRY);
  addPart(newhvParts, 1, WORK);
  addPart(newhvParts, 6, MOVE);

  // 1100
  let workerParts = [];
  addPart(workerParts, 10, CARRY);
  addPart(workerParts, 1, WORK);
  addPart(workerParts, 10, MOVE);

  // 1100
  let repairerParts = [];
  addPart(repairerParts, 10, CARRY);
  addPart(repairerParts, 1, WORK);
  addPart(repairerParts, 10, MOVE);

  // 1100
  let linkGetsParts = [];
  addPart(linkGetsParts, 2, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 2, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "EE";
    let chosenRole = "h";
    let direction = "eeast";
    let parts = upContrParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "eeast";
    let birth = false;
    let buildRoom = "";

    if (eeRmHarvesters.length < 2) {
      eeRmHarvesters.push(name);
      parts = basicHv;
      birth = true;
    } else if (eeastUpControllers.length < 2) {
      chosenRole = "eeUp";
      name = chosenRole + t;
      parts = simpleParts;
      eeastUpControllers.push(name);
      birth = true;
    } else if (eeworkers.length < 1) {
      chosenRole = "eeworker";
      buildRoom = "E37N31";
      name = chosenRole + t + buildRoom;
      parts = simpleParts;
      eeworkers.push(name);
      birth = true;
    }

    if (birth) {
      console.log(
        chosenRole +
          " basic role birth " +
          birthCreep(
            Game.spawns.eespawn,
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

  if (enAvail >= 550) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "EE";
    let chosenRole = "h";
    let direction = "eeast";
    let parts = mednewhvParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "eeast";
    let birth = false;
    let buildRoom = "E37N31";

    if (eeastUpControllers.length < 3) {
      chosenRole = "eeUp";
      name = chosenRole + t;
      parts = medupContrParts;
      eeastUpControllers.push(name);
      birth = true;
    } else if (eeRmHarvesters.length < 4) {
      eeRmHarvesters.push(name);
      parts = mednewhvParts;
      birth = true;
    } else if (eetowerHarvesters.length < 0) {
      chosenRole = "eetowerHarvester";
      name = chosenRole + t;
      eetowerHarvesters.push(name);
      eeharvesters.push(name);
      parts = mednewhvParts;
      sourceDir = "eeast1";
      birth = true;
    } else if (workers.length < 3) {
      // go to base room
      chosenRole = "worker";
      direction = "south";
      name = chosenRole + t;
      eeworkers.push(name);
      parts = medworkerParts;
      birth = true;
    } else if (eeastUpControllers.length < 4) {
      chosenRole = "eeUp";
      name = chosenRole + t;
      direction = "eeast";
      parts = medupContrParts;
      eeastUpControllers.push(name);
      birth = true;
    }

    if (birth) {
      console.log(
        chosenRole +
          " role birth: " +
          birthCreep(
            Game.spawns.eespawn,
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
    let name = "h" + t + "EE";
    let chosenRole = "h";
    let direction = "eeast";
    let parts = mednewhvParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "";

    if (eeastUpControllers.length < 3) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      parts = medworkerParts;
      eeastUpControllers.push(name);
    } else if (eeworkers.length < 3) {
      chosenRole = "eeworker";
      name = chosenRole + t;
      eeastWorkers.push(name);
      parts = medworkerParts;
    }

    birthCreep(
      Game.spawns.eespawn,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      sourceDir,
      spawnDirection
    );
  }

  Memory.harvesters = harvesters;
  Memory.harvestersN = harvestersN;
  Memory.eeharvesters = eeharvesters;
  Memory.workers = workers;
  Memory.eeworkers = eeworkers;
  Memory.eeneworkers = eeneworkers;
  Memory.eeroadRepairers = eeroadRepairers;
  Memory.eeattackers = eeattackers;
  Memory.eeclaimers = eeclaimers;
  Memory.eenorthHarvesters = eenorthHarvesters;
  Memory.eewestHarvesters = eewestHarvesters;
  Memory.eelinkGets = eelinkGets;
  Memory.eeastWorkers = eeastWorkers;
  Memory.eeastUpControllers = eeastUpControllers;
  Memory.eeRmHarvesters = eeRmHarvesters;
  Memory.eeNeHarvesters = eeNeHarvesters;
  Memory.eetowerHarvesters = eetowerHarvesters;
  Memory.eeUps = eeUps;
}

module.exports = spawnCreepTypes;
