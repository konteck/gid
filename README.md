# GID

Genuine ID Generator.

[![Build Status](https://travis-ci.org/konteck/gid.png)](https://travis-ci.org/konteck/gid)

## Installation

    $ npm install gid -g

## Features

  * REST interface that listen for both GET and POST requests
  * Command line ID generation support
  * Can be required from node.js code itself
  * You can specify custom ID template for every newly generated ID
  * ID returned as string so can have any complexity and as well as length

## Usage

Run as standalone server

    gid --server --port=8080 --template={time}{seq} --epoch=01-01-2010

Request ID via CURL

    curl http://127.0.0.1:8080/?template={guid1}

Call from node.js code

    var gid = require('gid');

    gid.getID({ template: ['time', 'seq'] }, function(id){ console.log(id); }); // Asynchronously generate new ID

    gid.start({ port: 8080 }); // or run as server with same options

Generate new ID from command line

    gid --get_id

## Template

Its possible to use any character in generated ID additional to predefined keywords:

    {time}  - passed time since epoch in seconds
    {seq}   - sequence number: will prevent same second ID collision
    {guid1} - generate and return a RFC4122 v1 (timestamp-based) UUID
    {guid4} - generate and return a RFC4122 v4 UUID
    {rand}  - generate 4 symbol random number

## License 

(The MIT License)

Copyright (c) 2014 Alex Movsisyan

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/konteck/gid/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

