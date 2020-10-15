module.exports = {
	createDateAsUTC(date) {
		date = new Date(date)
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours() + 7,
			date.getMinutes(),
			date.getSeconds()
		);
	}
};
