#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
const http = require('http')
const StompServer = require('../stompServer')
const Port = parseInt(argv['P']) || parseInt(argv['port']) || 61614
const Path = argv['path'] || '/stomp'
const Debug = !!(argv['D'] || argv['debug'])
const Host = (argv['H'] !== true || argv['host'] !== true) && (argv['H'] || argv['host']) ? argv['H'] || argv['host'] : 'localhost'
if (argv['H'] || argv['help'] || argv['h']) {
    console.log('Usage: stomp-broker [options]')
    console.log('\nOptions:')
    console.log('\t -P, --port [PORT]\tAssign a port to stomp-broker')
    console.log('\t -path [path]\t\tSet Stomp Path')
    console.log('\t -V, --version\t\tCheck Version of stomp-broker-js')
    console.log('\t -D, --debug\t\tEnable debug mode')
    console.log('\t -H, --host [host]\tSet the host')

    return
}
if (argv['V'] || argv['version']) {
    let { version } = require('../package.json')
    console.log(version)
    return
}

let server = http.createServer()
let stompServer = new StompServer({
    server,
    debug: Debug ?
        function () { console.log(arguments) } :
        function () { }
}
    , Path).start()
stompServer.on('error', function (err) {
    console.error(err)
})
server.listen(Port, `${Host}`, () => {
    if (Debug) {
        console.log(`Service Setup to `)
        console.log(`${Host}:${Port}${Path}`)
    }
})
process.on('SIGINT', () => {
    server.close()
})
