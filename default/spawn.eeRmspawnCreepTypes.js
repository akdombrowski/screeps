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
  if (!eespawn.room.lookForAt(LOOK_CREEPS, eespawn.pos.x, eespawn.pos.y - 1)) {
        console.log("birthing: " + name);

    retval = eespawn.spawnCreep(parts, name, {
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
    retval = eespawn.spawnCreep(parts, name, {
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
  let eelinkGets = Memory.eelinkGets || [];
  let eeworkers = Memory.eeworkers || [];
  let eeneworkers = Memory.eeneworkers || [];

  let eeharvesters = Memory.eeharvesters || [];
  let eeupControllers = Memory.eeupControllers || [];
  let eeroadRepairers = Memory.eeroadRepairers || [];
  let eenorthHarvesters = Memory.eenorthHarvesters || [];
  let eewestHarvesters = Memory.eewestHarvesters || [];

    let harvesters = Memory.harvesters;

  let eeastWorkers = Memory.eeastWorkers || [];
  let eeastUpControllers = Memory.eeastUpControllers || [];
  let eeHarvesters = Memory.eeHarvesters || [];
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

  // 800
  let medupContrParts = [];
  addPart(medupContrParts, 2, CARRY);
  addPart(medupContrParts, 4, WORK);
  addPart(medupContrParts, 6, MOVE);

  // 800
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 2, CARRY);
  addPart(medsouthHvParts, 5, WORK);
  addPart(medsouthHvParts, 4, MOVE);

  // 800
  let mednewhvParts = [];
  addPart(mednewhvParts, 1, CARRY);
  addPart(mednewhvParts, 5, WORK);
  addPart(mednewhvParts, 5, MOVE);

  // 800
  let medworkerParts = [];
  addPart(medworkerParts, 3, CARRY);
  addPart(medworkerParts, 5, WORK);
  addPart(medworkerParts, 3, MOVE);

  // 800
  let medrepairerParts = [];
  addPart(medrepairerParts, 1, CARRY);
  addPart(medrepairerParts, 6, WORK);
  addPart(medrepairerParts, 3, MOVE);

  //
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 1, CARRY);
  addPart(medlinkGetsParts, 6, WORK);
  addPart(medlinkGetsParts, 1, MOVE);

  // 1100
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 7, WORK);
  addPart(southHvParts, 7, MOVE);

  // 1100
  let newhvParts = [];
  addPart(newhvParts, 2, CARRY);
  addPart(newhvParts, 7, WORK);
  addPart(newhvParts, 6, MOVE);

  // 1100
  let workerParts = [];
  addPart(workerParts, 1, CARRY);
  addPart(workerParts, 9, WORK);
  addPart(workerParts, 3, MOVE);

  // 1100
  let repairerParts = [];
  addPart(repairerParts, 4, CARRY);
  addPart(repairerParts, 7, WORK);
  addPart(repairerParts, 4, MOVE);

  // 1100
  let linkGetsParts = [];
  addPart(linkGetsParts, 2, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 2, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, CARRY, MOVE, MOVE];
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
    let sourceDir = "";
    let birth = false;
    let buildRoom = "";

    if (harvesters.length < 25) {
      eeHarvesters.push(name);
      parts = basicHv;
      sourceDir = "eeast";
      birth = true;
    } else if (eeastUpControllers.length < 1) {
      chosenRole = "eeRezzy";
      name = chosenRole + t;
      direction = "eeast";
      parts = simpleParts;
      eeastUpControllers.push(name);
      birth = true;
    }
    // } else if (eeUps.length < 2) {
    //   chosenRole = "eeUp";
    //   name = chosenRole + t;
    //   direction = "ee";
    //   parts = simpleParts;
    //   eeUps.push(name);
    //   birth = true;
    // } 
     else if (eeHarvesters.length < 4) {
      eeHarvesters.push(name);
      parts = basicHv;
      sourceDir = "north2";
      birth = true;
    } else if (eeworkers.length < 1) {
      eeworkers.push(name);
      chosenRole = "eBuilder";
      buildRoom = "E36N31";
      name = chosenRole + t;
      parts = simpleParts;
      birth = true;
    }

    if (birth) {
      console.log(
        chosenRole +
          " role birth" +
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

  if (enAvail >= 800) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "NE";
    let chosenRole = "h";
    let direction = "eeast";
    let parts = mednewhvParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "";
    let birth = false;
    let buildRoom = "";

    if (eeastUpControllers.length < 2) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      direction = "eeast";
      parts = medupContrParts;
      eeastUpControllers.push(name);
      birth = true;
    } else if (eetowerHarvesters.length < 1) {
      chosenRole = "etowerHarvester";
      name = chosenRole + t;
      eetowerHarvesters.push(name);
      eeharvesters.push(name);
      parts = mednewhvParts;
      sourceDir = "east1";
      birth = true;
    } else if (eeastWorkers.length < 1) {
      chosenRole = "worker";
      name = chosenRole + t;
      eeastWorkers.push(name);
      parts = medworkerParts;
      birth = true;
    } else if (eeastUpControllers.length < 3) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      direction = "eeast";
      parts = medupContrParts;
      eeastUpControllers.push(name);
      birth = true;
    }

    if (birth) {
      console.log(
        chosenRole +
          " role birth:" +
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
    } else if (eeastWorkers.length < 3) {
      chosenRole = "worker";
      name = chosenRole + t;
      eeastWorkers.push(name);
      parts = medworkerParts;
    }

    console.log(
      chosenRole +
        " role birth:" +
        birthCreep(
          Game.spawns.eespawn,
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

  Memory.eeharvesters = eeharvesters;
  Memory.eeworkers = eeworkers;
  Memory.eeworkers = eeworkers;
  Memory.eeneworkers = eeneworkers;
  Memory.eeupControllers = eeupControllers;
  Memory.eeroadRepairers = eeroadRepairers;
  Memory.eeattackers = eeattackers;
  Memory.eeclaimers = eeclaimers;
  Memory.eenorthHarvesters = eenorthHarvesters;
  Memory.eewestHarvesters = eewestHarvesters;
  Memory.eelinkGets = eelinkGets;

  Memory.eeastWorkers = eeastWorkers;
  Memory.eeastUpControllers = eeastUpControllers;
  Memory.eeHarvesters = eeHarvesters;
  Memory.eeNeHarvesters = eeNeHarvesters;
  Memory.eetowerHarvesters = eetowerHarvesters;
  Memory.eeUps = eeUps;
}

module.exports = spawnCreepTypes;
