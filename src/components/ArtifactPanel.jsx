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
 * The acquisition process — introduce a new exhibit into the archive
 * (or refine an existing record). Same field contract as before.
 */
export default function ArtifactPanel({ project, onClose, onSave }) {
  const [values, setValues] = useState(() => toFormValues(project))
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  useEffect(() => { setValues(toFormValues(project)); setFileName(''); setError('') }, [project])

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
    if (!values.title.trim() || !values.description.trim()) { setError('Give the piece a title and a short description before saving.'); return }
    const fallbackId = `design-${Date.now()}`
    onSave({ ...(project ?? {}), id: project?.id ?? fallbackId, title: values.title.trim(), eyebrow: project?.eyebrow ?? 'New exhibit', description: values.description.trim(), categories: [values.category], tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean), status: project?.status ?? 'Draft', year: values.year.trim() || String(new Date().getFullYear()), role: project?.role ?? 'Personal study', tools: project?.tools ?? ['Added in vault'], body: project?.body ?? [values.description.trim()], imageUrl: values.imageUrl.trim(), supportingImages: values.supportingImages.split(',').map((image) => image.trim()).filter(Boolean), sourceUrl: values.sourceUrl.trim() })
  }

  const availableCategories = categories.filter((category) => category !== 'All designs')
  const preview = {
    title: values.title.trim() || 'Untitled artifact',
    categories: [values.category],
    year: values.year.trim(),
    imageUrl: values.imageUrl,
    tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
  }

  return (
    <div className="forge-overlay">
      <div className="forge">
        {/* installation side — the artifact as it will hang */}
        <div className="forge__stage">
          <div className="forge__intro">
            <span className="sig sig--wood">{project ? 'Revising the record / edit mode' : 'Acquisition / incoming exhibit'}</span>
            <h2>{project ? <>Return to the <em>record.</em></> : <>Introduce a new <em>exhibit.</em></>}</h2>
            <p>A small, honest record is enough to begin. Hang a preview now, or keep the piece text-only until the image is ready.</p>
          </div>
          <div className="forge__plinth">
            <ArtifactFace project={preview} compact />
          </div>
          <span className="forge__hint">live preview · displayed on a museum plinth</span>
        </div>

        {/* record side */}
        <form className="forge__form" onSubmit={handleSubmit}>
          <div className="forge__bar">
            <span>{project ? `Editing — ${project.title}` : 'New specimen record'}</span>
            <button className="icon-btn" type="button" onClick={onClose} aria-label="Close the acquisition panel"><Icon name="close" size={16} /></button>
          </div>

          <div className="forge__body">
            <div className="form-grid">
              <label className="field full">
                <span>Title <b>*</b></span>
                <input autoFocus value={values.title} onChange={update('title')} placeholder="e.g. A quieter settings screen" />
              </label>
              <label className="field">
                <span>Category</span>
                <select value={values.category} onChange={update('category')}>
                  {availableCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Year</span>
                <input value={values.year} onChange={update('year')} inputMode="numeric" />
              </label>
              <label className="field full">
                <span>Description <b>*</b></span>
                <textarea value={values.description} onChange={update('description')} placeholder="What is this piece exploring?" rows="4" />
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
                  <label>
                    <input type="file" accept="image/*" onChange={handleFile} />
                    <Icon name="image" size={13} /> Choose from device
                  </label>
                  <small>{fileName || (values.imageUrl.startsWith('data:') ? 'Local image attached' : 'no file attached')}</small>
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

            <div className="form-note">
              <Icon name="layers" size={15} />
              <span>Saved to this browser only. Local image files are stored inside this record.</span>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>

          <div className="forge__foot">
            <small>⌘K reopens this panel at any time</small>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="vault-btn vault-btn--ghost" type="button" onClick={onClose}>Cancel</button>
              <button className="vault-btn vault-btn--snow" type="submit">
                {project ? 'Save changes' : 'Install the exhibit'} <Icon name="arrowUpRight" size={15} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
