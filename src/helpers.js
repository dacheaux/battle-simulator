function shuffle(arr) {
	let n = arr.length; let i; let
		tmp;
	const shuffled = [...arr];
	while (n > 0) {
		n -= 1;
		i = Math.floor(n * Math.random());
		tmp = shuffled[i];
		shuffled[i] = shuffled[n];
		shuffled[n] = tmp;
	}
	return shuffled;
}

function clone(obj) {
	return Object.create({}, Object.getOwnPropertyDescriptors(obj));
}

module.exports = {
	shuffle,
	clone,
};
