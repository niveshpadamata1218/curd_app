package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.dto.StudentResponse;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.DuplicateResourceException;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> findAll() {
        return studentRepository.findAllByOrderByNameAsc().stream()
                .map(StudentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentResponse findById(Long id) {
        return StudentResponse.from(findStudent(id));
    }

    public StudentResponse create(StudentRequest request) {
        ensureEmailIsAvailable(request.email(), null);
        Student student = new Student();
        applyRequest(student, request);
        return StudentResponse.from(studentRepository.save(student));
    }

    public StudentResponse update(Long id, StudentRequest request) {
        Student student = findStudent(id);
        ensureEmailIsAvailable(request.email(), id);
        applyRequest(student, request);
        return StudentResponse.from(studentRepository.save(student));
    }

    public void delete(Long id) {
        Student student = findStudent(id);
        studentRepository.delete(student);
    }

    private Student findStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student with id " + id + " was not found"));
    }

    private void ensureEmailIsAvailable(String email, Long existingId) {
        boolean alreadyUsed = existingId == null
                ? studentRepository.existsByEmailIgnoreCase(email)
                : studentRepository.existsByEmailIgnoreCaseAndIdNot(email, existingId);
        if (alreadyUsed) {
            throw new DuplicateResourceException("A student with this email already exists");
        }
    }

    private void applyRequest(Student student, StudentRequest request) {
        student.setName(request.name().trim());
        student.setEmail(request.email().trim().toLowerCase());
        student.setDepartment(request.department().trim());
        student.setCourse(request.course().trim());
        student.setAge(request.age());
    }
}
