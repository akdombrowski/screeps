const { getAttackEvents } = require("./getAttackEvents");
function lookForInvaders(
  Game,
  wAttackDurationSafeCheck,
  nRm,
  Memory,
  northAttackerId,
  eRm,
  eastAttackerId,
  wRm,
  westAttackerId,
  sAttackDurationSafeCheck,
  rm,
  invaderId,
  getEventLog,
  EVENT_ATTACK,
  invader,
  enAvail,
  Spawn1,
  spawnCreep,
  ATTACK,
  MOVE,
  BOTTOM,
  BOTTOM_RIGHT
) {
  if (nRm && (!northAttack || Game.time >= wAttackDurationSafeCheck)) {
    northAttackerId = getAttackEvents(nRm);
    Memory.northAttackerId = northAttackerId;
    if (northAttackerId) {
      nAttackDurationSafeCheck = Game.time + 1000;
      console.log("nAttacker:" + northAttackerId);
    }
  }
  if (eRm && (!eastAttack || Game.time >= wAttackDurationSafeCheck)) {
    eastAttackerId = getAttackEvents(eRm);
    Memory.eastAttackerId = eastAttackerId;
    if (eastAttackerId) {
      eAttackDurationSafeCheck = Game.time + 1000;
      console.log("eAttacker:" + eastAttackerId);
    }
  }
  if (wRm && (!westAttack || Game.time >= wAttackDurationSafeCheck)) {
    westAttackerId = getAttackEvents(wRm);
    Memory.westAttackerId = westAttackerId;
    if (westAttackerId) {
      wAttackDurationSafeCheck = Game.time + 1000;
      console.log("wAttacker:" + westAttackerId);
    }
  }
  if (rm && (!invader || Game.time >= sAttackDurationSafeCheck)) {
    invaderId = getAttackEvents(rm);
    Memory.invaderId = invaderId;
    if (invaderId) {
      sAttackDurationSafeCheck = Game.time + 1000;
      sAttackDurationSafeCheck = Game.time + 1000;
      console.log("invader:" + invaderId);
    }
  }
  let attackEvent = Object.values(Game.rooms)[0].getEventLog()[0];
  //   console.log(Object.values(Game.rooms)[0])
  if (attackEvent && attackEvent.event == EVENT_ATTACK) {
    let attacker = attackEvent.objectId;
    invader = Game.getObjectById(attacker);
    Memory.invaderId = invader.id;
  }
  if (invader) {
    let attackers = Memory.attackers || [];
    if (enAvail >= 260) {
      let kreep;
      let t = Game.time;
      let name = "a" + t;
      let chosenRole = "a";
      Game.spawns.Spawn1.spawnCreep([ATTACK, ATTACK, MOVE, MOVE], name, {
        memory: { role: chosenRole },
        directions: [BOTTOM, BOTTOM_RIGHT]
      });
      attackers.push(name);
    }
    Memory.attackers = attackers;
  }
}

module.exports = lookForInvaders;
