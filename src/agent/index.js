import bodyParser from "body-parser";
import bunyanRequest from "bunyan-request";
import express from "express";

import * as c from "../config";
import log from "./log";
import sns from "./sns";
import updateSites from "./update-sites";

express()
    .use(bodyParser.text())
    .use(bunyanRequest({
        logger: log
    }))
    .use(sns({
        agentHostname: c.AGENT_HOSTNAME,
        snsTopicArn: c.AGENT_SNS_TOPIC_ARN,
        log: log
    }))
    .post("/update-sites", updateSites)
    .listen(c.AGENT_PORT, () => {
        log.info(`asd-agent listening on port ${c.AGENT_PORT}`);
    });
