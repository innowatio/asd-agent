import {execSync} from "child_process";
import fs from "fs-extra";

import * as c from "./config";
import getLogger from "./get-logger";
import {getSiteConf} from "./templates/site-conf";

const log = getLogger("asd-generate-conf");

function getRootDirectory (site) {
    return `${c.AGENT_S3_BUCKET_PATH}/${site.domain}/${site.stage}`;
}

function writeAppConfs (sites) {
    sites.forEach(site => {
        if (site.config) {
            const rootDirectory = getRootDirectory(site);
            const appConfig = `window.APP_CONFIG = ${JSON.stringify(site.config, null, 4)};`;
            log.info(`Writing app-config ${appConfig} for ${rootDirectory}`);
            fs.writeFileSync(`${rootDirectory}/app-config.js`, appConfig);
        }
    });
}

function writeNginxConfs (sites) {
    sites.forEach(site => {
        const fullDomain = `${site.stage}.${site.domain}`;
        const rootDirectory = getRootDirectory(site);
        const config = getSiteConf({fullDomain, rootDirectory});
        log.info(`Writing conf for ${fullDomain}`);
        fs.writeFileSync(`${c.NGINX_SITES_PATH}/${fullDomain}.conf`, config, "utf8");
    });
}

log.info("asd-generate-conf started");

// Sync the bucket
log.info(`Syncing S3 bucket ${c.AGENT_S3_BUCKET} to ${c.AGENT_S3_BUCKET_PATH}`);
execSync(`aws s3 sync s3://${c.AGENT_S3_BUCKET} ${c.AGENT_S3_BUCKET_PATH} --region ${c.AGENT_S3_BUCKET_REGION}`);
log.info(`Setting permissions on ${c.AGENT_S3_BUCKET_PATH}`);
execSync(`chmod -R +r ${c.AGENT_S3_BUCKET_PATH}`);
// Read the sites configuration from the bucket
log.info("Reading sites from bucket");
const sites = JSON.parse(
    fs.readFileSync(`${c.AGENT_S3_BUCKET_PATH}/sites.json`, "utf8")
);
// Remove the current configuration
log.info("Removing old confs");
fs.emptyDirSync(c.NGINX_SITES_PATH);
// Write the new configuration
log.info("Writing new confs");
writeNginxConfs(sites);

// Write app-config file
writeAppConfs(sites);

// Reload nginx
log.info("Reloading nginx");
execSync("service nginx reload");

log.info("asd-generate-conf ended successfully");
