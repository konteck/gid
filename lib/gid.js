var restify = require('restify');
var optimist = require('optimist');
var util = require('util');

var lastSeqTime, lastSeq = 0;

var options = {
    port: 8080,
    epoch: new Date('01-01-2010').getTime(),
    template: [
        'time',
        'seq'
    ]
}

var generators = {
    time: function (id, opt, cb) {
        id += Math.floor((new Date().getTime() - opt.epoch) / 1000);

        cb(id);
    },
    seq: function (id, opt, cb) {
        var time = Math.floor(new Date().getTime() / 1000);

        if (new Date().getTime() == lastSeqTime) {
            if (lastSeq > 99) {
                console.log('Seq overflow. Holding up id generation until next clock tick.');

                while (true) {
                    if (Math.floor(new Date().getTime() / 1000) > lastSeqTime) break;
                }
            }

            id += padNumber((lastSeq++).toString(), 2);
        } else {
            id += padNumber('0', 2)
            lastSeq = 0;
        }

        lastSeqTime = time;

        cb(id);
    }
}

function padNumber(str, length) {
    while (str.length < length)
        str += '0';

    return str;
}

function genQueue(opt, id, cb) {
    if (opt.template.length) {
        var t = opt.template.shift();

        if (t in generators) {
            generators[t](id, opt, function (id) {
                genQueue(opt, id, cb);
            });
        } else {
            id += t;
            genQueue(opt, id, cb);
        }
    } else {
        cb(id);
    }
}

function getID(opt, cb) {
    var id = '', opt = opt || {};

    for (var i in options) {
        if (options.hasOwnProperty(i) && !opt[i]) {
            opt[i] = options[i];
        }
    }

    genQueue(opt, id, cb);
}

// REST server
var server = restify.createServer();
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());
server.get('/', function (req, res) {
    var opt = {};

    if (req.query.template) {
        opt.template = req.query.template.split(/[{}]+/);
    }

    if (req.query.epoch) {
        opt.epoch = new Date(req.query.epoch).getTime();
    }

    getID(opt, function (id) {
        res.send({
            status: "success",
            id: id,
            time: new Date().toISOString()
        });
    });
});
server.post('/', function (req, res) {
    var opt = {};

    if (req.body.template) {
        opt.template = req.body.template.split(/[{}]+/);
    }

    if (req.body.epoch) {
        opt.epoch = new Date(req.body.epoch).getTime();
    }

    getID(opt, function (id) {
        res.send({
            status: "success",
            id: id,
            time: new Date().toISOString()
        });
    });
});

function start(opt) {
    server.listen((opt || options).port, function () {
        console.log('Listening on %s with pleasure', server.url);
    });
}

function help() {
    var data = [
        'usage: gid [arguments]',
        'arguments:',
        '  --server                 Run REST server on default 8080 port',
        '  --get_id                 Generate ID and print to console',
        '  --port=8080              Set custom server port',
        '  --template={time}{seq}   Override default ID generation format',
        '  --epoch=01-01-2010       Set custom epoch start date',
        '  --help                   Print this message'
    ];

    console.log(data.join('\n'));
}

function cli() {
    // Custom options
    var opt = {};

    if (optimist.argv.template) {
        opt.template = optimist.argv.template.split(/[{}]+/);
    }

    if (optimist.argv.epoch) {
        opt.epoch = new Date(optimist.argv.epoch).getTime();
    }

    if (optimist.argv.port) {
        opt.port = parseInt(optimist.argv.port);
    }

    if (optimist.argv.server) {
        start(opt);
    } else if (optimist.argv.get_id) {
        getID(opt, function (id) {
            console.log(id);
        });
    } else {
        help();
    }
}

module.exports.getID = getID;
module.exports.start = start;
module.exports.cli = cli;