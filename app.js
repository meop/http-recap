import dayjs from 'dayjs'
import express from 'express'
import { options } from 'apicache'

import middleware_cors from 'cors'
import middleware_proxy from 'http-proxy-middleware'

import talkback from 'talkback'
import { local as _local, remotes, env, cache as _cache, record as _record, proxyLogLevel } from './config'

const local = _local
const remote = remotes.find(r => r.env === env)
const cache = _cache
const record = _record

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
    const middleware_cache = options({
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
        ? dayjs().format("YYYY-MM-DD-HH_mm_ss")
        : record.tapeToUseWhenNotInSessions

    let recorder = talkback({
        host: remote.uri,
        port: local.port.record,
        path: `tapes/${env}/${session}`,
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
        logLevel: proxyLogLevel
    })
)
console.log(`Proxy to (${uri}) enabled`)

listener.listen(
    local.port.listen, () => console.log(
        `Listening on port ${local.port.listen}`
    )
)
