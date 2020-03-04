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
    s1.pos.x,
    s1.pos.y + 1
  );
  if (!spawningPositionBlocked || spawningPositionBlocked.length <= 0) {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: [BOTTOM],
    });
  } else {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: { role: chosenRole, direction: direction, sourceId: sourceId },
    });
  }

  if (retval === OK) {
    console.log("spawn1ed." + name);
    return retval;
  } else {
    console.log("Spawn1 failed: " + retval);
    retval = Game.spawns.spawn2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: [TOP],
    });
  }

  if (retval === OK) {
    console.log("spawn2ed." + name);
    return retval;
  } else {
    retval = Game.spawns.sspawn3.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: [TOP_RIGHT],
    });

    if (retval === OK) {
      console.log("spawn3ed." + name);
    }
  }
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let nworkers = Memory.nworkers || [];
  let nwworkers = Memory.nwworkers || [];
  let neworkers = Memory.neworkers || [];
  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let upControllersN = Memory.upControllersN || [];
  let upControllersNW = Memory.upControllersNW || [];
  let upControllersW = Memory.upControllersW || [];
  let upControllersNE = Memory.upControllersNE || [];
  let roadRepairers = Memory.roadRepairers || [];
  let harvestersN = Memory.harvestersN || [];
  let harvestersNW = Memory.harvestersNW || [];
  let harvestersNWW = Memory.harvestersNWW || [];
  let harvestersW = Memory.westHarvesters || [];
  let harvestersS = Memory.southHarvesters || [];
  let harvestersE = Memory.eastHarvesters || [];
  let southtowerHarvesters = Memory.southtowerHarvesters || [];
  let claimers = Memory.claimers || [];
  let claimersN = Memory.claimersN || [];
  let claimersNW = Memory.claimersNW || [];
  let claimersNWW = Memory.claimersNWW || [];
  let claimersW = Memory.claimersW || [];
  let claimersNE = Memory.claimersNE || [];
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

  // 2500
  let moverParts = [];
  addPart(moverParts, 50, MOVE);

  // 3000
  let upContrPartsBig = [];
  addPart(upContrPartsBig, 20, CARRY);
  addPart(upContrPartsBig, 10, WORK);
  addPart(upContrPartsBig, 20, MOVE);

  // 3500
  let southHvParts = [];
  addPart(southHvParts, 8, CARRY);
  addPart(southHvParts, 20, WORK);
  addPart(southHvParts, 22, MOVE);

  // 650
  let claimerParts = [];
  addPart(claimerParts, 1, MOVE);
  addPart(claimerParts, 1, CLAIM);

  // 2750
  let newhvParts = [];
  addPart(newhvParts, 20, CARRY);
  addPart(newhvParts, 5, WORK);
  addPart(newhvParts, 25, MOVE);

  // 2550
  let travelhvParts = [];
  addPart(travelhvParts, 24, CARRY);
  addPart(travelhvParts, 1, WORK);
  addPart(travelhvParts, 25, MOVE);

  // 2900
  let workerParts = [];
  addPart(workerParts, 16, CARRY);
  addPart(workerParts, 8, WORK);
  addPart(workerParts, 26, MOVE);

  // 3000
  let repairerParts = [];
  addPart(repairerParts, 10, CARRY);
  addPart(repairerParts, 10, WORK);
  addPart(repairerParts, 30, MOVE);

  // 300
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 2, WORK);
  addPart(linkGetsParts, 1, MOVE);

  // 3000
  let largeLinkGetsParts = [];
  addPart(largeLinkGetsParts, 10, CARRY);
  addPart(largeLinkGetsParts, 10, WORK);
  addPart(largeLinkGetsParts, 30, MOVE);

  // 290
  let attackerParts = [];
  addPart(attackerParts, 3, ATTACK);
  addPart(attackerParts, 1, MOVE);

  // 3250
  let bigAttackerParts = [];
  addPart(bigAttackerParts, 25, ATTACK);
  addPart(bigAttackerParts, 25, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let invaderId = Memory.invaderId;

  // if (enAvail >= 650) {
  //   if (
  //     claimers.length < 1 &&
  //     !Game.getObjectById("5bbcaf1b9099fc012e63a2dd").my
  //   ) {
  //     let t = Game.time.toString().slice(4);
  //     chosenRole = "c";
  //     name = "claimer" + t;
  //     direction = "ee";
  //     parts = claimerParts;
  //     sourceId = "";
  //     spawnDirection = [TOP_RIGHT];
  //     claimers.push(name);

  //     console.log("claimers");

  //     birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //     Memory.claimers = claimers;
  //     return;
  //   }
  // }
  if (
    Game.spawns.Spawn1.spawning &&
    Game.spawns.spawn2.spawning &&
    Game.spawns.sspawn3.spawning
  ) {
    return;
  }

  const contrW = Game.getObjectById("5bbcaeeb9099fc012e639c4d");
  const contrNW = Game.getObjectById("5bbcaeeb9099fc012e639c4a");
  const contrNWW = Game.getObjectById("5bbcaedb9099fc012e639a93");

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
  } else if (enAvail >= 300 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM];

    if (harvestersS.length < 2) {
      harvestersS.push(name);
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
      name = "upC" + t;
      upControllers.push(name);
      chosenRole = "upC";
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (upControllersN.length < 1) {
      parts = upContrParts;
      name = "upCN" + t;
      upControllersN.push(name);
      chosenRole = "upCN";
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (upControllersNE.length < 1) {
      parts = upContrParts;
      name = "upCNE" + t;
      upControllersNE.push(name);
      chosenRole = "upCNE";
      direction = "ne";
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (upControllersNW.length < 1) {
      parts = upContrParts;
      name = "upCNW" + t;
      upControllersNW.push(name);
      chosenRole = "upCNW";
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
      harvestersW.length < 2 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = simpleParts;
      direction = "west";
      harvestersW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (harvestersNW.length < 2) {
      name += "NW";
      parts = simpleParts;
      direction = "nw";
      harvestersW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (harvestersNWW.length < 2) {
      name += "NWW";
      parts = simpleParts;
      direction = "nww";
      harvestersNWW.push(name);
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

  if (enAvail >= 650) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM];

    if (claimersW.length < 1 && (!contrW || !contrW.my)) {
      parts = claimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNWW.length < 1 && (!contrNWW || !contrNWW.my)) {
      parts = claimerParts;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNW.length < 1 && (!contrNW || !contrNW.my)) {
      parts = claimerParts;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNWW.length < 2 && (!contrNWW || !contrNWW.my)) {
      parts = claimerParts;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNW.length < 2 && (!contrNW || !contrNW.my)) {
      parts = claimerParts;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersW.length < 2 && (!contrW || !contrW.my)) {
      parts = claimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
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

  if (enAvail >= 3250 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "hXL" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = newhvParts;
    let spawnDirection = [BOTTOM];
    let birth = false;
    let buildRoom = "E36N32";

    if (linkGets.length < 1 && Memory.harvester1) {
      chosenRole = "linkGet";
      name = "linkget" + t;
      parts = largeLinkGetsParts;
      linkGets.push(name);
      birth = true;
    } else if (
      harvestersW.length < 2 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 1) {
      name += "NWW";
      parts = travelhvParts;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 1) {
      name += "WW";
      parts = travelhvParts;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 2) {
      name += "NWW";
      parts = travelhvParts;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 2) {
      name += "WW";
      parts = travelhvParts;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (upControllers.length < 1) {
      parts = upContrParts;
      name = "upc" + t;
      upControllers.push(name);
      chosenRole = "upController";
      birth = true;
    } else if (southtowerHarvesters.length < 1) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (workers.length < 3) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    } else if (harvestersS.length < 2) {
      harvestersS.push(name);
      parts = southHvParts;
      birth = true;
    } else if (
      claimersW.length < 1 &&
      (!Game.getObjectById("5bbcaeeb9099fc012e639c4d") ||
        !Game.getObjectById("5bbcaeeb9099fc012e639c4d").my)
    ) {
      parts = claimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersW.length < 1 &&
      Game.getObjectById("5bbcaeeb9099fc012e639c4d") &&
      Game.getObjectById("5bbcaeeb9099fc012e639c4d").my &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig;
      name = "upCW" + t;
      chosenRole = "upCW";
      birth = true;
      upControllersW.push(name);
    } else if (
      claimersN.length < 1 &&
      !Game.getObjectById("5bbcaefa9099fc012e639e8b").my
    ) {
      parts = claimerParts;
      name = "claimN" + t;
      chosenRole = "claimN";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersN.length < 1 &&
      Game.getObjectById("5bbcaefa9099fc012e639e8b").my &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig;
      name = "upCN" + t;
      chosenRole = "upCN";
      birth = true;
      upControllersN.push(name);
    } else if (
      claimersNE.length < 1 &&
      !Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my
    ) {
      parts = claimerParts;
      name = "claimNE" + t;
      chosenRole = "claimNE";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersNE.length < 1 &&
      Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my &&
      (!neAttackerId || Game.time >= neAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig;
      name = "upCNE" + t;
      chosenRole = "upCNE";
      birth = true;
      upControllersNE.push(name);
    } else if (harvestersS.length < 2) {
      harvestersS.push(name);
      parts = southHvParts;
      birth = true;
    } else if (
      nworkers.length < 1 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      nworkers.push(name);
      chosenRole = "nBuilder";
      direction = "north";
      buildRoom = "E35N32";
      name = chosenRole + t;
      parts = workerParts;
      birth = true;
    } else if (southtowerHarvesters.length < 2) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (attackers.length < 2 && Memory.nAttackerId) {
      parts = bigAttackerParts;
      name = "att" + t;
      chosenRole = "attacker";
      direction = "north";
      attackers.push(name);
      birth = true;
    } else if (harvestersS.length < 2) {
      harvestersS.push(name);
      parts = southHvParts;
      birth = true;
    } else if (
      harvestersN.length < 2 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      parts = travelhvParts;
      direction = "north";
      harvestersN.push(name);
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (neworkers.length < 3) {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = workerParts;
      birth = true;
    } else {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    }

    if (birth) {
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
      console.log("south wait for rezzy");
    }
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.nworkers = nworkers;
  Memory.nwworkers = nwworkers;
  Memory.neworkers = neworkers;
  Memory.upControllers = upControllers;
  Memory.upControllersN = upControllersN;
  Memory.upControllersNW = upControllersNW;
  Memory.upControllersNE = upControllersNE;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.claimersN = claimersN;
  Memory.claimersNW = claimersNW;
  Memory.claimersNWW = claimersNWW;
  Memory.claimersNE = claimersNE;
  Memory.harvestersN = harvestersN;
  Memory.harvestersNW = harvestersNW;
  Memory.harvestersNWW = harvestersNWW;
  Memory.eastHarvesters = harvestersE;
  Memory.westHarvesters = harvestersW;
  Memory.southHarvesters = harvestersS;
  Memory.linkGets = linkGets;
  Memory.southtowerHarvesters = southtowerHarvesters;
}

module.exports = spawnCreepTypes;
