module.exports = {
    env : 'tst',
    proxyLogLevel: 'warn',
    cache: {
        enable: true,
        duration: '20 minutes',
        ignoreHeaders: [
            'accept',
            'accept-encoding',
            'accept-language',
            'cookie',
            'dnt',
            'user-agent',
            'x-requested-with'
        ],
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
            'pragma': 'no-cache'
        },
        statusCodes: {
            include: [200],
            exclude: []
        },
        debug: true
    },
    record: {
        enable: true,
        ignoreHeaders: [
            'accept',
            'accept-encoding',
            'accept-language',
            'cache-control',
            'connection',
            'content-length',
            'cookie',
            'csgwprddc',
            'dnt',
            'max-forwards',
            'origin',
            'pragma',
            'referer',
            'user-agent',
            'x-arr-log-id',
            'x-forwarded-for',
            'x-original-url',
            'x-requested-with'
        ],
        ignoreBody: false,
        recapOnly: false,
        fallbackWhenRecapOnly: true,
        tapeInSessions: true,
        tapeToUseWhenNotInSessions: 'current',
        debug: true
    },
    local: {
        port: {
            listen: 3333,
            record: 3334
        }
    },
    remotes : [
        {
            env: 'local',
            uri: 'http://localhost:9999'
        },
        {
            env: 'dev',
            uri: 'http://dev.somewhere.com'
        },
        {
            env: 'tst',
            uri: 'https://tst.somewhere.com'
        }
    ]
};
