import { useEffect, useState } from 'react'
import Icon from './Icon'
import { categories } from '../data/projects'

const formDefaults = {
  title: '',
  description: '',
  category: 'Experiments',
  tags: '',
  year: String(new Date().getFullYear()),
  imageUrl: '',
  sourceUrl: '',
}

function toFormValues(project) {
  if (!project) return formDefaults
  return {
    title: project.title ?? '',
    description: project.description ?? '',
    category: project.categories?.[0] ?? 'Experiments',
    tags: project.tags?.join(', ') ?? '',
    year: project.year ?? String(new Date().getFullYear()),
    imageUrl: project.imageUrl ?? '',
    sourceUrl: project.sourceUrl ?? '',
  }
}

export default function AddDesignPanel({ project, onClose, onSave }) {
  const [values, setValues] = useState(() => toFormValues(project))
  const [error, setError] = useState('')

  useEffect(() => {
    setValues(toFormValues(project))
    setError('')
  }, [project])

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.title.trim() || !values.description.trim()) {
      setError('Give the piece a title and a short description before saving.')
      return
    }

    const fallbackId = `design-${Date.now()}`
    onSave({
      ...(project ?? {}),
      id: project?.id ?? fallbackId,
      title: values.title.trim(),
      eyebrow: project?.eyebrow ?? 'New atelier piece',
      description: values.description.trim(),
      categories: [values.category],
      tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      status: project?.status ?? 'Draft',
      year: values.year.trim() || String(new Date().getFullYear()),
      role: project?.role ?? 'Personal study',
      tools: project?.tools ?? ['Added in atelier'],
      body: project?.body ?? [values.description.trim()],
      imageUrl: values.imageUrl.trim(),
      sourceUrl: values.sourceUrl.trim(),
    })
  }

  const availableCategories = categories.filter((category) => category !== 'All designs')

  return (
    <div className="form-overlay" role="dialog" aria-modal="true" aria-labelledby="design-form-title">
      <form className="design-form" onSubmit={handleSubmit}>
        <div className="design-form__topbar">
          <div><span className="kicker">{project ? 'Edit the artifact' : 'Add to the atelier'}</span><h2 id="design-form-title">{project ? 'Refine this piece.' : 'Make room for a new piece.'}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close design form"><Icon name="close" /></button>
        </div>
        <p className="design-form__intro">A small, honest record is enough to begin. You can add the visual now or return to it later.</p>
        <div className="design-form__grid">
          <label className="field field--wide"><span>Title <b>*</b></span><input autoFocus value={values.title} onChange={update('title')} placeholder="e.g. A softer checkout" /></label>
          <label className="field"><span>Category</span><select value={values.category} onChange={update('category')}>{availableCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="field"><span>Year</span><input value={values.year} onChange={update('year')} inputMode="numeric" /></label>
          <label className="field field--wide"><span>Description <b>*</b></span><textarea value={values.description} onChange={update('description')} placeholder="What is this piece trying to explore?" rows="4" /></label>
          <label className="field field--wide"><span>Tags <small>comma separated</small></span><input value={values.tags} onChange={update('tags')} placeholder="interaction, typography, mobile" /></label>
          <label className="field field--wide"><span>Preview image URL <small>optional</small></span><input type="url" value={values.imageUrl} onChange={update('imageUrl')} placeholder="https://…" /></label>
          <label className="field field--wide"><span>Source or live URL <small>optional</small></span><input type="url" value={values.sourceUrl} onChange={update('sourceUrl')} placeholder="https://…" /></label>
        </div>
        <div className="design-form__note"><Icon name="layers" size={16} /><span>Saved to this browser only. No upload service or fake backend is involved.</span></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="design-form__actions"><button className="button button--quiet" type="button" onClick={onClose}>Cancel</button><button className="button button--primary" type="submit">{project ? 'Save changes' : 'Add design'} <Icon name="arrowUpRight" size={16} /></button></div>
      </form>
    </div>
  )
}
