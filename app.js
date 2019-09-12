const path = require('path')
const moment = require('moment')

const express = require('express')
const apicache = require('apicache')
const talkback = require('talkback')

const middleware_cors = require('cors')
const middleware_proxy = require('http-proxy-middleware')
const middleware_cache = apicache.middleware()

const config = require('./config')
const local = config.local
const remote = config.remotes.find(r => r.env === config.env)
const cache = config.cache
const record = config.record

let listener = express()

listener.options('*', middleware_cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: true,
    maxAge: 86400,
    optionsSuccessStatus: 200,
    preflightContinue: false
}))
console.log('CORS preflight enabled')

listener.use(middleware_cors({
    credentials: true,
    origin: true
}))
console.log('CORS enabled')

if (cache.enable) {
    middleware_cache.options({
        enabled: cache.enable,
        defaultDuration: cache.duration,
        headers: cache.headers,
        headerBlacklist: config.ignoreHeaders,
        statusCodes: cache.statusCodes,
        debug: cache.debug
    })

    listener.use(middleware_cache)
    console.log('Cache enabled')
}

if (record.enable) {
    const session = record.tapeInSessions
        ? moment().format("YYYY-MM-DD-HH_mm_ss")
        : record.tapeNameWhenNotInSessions

    let recorder = talkback({
        host: remote.uri,
        port: local.port.record,
        path: `tapes/${config.env}/${session}`,
        ignoreHeaders: config.ignoreHeaders,
        record: !record.recapOnly,
        silent: !record.debug,
        summary: record.debug
    })

    recorder.start(() => console.log(
        `Recording on port ${local.port.record}`
    ))

    listener.use(middleware_proxy({
        target: `http://localhost:${local.port.record}`,
        changeOrigin: true,
        ws: true
    }))
    console.log('Proxy enabled')
} else {
    listener.use(middleware_proxy({
        target: remote.uri,
        changeOrigin: true,
        ws: true
    }))
    console.log('Proxy enabled')
}

listener.listen(local.port.listen, () => console.log(
    `Listening on port ${local.port.listen}`
))
