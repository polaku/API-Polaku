var cron = require('node-cron');

console.log('Before job instantiation', new Date());
var task = cron.schedule('1 54 10 26 9 * 2019', () => {
    console.log('stoped task', new Date());
}, {
    scheduled: false
});
console.log('After job instantiation', new Date());

task.start();