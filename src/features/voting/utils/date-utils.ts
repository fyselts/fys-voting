export function isToday(dateString: string | null) {
    if (!dateString) return false
    const date = new Date(dateString)
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}
