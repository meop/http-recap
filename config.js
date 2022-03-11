export const cache = {
    enable: true,
    duration: '20 minutes',
    ignoreHeaders: [
        'accept',
        'accept-encoding',
        'accept-language',
        'cookie',
        'dnt',
        'user-agent'
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
}
export const proxy = {
    logLevel: 'warn',
}
export const record = {
    enable: true,
    fallbackMode: true,
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
        'x-client-ip',
        'x-forwarded-for',
        'x-original-url',
        'x-requested-with'
    ],
    ignoreBody: true,
    recordMode: true,
    useSessions: false,
    debug: true
}
export const local = {
    port: {
        listen: 3333,
        record: 3334
    }
}
export const remotes = {
    'local': 'http://localhost:9999',
    'dev': 'http://dev.somewhere.com',
    'tst': 'https://tst.somewhere.com',
}
export const remote = remotes['tst']
