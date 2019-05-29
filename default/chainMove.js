function chainMove(puller, creeps, dest, rng) {
  /** creep chain moving **/
  let creep;
  puller.moveTo(dest, {reusePath: 500, range: rng, visualize: {stroke: "#ffffff"}});
  for (creep in creeps) {
    puller.pull(creep);
    creep.move(puller);
  }
};

module.exports = chainMove;
