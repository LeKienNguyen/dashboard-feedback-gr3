const STORAGE_KEY = 'feedbackEntries'

const LOCATIONS = ['District 1', 'District 3', 'Thao Dien']

function getFeedback() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function updateFeedback(id, changes) {
  const entries = getFeedback()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(
    entries.map(e => e.id === id ? { ...e, ...changes } : e)
  ))
}

function addFeedback(entry) {
  const entries = getFeedback()
  const record = {
    id: crypto.randomUUID(),
    name: entry.name || '',
    location: entry.location,
    rating: Number(entry.rating),
    comment: entry.comment,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...entries]))
  return record
}
