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
  spawnDirection
) {
  let retval;
  s2 = Game.getObjectById(Memory.s2);
  if (!s2.room.lookForAt(LOOK_CREEPS, s2.pos.x, s2.pos.y - 1).pop()) {
    retval = s2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir
      },
      directions: spawnDirection
    });
  } else {
    retval = s2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir
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
  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let northHarvesters = Memory.northHarvesters || [];
  let westHarvesters = Memory.westHarvesters || [];
  let southHarvesters = Memory.southHarvesters || [];

  let eastHarvesters = Memory.eastHarvesters || [];
  let eastWorkers = Memory.eastWorkers || [];
  let eastUpControllers = Memory.eastUpControllers || [];
  let ermHarvesters = Memory.ermHarvesters || [];
  let ermNeHarvesters = Memory.ermNeHarvesters || [];

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

  // 750
  let medupContrParts = [];
  addPart(medupContrParts, 1, CARRY);
  addPart(medupContrParts, 5, WORK);
  addPart(medupContrParts, 4, MOVE);

  // 750
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 1, CARRY);
  addPart(medsouthHvParts, 4, WORK);
  addPart(medsouthHvParts, 6, MOVE);

  // 750
  let mednewhvParts = [];
  addPart(mednewhvParts, 1, CARRY);
  addPart(mednewhvParts, 3, WORK);
  addPart(mednewhvParts, 8, MOVE);

  // 750
  let medworkerParts = [];
  addPart(medworkerParts, 1, CARRY);
  addPart(medworkerParts, 5, WORK);
  addPart(medworkerParts, 4, MOVE);

  // 750
  let medrepairerParts = [];
  addPart(medrepairerParts, 1, CARRY);
  addPart(medrepairerParts, 4, WORK);
  addPart(medrepairerParts, 6, MOVE);

  // 700
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 1, CARRY);
  addPart(medlinkGetsParts, 6, WORK);
  addPart(medlinkGetsParts, 1, MOVE);

  // 1100
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 6, WORK);
  addPart(southHvParts, 9, MOVE);

  // 1100
  let newhvParts = [];
  addPart(newhvParts, 2, CARRY);
  addPart(newhvParts, 7, WORK);
  addPart(newhvParts, 6, MOVE);

  // 1100
  let workerParts = [];
  addPart(workerParts, 2, CARRY);
  addPart(workerParts, 6, WORK);
  addPart(workerParts, 8, MOVE);

  // 1100
  let repairerParts = [];
  addPart(repairerParts, 2, CARRY);
  addPart(repairerParts, 5, WORK);
  addPart(repairerParts, 10, MOVE);

  // 1100
  let linkGetsParts = [];
  addPart(linkGetsParts, 2, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 2, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, MOVE, MOVE, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300 && eastUpControllers.length < 1) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "east";
    let chosenRole = "h";
    let direction = "east";
    let parts = upContrParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "";

    if (ermHarvesters.length < 1) {
      ermHarvesters.push(name);
      parts = basicHv;
      sourceDir = "east";
    } else if (eastUpControllers.length < 1) {
      chosenRole = "eastRezzy";
      name = chosenRole + t;
      direction = "east";
      parts = upContrParts;
      eastUpControllers.push(name);
    } else {
      ermHarvesters.push(name);
      parts = basicHv;
      sourceDir = "east";
    }

    console.log(
      chosenRole +
        " role birth" +
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

  if (enAvail >= 750) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "NE";
    let chosenRole = "h";
    let direction = "east";
    let parts = mednewhvParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "";

    if (ermNeHarvesters.length < 3) {
      ermNeHarvesters.push(name);
      parts = mednewhvParts;
      sourceDir = "north";
    } else if (eastUpControllers.length < 3) {
      chosenRole = "eastRezzy";
      name = chosenRole + t;
      direction = "east";
      parts = medworkerParts;
      eastUpControllers.push(name);
    } else if (eastWorkers.length < 3) {
      chosenRole = "worker";
      name = chosenRole + t;
      eastWorkers.push(name);
      parts = medworkerParts;
    } else if (ermHarvesters.length < 2) {
      name = "h" + t + "E";
      ermHarvesters.push(name);
      sourceDir = "east";
    } else {
      ermNeHarvesters.push(name);
      parts = mednewhvParts;
      sourceDir = "north";
    }

    console.log(
      chosenRole +
        " role birth:" +
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
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.linkGets = linkGets;

  Memory.eastHarvesters = eastHarvesters;
  Memory.eastWorkers = eastWorkers;
  Memory.eastUpControllers = eastUpControllers;
  Memory.ermHarvesters = ermHarvesters;
  Memory.ermNeHarvesters = ermNeHarvesters;
}

module.exports = spawnCreepTypes;
