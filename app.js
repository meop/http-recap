import dayjs from 'dayjs'
import express from 'express'
import { options } from 'apicache'

import middleware_cors from 'cors'
import middleware_proxy from 'http-proxy-middleware'

import talkback from 'talkback'
import {
    cache,
    local,
    proxy,
    record,
    remote,
} from './config'


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
    const session = record.useSessions
        ? dayjs().format("YYYY-MM-DD-HH_mm_ss")
        : 'current'

    let recorder = talkback({
        host: remote.uri,
        port: local.port.record,
        path: `tapes/${env}/${session}`,
        ignoreHeaders: record.ignoreHeaders,
        ignoreBody: record.ignoreBody,
        record: record.recordMode
            ? talkback.Options.RecordMode.NEW
            : talkback.Options.RecordMode.DISABLED,
        fallbackMode: record.fallbackMode
            ? talkback.Options.FallbackMode.PROXY
            : talkback.Options.FallbackMode.NOT_FOUND,
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
        logLevel: proxy.logLevel
    })
)
console.log(`Proxy to (${uri}) enabled`)

listener.listen(
    local.port.listen, () => console.log(
        `Listening on port ${local.port.listen}`
    )
)
