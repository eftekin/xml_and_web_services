# XML and Modern Web Services

A learning resource covering XML and how modern APIs actually work. Covers REST, GraphQL, gRPC, security, and API design.

Created by students, for students.

## Quick Overview

**Weeks 1-6:** XML fundamentals—DTD, XSD, XPath, XSLT, DOM/SAX parsing

**Weeks 7-13:** Modern web—REST APIs, OpenAPI specs, SOAP, GraphQL, gRPC, authentication

## What You'll Actually Learn

- How to read and write XML properly
- How REST actually works (it's just HTTP rules)
- How GraphQL is different from REST and why you'd use it
- How to design APIs that don't break when you change them
- Basic API security—JWT tokens, OAuth

## Get Started

1. **Install Node.js** if you want to run the JavaScript examples

2. **Follow the weeks in order** or jump to what you need

3. **Code as you go**—the real learning is in the examples

## Quick Setup

**For JavaScript examples:**

```bash
npm install
node week07_rest/01_rest_with_node.js
```

## What's Included

- **JavaScript code files** with working examples (Node.js)
- **Real code** you can run and modify
- **Week-by-week structure** with progression
- **References** for deeper learning

## Tools You'll Use

- VS Code (or any text editor)
- Python 3.x (optional)
- Node.js (optional)
- Postman or curl (for testing APIs)

## Why This Structure

Everything is organized by week so you have a clear path. But you don't have to follow it—jump to whatever interests you. Each week stands mostly on its own.

---

See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed setup instructions.

## Helpful Resources

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com) - API testing
- [XML Tutorial - MDN](https://developer.mozilla.org/en-US/docs/Web/XML)
- [REST API Tutorial](https://restfulapi.net/)

## Learning Challenges & Practice

To test your understanding, each section includes:

- Practice assignments with solutions
- Real-world XML examples
- API consumption challenges
- Design projects to build your skills

These are self-paced and designed to help you learn, not for formal grading. Work through them as you go through each week.

## Getting Started

1. Clone this repository
2. Install Python dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Start with [Week 1](week01_foundations/)

## Repository Structure

```
xml_and_web_services/
├── README.md
├── requirements.txt
├── week01_foundations/
│   ├── README.md
│   ├── 01_introduction.ipynb
│   ├── 02_xml_basics.ipynb
│   └── examples/
├── week02_dtd_namespaces/
│   ├── README.md
│   ├── 01_dtd.ipynb
│   ├── 02_namespaces.ipynb
│   └── examples/
├── [... other weeks ...]
└── resources/
    ├── cheatsheets/
    └── additional_reading/
```

## How to Use This Repository

Each week's folder contains:

- **README.md** - Week overview and learning objectives
- **JavaScript files (.js)** - Working code examples (weeks 7, 11)
- **Markdown files (.md)** - Theory and conceptual content
- **examples/** - Sample files and code demonstrations
- **exercises/** - Practice problems with solutions

## Support

If you have questions or need clarification:

- Review the week's README first
- Check the examples folder
- Refer to recommended textbooks
- Consult online resources

## License

This educational material is provided for learning purposes.

---

**Last Updated:** February 2026
