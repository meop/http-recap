module.exports = {
    env : 'tst',
    ignoreHeaders: [
        'x-arr-log-id',
        'x-forwarded-for',
        'x-original-url',
        'x-requested-with',
        'user-agent',
        'referer',
        'max-forwards',
        'csgwprddc',
        'dnt',
        'origin',
        'cookie',
        'accept-language',
        'accept-encoding',
        'accept',
        'content-length',
        'connection',
        'cache-control',
        'pragma'
    ],
    cache: {
        enable: false,
        duration: '20 minutes',
        headers: { },
        statusCodes: {
            include: [200],
            exclude: []
        },
        debug: true
    },
    record: {
        enable: true,
        recapOnly: false,
        tapeInSessions: true,
        tapeNameWhenNotInSessions: 'current',
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
