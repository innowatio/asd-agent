#!/usr/bin/env node

const forever = require("forever");
forever.startDaemon("../lib/agent/");
