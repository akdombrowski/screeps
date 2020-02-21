const spawnBackupCreeps = require("./spawnBackupCreeps");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}

function birthCreep(
  s1,
  parts,
  name,
  chosenRole,
  direction,
  sourceId,
  spawnDirection
) {
  let retval;
  let spawningPositionBlocked = s1.room.lookForAt(
    LOOK_CREEPS,
    s1.pos.x + 1,
    s1.pos.y - 1
  );
  if (!spawningPositionBlocked || spawningPositionBlocked.length <= 0) {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: spawnDirection,
    });
  } else {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: { role: chosenRole, direction: direction, sourceId: sourceId },
    });
  }

  if (retval == OK) {
    console.log("spawned." + name);
  } else {
    console.log("spawn1 failed: " + retval);

    retval = Game.spawns.spawn2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: spawnDirection,
    });

    console.log("spawn2: " + retval);
  }
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
  let southtowerHarvesters = Memory.southtowerHarvesters || [];
  let claimers = Memory.claimers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.Spawn1;

  let attackers = Memory.attackers || [];

  // 300
  let upContrParts = [];
  addPart(upContrParts, 1, CARRY);
  addPart(upContrParts, 2, WORK);
  addPart(upContrParts, 1, MOVE);

  // 1000
  let upContrPartsBig = [];
  addPart(upContrPartsBig, 1, CARRY);
  addPart(upContrPartsBig, 6, WORK);
  addPart(upContrPartsBig, 7, MOVE);

  // 1000
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 9, WORK);
  addPart(southHvParts, 1, MOVE);

  // 650
  let claimerParts = [];
  addPart(claimerParts, 1, MOVE);
  addPart(claimerParts, 1, CLAIM);

  // 1000
  let newhvParts = [];
  addPart(newhvParts, 1, CARRY);
  addPart(newhvParts, 9, WORK);
  addPart(newhvParts, 1, MOVE);

  // 1000
  let workerParts = [];
  addPart(workerParts, 1, CARRY);
  addPart(workerParts, 8, WORK);
  addPart(workerParts, 3, MOVE);

  // 1000
  let repairerParts = [];
  addPart(repairerParts, 1, CARRY);
  addPart(repairerParts, 7, WORK);
  addPart(repairerParts, 5, MOVE);

  // 300
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 2, WORK);
  addPart(linkGetsParts, 1, MOVE);

  // 1000
  let largeLinkGetsParts = [];
  addPart(largeLinkGetsParts, 1, CARRY);
  addPart(largeLinkGetsParts, 8, WORK);
  addPart(largeLinkGetsParts, 3, MOVE);

  // 290
  let attackerParts = [];
  addPart(attackerParts, 3, ATTACK);
  addPart(attackerParts, 1, MOVE);

  // 960
  let bigAttackerParts = [];
  addPart(bigAttackerParts, 7, ATTACK);
  addPart(bigAttackerParts, 8, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 650) {
    if (
      claimers.length < 1 &&
      !Game.getObjectById("5bbcaf1b9099fc012e63a2dd").my
    ) {
      let t = Game.time.toString().slice(4);
      chosenRole = "c";
      name = "claimer" + t;
      direction = "ee";
      parts = claimerParts;
      sourceId = "";
      spawnDirection = [TOP_RIGHT];
      claimers.push(name);

      console.log("claimers");

      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
      return;
    }
  }

  if (enAvail >= 300 && attackers.length < 1 && Memory.nAttackerId) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM];

    parts = attackerParts;
    name = "att" + t;
    chosenRole = "attacker";
    direction = "north";
    attackers.push(name);
    birthCreep(
      s1,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection
    );
  } else if (southHarvesters.length < 5 && !invaderId) {
    if (enAvail >= 300) {
      let t = Game.time.toString().slice(4);
      let name = "harv" + t;
      let chosenRole = "h";
      let direction = "south";
      let sourceId = Memory.source2;
      let parts = simpleParts;
      let spawnDirection = [BOTTOM];

      if (southHarvesters.length < 4) {
        southHarvesters.push(name);
        parts = simpleParts;
        birthCreep(
          s1,
          parts,
          name,
          chosenRole,
          direction,
          sourceId,
          spawnDirection
        );
      } else if (upControllers.length < 1) {
        parts = upContrParts;
        name = "upc" + t;
        upControllers.push(name);
        chosenRole = "upController";
        birthCreep(
          s1,
          parts,
          name,
          chosenRole,
          direction,
          sourceId,
          spawnDirection
        );
      } else if (
        northHarvesters.length < 5 &&
        (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
      ) {
        name += "N";
        direction = "north";
        northHarvesters.push(name);
        birthCreep(
          s1,
          parts,
          name,
          chosenRole,
          direction,
          sourceId,
          spawnDirection
        );
      } else if (
        westHarvesters.length < 5 &&
        (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
      ) {
        name += "W";
        direction = "west";
        westHarvesters.push(name);
        birthCreep(
          s1,
          parts,
          name,
          chosenRole,
          direction,
          sourceId,
          spawnDirection
        );
      } else {
        southHarvesters.push(name);
        parts = simpleParts;
        birthCreep(
          s1,
          parts,
          name,
          chosenRole,
          direction,
          sourceId,
          spawnDirection
        );
      }
    }
  } else if (enAvail >= 1000 && !invaderId && Memory.harvester1) {
    console.log("birth attacker");
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let waitForRezzy = false;
    let sourceId = Memory.source2;
    let parts = newhvParts;
    let spawnDirection = [BOTTOM];
    let birth = false;

    if (linkGets.length < 1 && Memory.harvester1) {
      chosenRole = "linkGet";
      name = "XLlink" + t;
      parts = largeLinkGetsParts;
      linkGets.push(name);
      birth = true;
    } else if (upControllers.length < 2) {
      parts = upContrParts;
      name = "upc" + t;
      chosenRole = "upController";
      upControllers.push(name);
      birth = true;
    } else if (attackers.length < 2 && Memory.nAttackerId) {
      parts = bigAttackerParts;
      name = "att" + t;
      chosenRole = "attacker";
      direction = "north";
      attackers.push(name);
    } else if (southHarvesters.length < 7) {
      southHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (southtowerHarvesters.length < 6) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (roadRepairers.length < 2) {
      chosenRole = "r";
      name = chosenRole + t;
      parts = repairerParts;
      roadRepairers.push(name);
      birth = true;
    } else if (
      northHarvesters.length < 4 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      direction = "north";
      northHarvesters.push(name);
      birth = true;
    } else if (
      westHarvesters.length < 4 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      direction = "west";
      westHarvesters.push(name);
      birth = true;
    } else if (workers.length < 3) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    } else if (
      !Game.creeps.northRezzy &&
      (!nAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "northRezzy";
        name = "nRezzy" + t;
        direction = "north";
        parts = rezzyParts;
        birth = true;
      }
    } else if (
      !Game.creeps.westRezzy &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      chosenRole = "westRezzy";
      name = "wRezzy" + t;
      direction = "west";
      parts = rezzyParts;
      birth = true;
    } else if (
      !Game.creeps.eastRezzy &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      chosenRole = "eastRezzy";
      name = "eRezzy" + t;
      direction = "east";
      parts = upContrParts;
      birth = true;
    } else {
      chosenRole = "linkGet";
      name = "XLlink" + t;
      parts = largeLinkGetsParts;
      linkGets.push(name);
      birth = true;
    }

    if ((!waitForRezzy || numCrps < 10 || name.endsWith("Rezzy")) && birth) {
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else {
      console.log("wait for rezzy");
    }
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.eastHarvesters = eastHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.linkGets = linkGets;
  Memory.southtowerHarvesters = southtowerHarvesters;
}

module.exports = spawnCreepTypes;
