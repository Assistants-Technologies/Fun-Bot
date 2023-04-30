import { CronJob } from "cron"

export default function () {
    const job = new CronJob(
        process.env.WOTD_CRON as string,
        () => {
            console.log("WOTD")
        },
        null,
        true,
        "America/New_York"
    )

    job.start()
}
