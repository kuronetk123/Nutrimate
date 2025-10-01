function getYouTubeId(url) {
    if (!url) return null
    try {
        const u = new URL(url)
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1)
        if (u.searchParams.get("v")) return u.searchParams.get("v")
        const parts = u.pathname.split("/")
        const ixEmbed = parts.indexOf("embed")
        if (ixEmbed !== -1 && parts[ixEmbed + 1]) return parts[ixEmbed + 1]
        const ixShorts = parts.indexOf("shorts")
        if (ixShorts !== -1 && parts[ixShorts + 1]) return parts[ixShorts + 1]
    } catch { /* fallthrough to regex */ }
    const m = String(url).match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/)
    return m ? m[1] : null
}

function parseYTTimeToSeconds(t) {
    if (!t) return null
    if (/^\d+$/.test(t)) return parseInt(t, 10)
    const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/)
    if (!m) return null
    const [, h = 0, mnt = 0, s = 0] = m.map(n => parseInt(n || 0, 10))
    return h * 3600 + mnt * 60 + s
}

function getYouTubeEmbedUrl(url) {
    const id = getYouTubeId(url)
    if (!id) return null
    const embed = new URL(`https://www.youtube.com/embed/${id}`)
    embed.searchParams.set("controls", "1")
    embed.searchParams.set("rel", "0")
    embed.searchParams.set("modestbranding", "1")
    try {
        const original = new URL(url)
        const start =
            original.searchParams.get("start") ||
            original.searchParams.get("t") ||
            (original.hash?.startsWith("#t=") ? original.hash.slice(3) : null)
        const startSec = parseYTTimeToSeconds(start)
        if (startSec) embed.searchParams.set("start", String(startSec))
    } catch { /* ignore parse errors */ }
    return embed.toString()
}

export { getYouTubeId, parseYTTimeToSeconds, getYouTubeEmbedUrl }