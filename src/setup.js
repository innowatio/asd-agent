import {execSync} from "child_process";
import fs from "fs-extra";

import * as c from "./config";
import {getNginxConf} from "./templates/nginx-conf";
import {getMimeTypes} from "./templates/mime-types";

/*
*   nginx
*/
// Setup directories
fs.emptyDirSync(c.NGINX_BASE_PATH);
fs.emptyDirSync(c.NGINX_LOG_PATH);
fs.emptyDirSync(c.NGINX_SITES_PATH);
// Generate conf files
fs.writeFileSync(c.NGINX_CONF_PATH, getNginxConf(), "utf8");
fs.writeFileSync(c.NGINX_MIME_TYPES_PATH, getMimeTypes(), "utf8");
// Reload nginx
execSync(`service nginx reload`);

/*
*   asd-agent
*/
// Setup directories
fs.emptyDirSync(c.AGENT_BASE_PATH);
fs.emptyDirSync(c.AGENT_S3_BUCKET_PATH);
