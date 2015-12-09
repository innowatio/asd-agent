import {execSync} from "child_process";
import os from "os";

function getAgentHostname () {
    return (
        process.env.HOSTNAME ||
        execSync("curl http://169.254.169.254/latest/meta-data/public-ipv4")
    );
}

function getBucketRegion (bucket) {
    const out = execSync(`aws s3api get-bucket-location --bucket ${bucket}`);
    return JSON.parse(out.toString()).LocationConstraint;
}

/*
*   Nginx config
*/
export const NGINX_CPU_CORES          = os.cpus().length;
export const NGINX_WORKER_CONNECTIONS = 8192;
export const NGINX_BASE_PATH          = "/etc/nginx";
export const NGINX_LOG_PATH           = "/var/log/nginx";
export const NGINX_MIME_TYPES_PATH    = `${NGINX_BASE_PATH}/mime.types`;
export const NGINX_CONF_PATH          = `${NGINX_BASE_PATH}/nginx.conf`;
export const NGINX_SITES_PATH         = `${NGINX_BASE_PATH}/sites`;

/*
*   asd-agent config
*/
export const AGENT_HOSTNAME         = getAgentHostname();
export const AGENT_PORT             = 34051;
export const AGENT_SNS_TOPIC_ARN    = process.env.SNS_TOPIC_ARN;
export const AGENT_S3_BUCKET        = process.env.S3_BUCKET;
export const AGENT_S3_BUCKET_REGION = getBucketRegion(AGENT_S3_BUCKET);
export const AGENT_BASE_PATH        = "/opt/asd-agent";
export const AGENT_S3_BUCKET_PATH   = `${AGENT_BASE_PATH}/s3-bucket`;
