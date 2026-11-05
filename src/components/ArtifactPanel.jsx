import { useEffect, useState } from 'react'
import Icon from './Icon'
import ArtifactFace from './ArtifactFace'
import { categories } from '../data/projects'

const formDefaults = { title: '', description: '', category: 'Experiments', tags: '', year: String(new Date().getFullYear()), imageUrl: '', supportingImages: '', sourceUrl: '' }

function toFormValues(project) {
  if (!project) return formDefaults
  return {
    title: project.title ?? '',
    description: project.description ?? '',
    category: project.categories?.[0] ?? 'Experiments',
    tags: project.tags?.join(', ') ?? '',
    year: project.year ?? String(new Date().getFullYear()),
    imageUrl: project.imageUrl ?? '',
    supportingImages: project.supportingImages?.join(', ') ?? '',
    sourceUrl: project.sourceUrl ?? '',
  }
}

/**
 * Add a new design to the library, or edit an existing record.
 * Records are stored in this browser only (localStorage).
 */
export default function ArtifactPanel({ project, onClose, onSave }) {
  const [values, setValues] = useState(() => toFormValues(project))
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  useEffect(() => { setValues(toFormValues(project)); setFileName(''); setError('') }, [project])

  useEffect(() => {
    const opener = document.activeElement
    return () => { if (opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true }) }
  }, [])

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Choose an image file for the preview.'); return }
    const reader = new FileReader()
    reader.onload = () => { setValues((current) => ({ ...current, imageUrl: String(reader.result) })); setFileName(file.name); setError('') }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.title.trim() || !values.description.trim()) { setError('Give the design a title and a short description before saving.'); return }
    const fallbackId = `design-${Date.now()}`
    onSave({ ...(project ?? {}), id: project?.id ?? fallbackId, title: values.title.trim(), eyebrow: project?.eyebrow ?? 'New design', description: values.description.trim(), categories: [values.category], tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean), status: project?.status ?? 'Draft', year: values.year.trim() || String(new Date().getFullYear()), role: project?.role ?? 'Personal study', tools: project?.tools ?? [], body: project?.body ?? [values.description.trim()], imageUrl: values.imageUrl.trim(), supportingImages: values.supportingImages.split(',').map((image) => image.trim()).filter(Boolean), sourceUrl: values.sourceUrl.trim() })
  }

  const availableCategories = categories.filter((category) => category !== 'All designs')
  const preview = {
    title: values.title.trim() || 'Untitled design',
    categories: [values.category],
    year: values.year.trim(),
    imageUrl: values.imageUrl,
  }

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <div className="panel__stage">
          <p className="eyebrow">{project ? 'Edit design' : 'New design'}</p>
          <h2 id="panel-title" className="display display--panel">
            {project ? <>Update <em>the record</em></> : <>Add a design to <em>the library</em></>}
          </h2>
          <p className="panel__hint">A title and a short description are enough to begin. Add a preview now, or later when it’s ready.</p>
          <div className="panel__preview">
            <ArtifactFace project={preview} />
            <span className="panel__preview-title">{preview.title}</span>
            <span className="panel__preview-meta">{values.category}{preview.year ? ` — ${preview.year}` : ''}</span>
          </div>
        </div>

        <form className="panel__form" onSubmit={handleSubmit} noValidate>
          <div className="panel__bar">
            <span>{project ? `Editing “${project.title}”` : 'Design details'}</span>
            <button className="icon-btn" type="button" onClick={onClose} aria-label="Close without saving"><Icon name="close" size={16} /></button>
          </div>

          <div className="panel__body">
            <div className="form-grid">
              <label className="field full">
                <span>Title <b>required</b></span>
                <input autoFocus value={values.title} onChange={update('title')} placeholder="e.g. A quieter settings screen" />
              </label>
              <label className="field">
                <span>Collection</span>
                <select value={values.category} onChange={update('category')}>
                  {availableCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Year</span>
                <input value={values.year} onChange={update('year')} inputMode="numeric" />
              </label>
              <label className="field full">
                <span>Description <b>required</b></span>
                <textarea value={values.description} onChange={update('description')} placeholder="What is this design exploring?" rows="3" />
              </label>
              <label className="field full">
                <span>Tags <b>comma separated</b></span>
                <input value={values.tags} onChange={update('tags')} placeholder="interaction, typography, mobile" />
              </label>
              <label className="field full">
                <span>Preview image <b>URL</b></span>
                <input type="url" value={values.imageUrl.startsWith('data:') ? '' : values.imageUrl} onChange={update('imageUrl')} placeholder="https://…" />
              </label>
              <div className="field full">
                <span>Or attach a file <b>from this device</b></span>
                <div className="pick-row">
                  <label className="btn btn--quiet">
                    <input type="file" accept="image/*" onChange={handleFile} />
                    <Icon name="image" size={14} /> Choose image
                  </label>
                  <small>{fileName || (values.imageUrl.startsWith('data:') ? 'Local image attached' : 'No file attached')}</small>
                </div>
              </div>
              <label className="field full">
                <span>Supporting images <b>comma-separated URLs</b></span>
                <input value={values.supportingImages} onChange={update('supportingImages')} placeholder="https://… , https://…" />
              </label>
              <label className="field full">
                <span>Source or live URL <b>optional</b></span>
                <input type="url" value={values.sourceUrl} onChange={update('sourceUrl')} placeholder="https://…" />
              </label>
            </div>

            <p className="form-note"><Icon name="layers" size={15} /> Saved in this browser only. Attached image files are stored inside the record.</p>
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>

          <div className="panel__foot">
            <small>Ctrl/⌘ K opens this panel</small>
            <div className="panel__actions">
              <button className="btn btn--quiet" type="button" onClick={onClose}>Cancel</button>
              <button className="btn btn--ink" type="submit">
                {project ? 'Save changes' : 'Add to library'} <Icon name="check" size={15} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
