import { useEffect, useMemo, useState } from 'react'
import StudentForm from './components/StudentForm'
import StudentTable from './components/StudentTable'
import SearchBar from './components/SearchBar'
import {
  createStudent,
  deleteStudent,
  getApiErrorMessage,
  getStudents,
  updateStudent,
} from './services/studentService'

function App() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadStudents = async () => {
    setIsLoading(true)
    setError('')
    try {
      setStudents(await getStudents())
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const visibleStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return students
    return students.filter((student) =>
      student.name.toLowerCase().includes(term) || student.email.toLowerCase().includes(term),
    )
  }, [searchTerm, students])

  const handleSubmit = async (studentData) => {
    setIsSaving(true)
    setError('')
    setNotice('')
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, studentData)
        setNotice('Student details updated successfully.')
        setEditingStudent(null)
      } else {
        await createStudent(studentData)
        setNotice('Student added successfully.')
      }
      await loadStudents()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
      throw requestError
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Delete ${student.name}? This action cannot be undone.`)
    if (!confirmed) return

    setError('')
    setNotice('')
    try {
      await deleteStudent(student.id)
      setNotice(`${student.name} was deleted.`)
      if (editingStudent?.id === student.id) setEditingStudent(null)
      await loadStudents()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Student Management home">
          <span className="brand-mark">SM</span>
          <span>Student Management</span>
        </a>
        <span className="status-chip"><span className="status-dot" />API connected</span>
      </header>

      <main className="page-content">
        <section className="hero">
          <div>
            <p className="eyebrow">Academic records / 2026</p>
            <h1>Keep every student<br /><em>in view.</em></h1>
            <p className="hero-copy">A simple, dependable place to add, update, and find student records.</p>
          </div>
          <div className="count-card">
            <span>Total students</span>
            <strong>{students.length}</strong>
            <small>Across all departments</small>
          </div>
        </section>

        {(notice || error) && (
          <div className={`banner ${error ? 'banner-error' : 'banner-success'}`} role="status">
            <span>{error || notice}</span>
            <button type="button" onClick={() => { setError(''); setNotice('') }} aria-label="Dismiss message">×</button>
          </div>
        )}

        <div className="workspace-grid">
          <StudentForm
            student={editingStudent}
            onSubmit={handleSubmit}
            onCancel={() => setEditingStudent(null)}
            isSaving={isSaving}
          />

          <section className="records-panel" aria-labelledby="records-title">
            <div className="records-heading">
              <div>
                <p className="eyebrow">Directory</p>
                <h2 id="records-title">All students</h2>
              </div>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>

            {isLoading ? (
              <div className="loading-state"><span className="spinner" />Loading student records...</div>
            ) : error && students.length === 0 ? (
              <div className="error-state">
                <h3>Could not load students</h3>
                <p>{error}</p>
                <button className="button button-quiet" type="button" onClick={loadStudents}>Try again</button>
              </div>
            ) : (
              <StudentTable students={visibleStudents} onEdit={setEditingStudent} onDelete={handleDelete} />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
