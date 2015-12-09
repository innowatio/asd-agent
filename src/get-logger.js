import bunyan from "bunyan";

import * as c from "./config";

export default function getLogger (name) {
    return bunyan.createLogger({
        name,
        streams: [
            {
                path: `${c.AGENT_LOG_PATH}/${name}.log`
            },
            {
                stream: process.stdout
            }
        ]
    });
}
