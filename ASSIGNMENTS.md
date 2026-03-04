# Course Assignments

## Assignment 1: University Course Catalog XML Document

### Objective

Design a well-formed XML document representing a university course catalog with departments, courses, and instructors.

### Task

Create an XML document that models a university course catalog system with the following structure:

### Required Elements and Structure

1. **Departments** (at least 2):
   - Department name
   - Department code
   - Department chair information

2. **Courses** (at least 3 per department):
   - Course code (e.g., CS101)
   - Course name
   - Credits
   - Description
   - Instructor assignment

3. **Instructor Information**:
   - Instructor name
   - Email address
   - Office location
   - Office hours (optional)

4. **Design Requirements**:
   - Use attributes where appropriate (IDs, codes, status)
   - Use elements for content-heavy data
   - Include XML declaration with proper encoding
   - Use meaningful tag names
   - Include comments explaining your design choices

### Example Structure

Your document should include courses like:

- Computer Science Department
  - CS101: Introduction to Programming
  - CS201: Data Structures
  - CS301: Algorithms
- Mathematics Department
  - MATH101: Calculus I
  - MATH201: Linear Algebra
  - MATH301: Differential Equations

### Deliverables

- **`courses.xml`** - Your complete XML document containing:
  - Proper XML declaration
  - At least 2 departments
  - At least 3 courses per department
  - Complete instructor information for each course
  - Well-formed structure
  - Inline comments explaining design decisions

### Validation Requirements

- Must be well-formed XML (no syntax errors)
- Validate your document using an XML validator
- Document any validation results
- Include a brief validation report (2-3 sentences) in comments

### Design Considerations

Address these in your inline comments:

1. **Elements vs Attributes**: Why did you choose to use attributes for certain data and elements for others?
2. **Structure**: How is the hierarchy (university → departments → courses → instructors) reflected in your XML?
3. **Data Organization**: Where would instructor information go if the same instructor teaches multiple courses?
4. **Best Practices**: What naming conventions did you follow? (camelCase, PascalCase, kebab-case, snake_case)
