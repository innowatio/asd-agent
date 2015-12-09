import {exec} from "child_process";

const LOCK = {
    active: false
};

export default function updateSites (req, res) {
    // Respond a 202 right away
    res.status(202).send();
    if (LOCK.active) {
        req.log.info("Ignoring update request, generation still pending");
        return;
    }
    LOCK.active = true;
    // Spawn sites conf regeneration
    exec("asd-generate-conf", err => {
        LOCK.active = false;
        if (err) {
            req.log.error(err, "Error generating conf");
        } else {
            req.log.info("Conf generated successfully");
        }
    });
}
