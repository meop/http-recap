    // note mporter: this should have been just a white-list
    //  but there is no perfect library out there, and the
    //  JSON5 features and simplicity of this library are cool
    // maybe i will make a pull request some day

    // for the use case of this tool, replaying the same app
    //  in multiple browsers locally, the pds will called with
    //  the same headers that might affect responses, and the others
    //  that would not match do affect responses

    // the library uses headers 'content-type' and 'content-encoding'
    //  to decided if request/response body is 'human readable'
    // so do not skip 'content-type', or it will be missing in the tape,
    //  and tapes will never match!

you may want to add no-cache headers to the response if you want to see the cycle come back to this proxy cache..
ie.. you do not want the default behavior of apicache

debug is actually only functional as a global option
but apicache docs do not make this apparent does not document this