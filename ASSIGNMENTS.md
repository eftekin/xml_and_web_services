# Course Assignments

## Assignment 1: University Course Catalog XML Document (Due: Before Week 4)

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

### Grading Criteria (100 points)

| Criteria                | Points    | Description                                           |
| ----------------------- | --------- | ----------------------------------------------------- |
| **Correctness**         | **60**    |                                                       |
| Well-formed XML         | 20 points | No syntax errors, proper opening/closing tags         |
| Required Content        | 20 points | All departments, courses, instructors; meets minimums |
| Proper Nesting          | 10 points | Hierarchy is correct and logical                      |
| Validation              | 10 points | Successfully validates, error-free                    |
| **Design Quality**      | **40**    |                                                       |
| Element/Attribute Usage | 15 points | Appropriate choices; well-justified                   |
| Meaningful Structure    | 15 points | Clear hierarchy; easy to understand                   |
| Comments & Explanations | 10 points | Clear inline comments explaining choices              |

### Tips for Success

1. **Start Simple**: Create the basic structure first, then add details
2. **Validate Early**: Test with an XML validator often
3. **Comment Well**: Help the grader understand your design thinking
4. **Use Real Data**: Make it realistic (actual course names, numbers, etc.)
5. **Review Carefully**: Check for missing closing tags, proper nesting, special character escaping

### Example Submission File Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
University Course Catalog
Author: [Your Name]
Date: [Submission Date]

Design Notes:
- IDs are stored as attributes for quick reference
- Course content is in elements for flexibility
- Instructor info is nested within courses they teach
-->

<university name="State University" id="SU001">
    <!-- Computer Science Department -->
    <department code="CS" name="Computer Science">
        <chair>
            <name>Dr. Jane Smith</name>
            ...
        </chair>

        <course code="CS101" credits="3">
            <title>Introduction to Programming</title>
            ...
            <instructor>...</instructor>
        </course>

        <!-- More courses -->
    </department>

    <!-- More departments -->
</university>
```

### Validation Tools

- **Online**: [XML Validator](https://www.xmlvalidation.com/)
- **VS Code**: Install "XML" extension
- **Python**: Use `xml.etree.ElementTree` to validate
- **Command line**: `xmllint --noout yourfile.xml`

### Common Mistakes to Avoid

- Missing XML declaration
- Unclosed tags
- Improper nesting (tags overlapping)
- Special characters not escaped (< > & " ')
- Inconsistent naming conventions
- No comments explaining design

### Questions?

If you need clarification:

1. Review Week 1 materials on well-formedness
2. Check the examples in week01_foundations/examples/
3. Ask during office hours

---

## Assignment 2: REST API Consumption (Due: Week 8)

### Objective

Build a Python application that consumes a public REST API and demonstrates best practices.

### Requirements

1. **Choose a Public API**:
   - GitHub API
   - OpenWeatherMap API
   - JSONPlaceholder
   - Any other public REST API (get approval)

2. **Implement Python Client** with:
   - At least 5 different API endpoints
   - All CRUD operations (if applicable)
   - Proper error handling
   - Request timeout handling
   - Rate limiting awareness
   - Environment variables for API keys (if needed)

3. **Features**:
   - Command-line interface (CLI)
   - Multiple operation modes
   - Data formatting and display
   - Caching (bonus)
   - Logging

4. **Testing**:
   - Write unit tests for your functions
   - Test error handling
   - Document test coverage

5. **Documentation**:
   - README with setup instructions
   - API usage examples
   - Error handling documentation

### Deliverables

- `api_client.py` - Main application
- `requirements.txt` - Dependencies
- `test_api_client.py` - Unit tests
- `.env.example` - Environment variable template
- `README.md` - Complete documentation
- `USAGE.md` - Usage examples

### Example APIs

```python
# GitHub API example
GET https://api.github.com/users/{username}
GET https://api.github.com/users/{username}/repos

# OpenWeatherMap example
GET http://api.openweathermap.org/data/2.5/weather?q={city}
```

### Grading Criteria (100 points)

- API integration correctness (25 points)
- Error handling and robustness (20 points)
- Code quality and organization (20 points)
- Testing coverage (15 points)
- Documentation quality (15 points)
- CLI usability (5 points)

---

## Assignment 3: Final Presentation (Week 14)

### Objective

Compare and contrast different web service technologies and present an architectural decision for a specific use case.

### Requirements

1. **Choose a Scenario**:
   - Design an API for [choose one]:
     - Social media platform
     - E-commerce marketplace
     - Real-time chat application
     - IoT device management
     - Financial trading platform

2. **Technology Analysis**:
   - Evaluate at least 3 technologies:
     - REST
     - GraphQL
     - gRPC
     - SOAP (if relevant)
3. **Decision Matrix**:
   - Create comparison matrix
   - Consider:
     - Performance requirements
     - Data complexity
     - Client diversity
     - Team expertise
     - Ecosystem/tooling
     - Security requirements

4. **Recommendation**:
   - Justify your choice
   - Acknowledge trade-offs
   - Present architecture diagram
   - Discuss implementation plan

5. **Presentation**:
   - 10-15 minutes
   - Slides or live demo
   - Q&A prepared

### Deliverables

- Presentation slides (PDF)
- Architecture diagram
- Decision matrix (spreadsheet or document)
- Code samples (optional but recommended)

### Presentation Structure

1. Introduction (1-2 min)
   - Use case overview
   - Requirements summary

2. Technology Analysis (5-6 min)
   - Each technology overview
   - Pros and cons
   - Applicability to use case

3. Decision & Justification (3-4 min)
   - Final recommendation
   - Trade-offs discussion
   - Architecture diagram

4. Q&A (3-5 min)

### Grading Criteria (100 points)

- Use case clarity (10 points)
- Technology analysis depth (30 points)
- Decision justification (25 points)
- Presentation quality (20 points)
- Q&A responses (15 points)

---

## Submission Guidelines

### Format

- All files in a single ZIP archive
- Named: `LastName_FirstName_Assignment#.zip`
- Include README with file structure

### Deadlines

- Assignment 1: End of Week 4
- Assignment 2: End of Week 8
- Assignment 3: Week 14 (presentation day)

### Late Policy

- 10% deduction per day late
- Maximum 3 days late accepted
- Extensions require prior approval

### Academic Integrity

- Individual work required
- Cite all sources and references
- No sharing of code between students
- Using AI tools: Permitted for learning, but must understand and explain all code

---

## Additional Resources

### For Assignment 1 (XML Schema)

- [W3C XML Schema Primer](https://www.w3.org/TR/xmlschema-0/)
- [XML Schema Tutorial](https://www.w3schools.com/xml/schema_intro.asp)
- Online validators: [XML Validation](https://www.xmlvalidation.com/)

### For Assignment 2 (REST API)

- [Python Requests Documentation](https://docs.python-requests.org/)
- [Public APIs List](https://github.com/public-apis/public-apis)
- [Best Practices for REST API Design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

### For Assignment 3 (Presentation)

- Course textbooks (weeks 7-13)
- [API Design Patterns](https://microservices.io/patterns/)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)

---

## Questions?

Contact the instructor or TA during office hours or via course communication channels.
