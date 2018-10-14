const { shuffle, clone } = require('./helpers');

const colors = [
	['Red', '\x1b[31m'],
	['Green', '\x1b[32m'],
	['Yellow', '\x1b[33m'],
	['Blue', '\x1b[1;34m'],
	['Magenta', '\x1b[35m'],
];
const reset = '\x1b[0m';

const basicFighter = {
	health: 100,
	get rechargeTime() {
		return (1000 * this.health) / 100;
	},
	get damage() {
		return this.health / 100;
	},
	get criticalChance() {
		return 10 - this.health / 10;
	},
};

const fighters = colors.map(([name, color]) => (
	Object.assign(clone(basicFighter), { name, color })
));
const shuffledFighters = shuffle(fighters);

const attack = (unit) => {
	const { name, color, health } = unit;
	const unitIndex = fighters.indexOf(unit);

	if (fighters.length < 2) {
		clearInterval(unit.fight);
		console.log(`${name} WON THE ROUND!`);
		return;
	}
	const indexes = fighters.reduce(
		(acc, v, i) => (i !== unitIndex ? [...acc, i] : acc),
		[]
	);
	const enemyIndex = indexes[Math.floor(Math.random() * indexes.length)];
	const enemy = fighters[enemyIndex];

	const critical = unit.criticalChance >= Math.floor(Math.random() * 101)
		? 'CRITICAL! '
		: '';

	const damage = critical ? unit.damage * 2 : unit.damage;
	const unitString = `${critical}${color}${name} (${health.toFixed(2)} HP)`;

	const enemyString = `${enemy.color}${enemy.name} (${enemy.health.toFixed(
		2
	)} HP)`;
	console.log(
		`${unitString} ${reset}hit ${enemyString} ${reset}for ${damage.toFixed(
			2
		)} damage`
	);
	enemy.health -= damage;
	if (enemy.health <= 0) {
		clearInterval(enemy.fight);
		fighters.splice(fighters.indexOf(enemy), 1);
		console.log(`${reset}***Unit ${enemy.name} dieded***`);
		console.log(`${name} destroyed ${enemy.name}`);
		console.log(`There are ${fighters.length} fighters still left`);
	}
};

const fight = () => shuffledFighters.forEach((unit) => {
	unit.fight = setInterval(() => attack(unit), unit.rechargeTime);
});

fight();
