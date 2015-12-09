import bunyan from "bunyan";
import fs from "fs-extra";

import * as c from "./config";

export default function getLogger (name) {
    fs.mkdirpSync(c.AGENT_LOG_PATH);
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
