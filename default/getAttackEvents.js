function getAttackEvents(room) {
  let eventLog;
  let attackEvents;
  let attackerId;
  if (room) {
    eventLog = room.getEventLog();
    attackEvents = _.filter(eventLog, { event: EVENT_ATTACK });
  }
  if (attackEvents) {
    attackEvents.forEach(event => {
      let target = Game.getObjectById(event.objectId);
      attackerId = event.ObjectId;
      console.log("attacker: " + target.name);
    });
  }
  return attackerId;
}
module.exports = getAttackEvents;
