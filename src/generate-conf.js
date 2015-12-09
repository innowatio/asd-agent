import {execSync} from "child_process";
import fs from "fs-extra";

import * as c from "./config";
import {getSiteConf} from "./templates/site-conf";

function writeNginxConfs (sites) {
    sites.forEach(site => {
        const fullDomain = `${site.stage}.${site.domain}`;
        const rootDirectory = `${c.AGENT_S3_BUCKET_PATH}/${site.domain}/${site.stage}`;
        const config = getSiteConf({fullDomain, rootDirectory});
        fs.writeFileSync(`${c.NGINX_SITES_PATH}/${fullDomain}.conf`, config, "utf8");
    });
}

// Sync the bucket
execSync(`aws s3 sync s3://${c.AGENT_S3_BUCKET} ${c.AGENT_S3_BUCKET_PATH} --region ${c.AGENT_S3_BUCKET_REGION}`);
execSync(`chmod -R +r ${c.AGENT_S3_BUCKET_PATH}`);
// Read the sites configuration from the bucket
const sites = JSON.parse(
    fs.readFileSync(`${c.AGENT_S3_BUCKET_PATH}/sites.json`, "utf8")
);
// Remove the current configuration
fs.emptyDirSync(c.NGINX_SITES_PATH);
// Write the new configuration
writeNginxConfs(sites);
// Reload nginx
execSync(`service nginx reload`);
