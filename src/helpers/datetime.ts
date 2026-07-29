export function formatDate(date: Date, timeZone = "America/Argentina/Buenos_Aires") {

    const parts = new Intl.DateTimeFormat("sv-SE", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZoneName: "longOffset",
    }).formatToParts(date);

    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));

    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${p.timeZoneName.replace("GMT", "").replace(/\u2212/g, "-")}`;
}
