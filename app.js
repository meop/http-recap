const path = require('path')
const moment = require('moment')

const express = require('express')
const apicache = require('apicache')

const middleware_cors = require('cors')
const middleware_proxy = require('http-proxy-middleware')

const talkback = require('talkback')
const config = require('./config')

const local = config.local
const remote = config.remotes.find(r => r.env === config.env)
const cache = config.cache
const record = config.record

let listener = express()

listener.options('*',
    middleware_cors({
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        origin: true,
        maxAge: 86400,
        optionsSuccessStatus: 200,
        preflightContinue: false
    })
)
console.log('CORS (preflight) enabled')

listener.use(
    middleware_cors({
        credentials: true,
        origin: true
    })
)
console.log('CORS enabled')

if (cache.enable) {
    const middleware_cache = apicache.options({
        debug: cache.debug,
        enabled: cache.enable,
        headerBlacklist: cache.ignoreHeaders,
        headers: cache.headers,
        statusCodes: cache.statusCodes
    }).middleware

    listener.get('*',
        middleware_cache(
            cache.duration
        )
    )
    console.log(`Cache enabled`)
}

if (record.enable) {
    const session = record.tapeInSessions
        ? moment().format("YYYY-MM-DD-HH_mm_ss")
        : record.tapeToUseWhenNotInSessions

    let recorder = talkback({
        host: remote.uri,
        port: local.port.record,
        path: `tapes/${config.env}/${session}`,
        ignoreHeaders: record.ignoreHeaders,
        ignoreBody: record.ignoreBody,
        record: !record.recapOnly,
        fallbackMode: record.fallbackMode,
        silent: !record.debug,
        summary: record.debug
    })

    recorder.start(() =>
        console.log(
            `Recording on port ${local.port.record}`
        )
    )
    console.log('Recorder enabled')
}

const uri = record.enable
    ? `http://localhost:${local.port.record}`
    : remote.uri

listener.use(
    middleware_proxy({
        target: uri,
        changeOrigin: true,
        ws: true,
        logLevel: config.proxyLogLevel
    })
)
console.log(`Proxy to (${uri}) enabled`)

listener.listen(
    local.port.listen, () => console.log(
        `Listening on port ${local.port.listen}`
    )
)
