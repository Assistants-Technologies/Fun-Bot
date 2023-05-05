import { CronJob } from "cron"

export default function () {
    const job = new CronJob(
        "0 0 0 * * *",
        () => {
            console.log("WOTD")
        },
        null,
        true,
        "Europe/London"
    )

    job.start()
}
