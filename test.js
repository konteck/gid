var gid = require('./lib/gid');

gid.getID({ template: ['time', 'seq', 'node1'] }, function (id) {
    console.log(id);
});