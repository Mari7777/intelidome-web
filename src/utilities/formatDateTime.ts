// Czech date format: "19. 8. 2026"
export const formatDateTime = (timestamp: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date()
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}
