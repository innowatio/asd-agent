import axios from "axios";
import {SNS} from "aws-sdk";
import {resolve, promisifyAll} from "bluebird";
import exit from "exit";
import MessageValidator from "sns-validator";

function getTopicRegion (snsTopicArn) {
    return snsTopicArn.split(":")[3];
}

function subscribe ({agentHostname, snsTopicArn, log}) {
    log.info(`Subscribing to SNS topic ${snsTopicArn}`);
    const sns = promisifyAll(
        new SNS({apiVersion: "2010-03-31", region: getTopicRegion(snsTopicArn)})
    );
    return resolve()
        .then(() => {
            return sns.subscribeAsync({
                Protocol: "http",
                TopicArn: snsTopicArn,
                Endpoint: `http://${agentHostname}:34051/update-sites`
            });
        })
        .then(() => {
            log.info(`Subscribed to SNS topic ${snsTopicArn}, waiting for confirmation`);
        })
        .catch(err => {
            log.fatal(err, `Unable to subscribe to SNS topic ${snsTopicArn}`);
            exit(1);
        });
}

export default function middleware ({agentHostname, snsTopicArn, log}) {
    subscribe({agentHostname, snsTopicArn, log});
    const validator = new MessageValidator();
    return (req, res, next) => {
        if (!req.headers["x-amz-sns-message-type"]) {
            req.log.info("Unauthorized request: missing x-amz-sns-message-type");
            return res.status(401).send("Missing x-amz-sns-message-type");
        }
        if (req.headers["x-amz-sns-topic-arn"] !== snsTopicArn) {
            req.log.info("Unauthorized request: invalid x-amz-sns-topic-arn");
            return res.status(401).send("Invalid x-amz-sns-topic-arn");
        }
        /*
        *   SNS requests are sent with `Content-Type: text/plain` (see
        *   https://goo.gl/rZaFZ1) so the body can't be automatically parsed.
        */
        const parseBody = JSON.parse(req.body);
        validator.validate(parseBody, (err, body) => {
            if (err) {
                req.log.info(err, "Unauthorized request: invalid signature");
                return res.status(401).send("Invalid signature");
            }
            if (body.Type === "SubscriptionConfirmation") {
                axios.get(body.SubscribeURL)
                    .then(() => {
                        req.log.info("Confirmed subscription to SNS topic");
                    })
                    .catch(confirmationError => {
                        req.log.fatal({confirmationError}, "Error confirming subscription to SNS topic");
                        exit(1);
                    });
                req.log.info("SubscriptionConfirmation request");
                return res.status(204).send();
            }
            next();
        });
    };
}
