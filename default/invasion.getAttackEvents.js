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
      if (target && !target.my) {
        attackerId = target.id;
        Game.notify("attack event: " + attackerId + " in " + room);
      }
    });
  }

  return attackerId;
}
module.exports = getAttackEvents;
