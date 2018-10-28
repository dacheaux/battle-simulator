const colors = [
	['Red', '\x1b[31m'],
	['Green', '\x1b[32m'],
	['Yellow', '\x1b[33m'],
	['Blue', '\x1b[34m'],
	['Magenta', '\x1b[35m'],
];

class Unit {
	constructor(name, color) {
		this.health = 100;
		this.attackDmg = this.damage;
		this.name = name;
		this.color = color;
		this.message = '';
	}

	get rechargeTime() {
		return (1000 * this.health) / 100;
	}

	get damage() {
		return this.health / 100;
	}

	get criticalChance() {
		return 10 - this.health / 10;
	}

	logAttack(enemy, fighters) {
		const reset = '\x1b[0m';
		const {
			name, color, message, health, attackDmg,
		} = this;
		const unitInfo = `${message}${color}${name} (${health.toFixed(
			2
		)} HP)`;
		const enemyInfo = `${enemy.color}${
			enemy.name
		} (${enemy.health.toFixed(2)} HP)`;
		console.log(
			`${unitInfo} ${reset}hit ${enemyInfo} ${reset}for ${attackDmg.toFixed(
				2
			)} damage`
		);
		if (enemy.health <= 0) {
			const fightersLeft = fighters.filter(f => f.health > 0);
			console.log(`${reset}***Unit ${enemy.name} died***`);
			console.log(`${name} destroyed ${enemy.name}`);
			console.log(`There are ${fightersLeft.length} fighter(s) still left`);
		}
	}

	doDamage() {
		const critical = this.criticalChance >= Math.floor(Math.random() * 101);
		if (critical) {
			this.attackDmg = this.damage * 2;
			this.message = 'CRITICAL! ';
		} else {
			this.attackDmg = this.damage;
			this.message = '';
		}
	}

	receiveDamage(dmg) {
		this.health -= dmg;
		if (this.health <= 0) {
			clearInterval(this.inter);
		}
	}

	attack(fighters) {
		this.inter = setInterval(() => {
			const enemies = fighters.filter(f => f !== this && f.health > 0);
			if (!enemies.length) {
				console.log(`${this.name} WON THE ROUND!`);
				clearInterval(this.inter);
			} else {
				const enemy = enemies[Math.floor(Math.random() * enemies.length)];
				this.doDamage();
				enemy.receiveDamage(this.attackDmg);
				this.logAttack(enemy, fighters);
				clearInterval(this.inter);
				if (this.health > 0 && fighters.length > 1) {
					this.attack(fighters);
				}
			}
		}, this.rechargeTime);
	}
}

const fighters = colors.map(([name, color]) => new Unit(name, color));

fighters.forEach(f => f.attack(fighters));
