import bunyan from "bunyan";
import fs from "fs-extra";

import * as c from "./config";
import {getNginxConf} from "./templates/nginx-conf";
import {getMimeTypes} from "./templates/mime-types";

const log = bunyan.createLogger({name: "asd-setup"});

log.info("asd-setup started");

/*
*   nginx
*/
log.info("Setting up nginx");
// Setup directories
log.info(`Emptying directory ${c.NGINX_BASE_PATH}`);
fs.emptyDirSync(c.NGINX_BASE_PATH);
log.info(`Emptying directory ${c.NGINX_LOG_PATH}`);
fs.emptyDirSync(c.NGINX_LOG_PATH);
log.info(`Emptying directory ${c.NGINX_SITES_PATH}`);
fs.emptyDirSync(c.NGINX_SITES_PATH);
// Generate conf files
log.info(`Writing conf file ${c.NGINX_CONF_PATH}`);
fs.writeFileSync(c.NGINX_CONF_PATH, getNginxConf(), "utf8");
log.info(`Writing conf file ${c.NGINX_MIME_TYPES_PATH}`);
fs.writeFileSync(c.NGINX_MIME_TYPES_PATH, getMimeTypes(), "utf8");

/*
*   asd-agent
*/
log.info("Setting up asd-agent");
// Setup directories
log.info(`Emptying directory ${c.AGENT_BASE_PATH}`);
fs.emptyDirSync(c.AGENT_BASE_PATH);
log.info(`Emptying directory ${c.AGENT_S3_BUCKET_PATH}`);
fs.emptyDirSync(c.AGENT_S3_BUCKET_PATH);

log.info("asd-setup ended successfully");
