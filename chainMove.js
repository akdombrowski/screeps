function changeRoleAssignments(creeps, role) {
  /** spawn builder creep **/
  let creep;
  for (creep in creeps) {
    creeps.memory.role = role;
  }
};

module.exports = changeRoleAssignments;
