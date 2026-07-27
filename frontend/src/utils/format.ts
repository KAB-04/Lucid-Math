const dashboardLocale = 'en-GH'

export const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return 'Not available yet'
  }

  return `${new Intl.NumberFormat(dashboardLocale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value)}%`
}

export const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return 'Not available yet'
  }

  return new Intl.NumberFormat(dashboardLocale).format(value)
}

export const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return 'Not available yet'
  }

  return new Intl.DateTimeFormat(dashboardLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return 'Not available yet'
  }

  return new Intl.DateTimeFormat(dashboardLocale, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export const formatToday = () =>
  new Intl.DateTimeFormat(dashboardLocale, {
    dateStyle: 'full',
  }).format(new Date())
