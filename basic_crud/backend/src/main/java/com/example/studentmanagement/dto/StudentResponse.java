package com.example.studentmanagement.dto;

import com.example.studentmanagement.entity.Student;
import java.time.Instant;

public record StudentResponse(
        Long id,
        String name,
        String email,
        String department,
        String course,
        Integer age,
        Instant createdAt
) {
    public static StudentResponse from(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment(),
                student.getCourse(),
                student.getAge(),
                student.getCreatedAt()
        );
    }
}
