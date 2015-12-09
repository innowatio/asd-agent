#!/usr/bin/env node

require("babel-register")({
    ignore: /node_modules\/(?!asd-agent)/
});
require("../src/setup");
