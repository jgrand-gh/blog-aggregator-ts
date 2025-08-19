export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;

    const match = durationStr.match(regex);
    if (!match || match.length !== 3) {
        throw new Error("failed to parse a period of time from the argument")
    }

    const timeAmount = parseInt(match[1]);
    const timeUnit = match[2];

    switch (timeUnit) {
        case "h":
            return timeAmount * 1000 * 60 * 60;
        case "m":
            return timeAmount * 1000 * 60;
        case "s":
            return timeAmount * 1000;
        default:
            return timeAmount;
    }
}

export function formatTime(durationInMs: number) {
    let hours = 0;
    while (durationInMs > (1000 * 60 * 60)) {
        durationInMs -= (1000 * 60 * 60);
        hours++;
    }

    let minutes = 0;
    while (durationInMs > (1000 * 60)) {
        durationInMs -= (1000 * 60);
        minutes++;
    }

    let seconds = 0;
    while (durationInMs > 1000) {
        durationInMs -= 1000;
        seconds++;
    }

    let timeString = "";
    if (hours > 0) { timeString = timeString.concat(`${hours}h`); }
    if (minutes > 0) { timeString = timeString.concat(`${minutes}m`); }
    if (seconds > 0) { timeString = timeString.concat(`${seconds}s`); }
    timeString = timeString.concat(`${durationInMs}ms`);

    return timeString;
}

export function handleError(err: unknown) {
    console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}