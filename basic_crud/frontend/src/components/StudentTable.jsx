function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(value))
}

function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">+</span>
        <h3>No students found</h3>
        <p>Add your first student or adjust the search term.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Department</th>
            <th>Course</th>
            <th>Age</th>
            <th>Joined</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td data-label="Student">
                <div className="student-cell">
                  <span className="avatar">{student.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.email}</span>
                  </div>
                </div>
              </td>
              <td data-label="Department">{student.department}</td>
              <td data-label="Course">{student.course}</td>
              <td data-label="Age">{student.age}</td>
              <td data-label="Joined">{formatDate(student.createdAt)}</td>
              <td data-label="Actions" className="actions-cell">
                <button className="text-button" type="button" onClick={() => onEdit(student)}>Edit</button>
                <button className="text-button danger" type="button" onClick={() => onDelete(student)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentTable
