import { useEffect, useState } from 'react'

const emptyStudent = {
  name: '',
  email: '',
  department: '',
  course: '',
  age: '',
}

function StudentForm({ student, onSubmit, onCancel, isSaving }) {
  const [formData, setFormData] = useState(emptyStudent)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setFormData(student ? { ...student, age: String(student.age) } : emptyStudent)
    setFormError('')
  }, [student])

  const isEditing = Boolean(student)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.department.trim()
      || !formData.course.trim() || !formData.age) {
      setFormError('Please complete every field.')
      return
    }

    const age = Number(formData.age)
    if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      setFormError('Name must be between 2 and 100 characters.')
      return
    }
    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (!Number.isInteger(age) || age < 16 || age > 100) {
      setFormError('Age must be a whole number between 16 and 100.')
      return
    }

    try {
      await onSubmit({ ...formData, age })
      if (!isEditing) {
        setFormData(emptyStudent)
      }
    } catch {
      // The parent displays the server error. Keep the form values available for correction.
    }
  }

  return (
    <section className="form-panel" aria-labelledby="form-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Student record</p>
          <h2 id="form-title">{isEditing ? 'Edit student' : 'Add a student'}</h2>
        </div>
        <span className="form-number">{isEditing ? '02' : '01'}</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Full name
            <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Maya Patel" maxLength="100" />
          </label>
          <label>
            Email address
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="maya@example.com" />
          </label>
          <label>
            Department
            <input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Computer Science" />
          </label>
          <label>
            Course
            <input name="course" value={formData.course} onChange={handleChange} placeholder="e.g. Software Engineering" />
          </label>
          <label>
            Age
            <input name="age" type="number" min="16" max="100" value={formData.age} onChange={handleChange} placeholder="21" />
          </label>
        </div>

        {formError && <p className="inline-error" role="alert">{formError}</p>}

        <div className="form-actions">
          {isEditing && (
            <button className="button button-quiet" type="button" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
          )}
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Add student'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default StudentForm
