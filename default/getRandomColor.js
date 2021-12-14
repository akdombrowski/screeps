function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#f";
  for (var i = 0; i < 5; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = getRandomColor;
