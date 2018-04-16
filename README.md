# Http-Recap

Inspired by the Ruby gem VCR, which can record and playback HTTP traffic.
There are many use cases for this, and many clones in different languages and for different platforms that are based on this popular library.
They differ in small ways from each other as well, like specifying arguments on command line or using config files, adding extra functionality etc.

## Design

This project is a standlone Http server which proxies requests to a modified version of Nodejs Talkback library (which was inspired by Flickr's Yakbak library).

There were other candicate libraries out there as well, like the independent Node-replay or LinkedIn's Sepia (and its fork), but they either specified their arguments on the command line or were out of date or had other bugs.

## Supported Use Cases

* Toggle of Caching Http Get methods
* Tuning Http Caching to include or exclude specific status codes
* Toggle of Recording all Http methods
* Session support for Recording
* Toggle Replay only mode vs Capture mode
* Toggle Fallback to server when Replay only, or return 404
* Toggle use Request body to find matches or not
* Blacklisting Http Request Headers for Cache or Record modes

## Guidance

You can use pure caching in combination with replaying records, but in practice it may not really add much performance benefits unless you are NOT recording, since the recorder caches and searches through records on its own. Unless there are a ton of records, it is probably already pretty fast.

Probably you would find most use out of this library for:

1. Caching by itself and tweaking the parameters, or opening up the code and changing handlers to cache only certain routes you care about.
2. Recording in a session and then doing development work for an hour or two, and testing your code across a few browers with the same known, cached data, then discarding the session.
3. Recording, without sessions, without request body matching, and putting in place some stubs for UI work on unfinished API work. This way stubs are not in either your UI or API project! And they can last indefinitely!
4. Creating different named tapes for yourself if you need to switch back and forth between work.

If you want to use it for actually integration testing the API layer, which is another common use case for tools like this, you should probably just check out Node-replay or similar preexisting library.. since they are optimized for that use case already.

## Configuring

### Cache

The Apicache library allows setting headers.

By default this project sets 'cache-control' and 'pragma', in order to force the browser to refer back to this library for new content.. that way you won't be confused why this cache is not hit, by forcing the browser to not be allowed to do its own caching.

### Record

The Talkback library uses headers 'content-type' and 'content-encoding' to decided if request/response body is 'human readable'.

So do not blacklist 'content-type', or it will be missing in the tape, and matches will never be found!

## Installing

> yarn install

## Running

> node app.js

## Comments about underlying libraries

### cors

Sane Express middleware design.
Good documentation.
Works fine.

### http-proxy-middleware

Sane Express middleware design.
Good documentation.
Works fine.

### apicache

Very strange Express middleware design.

Bugs / Undocumented behavior for options configuration. Readme makes it seem like all options are interchangeable between being global or local options, but through exploring the code seeing startup errors, they are definitely not.

For example, 'debug' is actually only functional as a global option

Also, default example of how to use it as an Express middlware for all routes will lead you to caching Http Post and other methods. Obviously, this is a no-no. So you have to set it up for Get routes only.

### talkback

Talkback is a clean, simple library. The one downside is that unlike its inspiration, YakBak, it is not capable of being an Express Middleware; instead it is designed to be its own standalone Http server. So this means one additional port and some small overhead on the host. But the pros are JSON5 format (JSON with comments and other features), simple config options and reduced complexity.
