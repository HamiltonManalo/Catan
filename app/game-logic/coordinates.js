module.exports = Coordinates;

function Coordinates(xPos, yPos, angle) {
	var that = {};
	that.x = xPos;
	that.y = yPos
	if (angle) {that.angle = angle};
	return that;
};