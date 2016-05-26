import {execSync} from "child_process";
import fs from "fs-extra";

import * as c from "./config";
import getLogger from "./get-logger";
import {getSiteConf} from "./templates/site-conf";

const log = getLogger("asd-generate-conf");

function getRootDirectory (site) {
    return `${c.AGENT_S3_BUCKET_PATH}/${site.domain}/${site.stage}`;
}

function writeAppConfs (sites, defaultSitesConfig) {
    sites.forEach(site => {
        const rootDirectory = getRootDirectory(site);
        var appConfig = null;
        if (site.config) {
            appConfig = `window.APP_CONFIG = ${JSON.stringify(site.config, null, 4)};`;
            log.info(`Writing app-config file with ${appConfig} for ${rootDirectory}`);
            fs.writeFileSync(`${rootDirectory}/app-config.js`, appConfig);
        } else {
            appConfig = `window.APP_CONFIG = ${JSON.stringify(defaultSitesConfig, null, 4)};`;
            log.info(`Writing app-config file with default config ${defaultSitesConfig} for ${rootDirectory}`);
        }
        fs.writeFileSync(`${rootDirectory}/app-config.js`, appConfig);
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
const sitesFile = JSON.parse(
    fs.readFileSync(`${c.AGENT_S3_BUCKET_PATH}/sites.json`, "utf8")
);
const sites = sitesFile.sites;
const defaultSitesConfig = sitesFile.defaultConfig;
// Remove the current configuration
log.info("Removing old confs");
fs.emptyDirSync(c.NGINX_SITES_PATH);
// Write the new configuration
log.info("Writing new confs");
writeNginxConfs(sites);

// Write app-config file
log.info("Writing new app confs");
writeAppConfs(sites, defaultSitesConfig);

// Reload nginx
log.info("Reloading nginx");
execSync("service nginx reload");

log.info("asd-generate-conf ended successfully");
