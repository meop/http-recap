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