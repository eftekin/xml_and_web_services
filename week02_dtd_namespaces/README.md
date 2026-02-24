# Week 2: DTD & Namespaces

## The Problem

You have XML. It's well-formed. But is it the RIGHT shape? A book catalog should have books, which should have titles. You can't just put random elements in—there needs to be structure.

DTD (Document Type Definition) solves this. It's a rulebook that says "this document must have exactly this structure."

Namespaces solve a different problem: What if you want to mix two different XML vocabularies? Say you have a book with reviews. Books use one set of tags, reviews use another. How do tags from two different sources coexist without name collisions?

## Well-Formed vs Valid

Two different concepts:

- **Well-formed** - Follows XML syntax rules (single root, proper nesting, etc.) - we covered this in Week 1
- **Valid** - Well-formed PLUS matches a schema (DTD or XSD) that defines allowed structure

Example:

```xml
<?xml version="1.0"?>
<book>
  <title>1984</title>
</book>
```

This is **well-formed** but might not be **valid** if your DTD allows:

- Book element to have author AND title
- Book element to optionally have ISBN

If your DTD says you MUST have author, this document is **not valid**.

## DTDs: Validation Rules

A DTD is a set of rules that define:

1. What elements can exist
2. What attributes they can have
3. What children they can contain
4. In what order
5. How many times

### Simple DTD Example

```dtd
<!ELEMENT book (title, author, year)>
<!ELEMENT title (#PCDATA)>
<!ELEMENT author (#PCDATA)>
<!ELEMENT year (#PCDATA)>
```

This says:

- A `<book>` must have exactly: title, then author, then year (in that order)
- `title`, `author`, and `year` contain text only (PCDATA = Parsed Character Data)

### Content Models

In DTDs, you specify what can go inside elements:

```dtd

<!ELEMENT book (title, author, year)>      <!-- Must have all three, in order -->
<!ELEMENT book (title+)>                    <!-- Must have at least one title -->
<!ELEMENT book (title*)>                    <!-- Can have zero or more titles -->
<!ELEMENT book (title?)>                    <!-- Can have zero or one title -->
<!ELEMENT book ((title|name), author)>     <!-- Either title OR name, then author -->
<!ELEMENT book EMPTY>                       <!-- Must be empty: <book /> -->
<!ELEMENT book ANY>                         <!-- Can contain anything -->

```

The symbols:

- `?` = optional (zero or one)
- `*` = zero or more
- `+` = one or more
- `,` = sequence (must appear in order)
- `|` = choice (pick one)

## Attributes in DTDs

Define which attributes elements can have:

```dtd

<!ATTLIST book
  id CDATA #REQUIRED
  isbn CDATA #IMPLIED
  published CDATA #FIXED "2024">

```

This means:

- `book` must have an `id` attribute (required)
- `book` may have an `isbn` attribute (optional)
- `book`'s `published` attribute is always "2024" (fixed)

Attribute types include:

- `CDATA` - Any text
- `ID` - Unique identifier
- `IDREF` - References another ID
- Enumerated: `(hardcover|paperback|ebook)` - Must be one of these

## Internal vs External DTDs

### Internal DTD

DTD rules live INSIDE the XML document:

```xml

<?xml version="1.0"?>
<!DOCTYPE book [  <!-- DTD starts here -->
  <!ELEMENT book (title, author)>
  <!ELEMENT title (#PCDATA)>
  <!ELEMENT author (#PCDATA)>

]> <!-- DTD ends here -->
<book>

  <title>1984</title>
  <author>George Orwell</author>
</book>
```

Good for: Small documents, simple validation

### External DTD

DTD rules in a separate file:

```xml

<?xml version="1.0"?>
<!DOCTYPE book SYSTEM "book.dtd">
<book>
  <title>1984</title>
  <author>George Orwell</author>
</book>
```

The separate `book.dtd` file:

```dtd

<!ELEMENT book (title, author)>
<!ELEMENT title (#PCDATA)>
<!ELEMENT author (#PCDATA)>

```

Good for: Reusable schemas across many documents

## XML Namespaces

Now for the second problem: What if you want to mix two XML vocabularies?

Imagine combining book data (from Books.xml) with review data (from Reviews.xml):

```xml

<!-- What if both vocabularies have a <title> tag? -->
<book>
  <title>1984</title><!-- Book title-->
  <title>Best book ever!</title><!-- Review title? -->
</book>
```

Ambiguous! You need a way to distinguish them.

### Namespace Solution

Namespaces add a prefix to avoid collisions:

```xml

<?xml version="1.0"?>

<book xmlns:b="http://books.com"
      xmlns:r="http://reviews.com">
<b:title>1984</b:title>
<r:title>Best book ever!</r:title>
<b:author>George Orwell</b:author>
<r:rating>5</r:rating>
</book>
```

- `b:title` is clearly the Books vocabulary
- `r:title` is clearly the Reviews vocabulary
- No more confusion!

### Namespace Declaration

The `xmlns` attribute declares namespaces:

```xml
xmlns:prefix="http://unique-identifier"
```

- `xmlns:` = namespace declaration keyword
- `prefix` = short name you use (b, r, etc.)
- The URI = unique identifier for that vocabulary (doesn't have to be a real website)

### Default Namespace

You can set a default namespace so you don't need prefixes:

```xml

<?xml version="1.0"?>
<catalog xmlns="http://books.com">
  <!-- Everything here defaults to books namespace -->
  <book>
    <title>1984</title>
    <author>George Orwell</author>
  </book>
</catalog>
```

Now all elements implicitly belong to the books namespace without prefixes."

## Real-World Applications of DTDs and Namespaces

### Where DTDs Are Still Used

1. **Legacy System Integration** - Many enterprise systems still rely on DTD validation for document processing
2. **EDI (Electronic Data Interchange)** - Supply chain and financial institutions exchange documents with DTD validation
3. **Document Workflows** - Publishing systems, content management, and archival use DTDs for consistency
4. **Configuration Files** - Some XML-based configuration formats still use DTDs (e.g., web service definitions)
5. **Simple Validation** - Projects that don't need XSD's advanced features prefer DTD's simplicity

### Where Namespaces Are Essential

1. **Multi-vocabulary Documents** - SOAP messages combine SOAP, business data, and schema information
2. **Enterprise Integration** - Combining data from multiple sources (HR, Finance, Operations) in one document
3. **Extensible Formats** - Atom feeds, RSS, XHTML all use namespaces to allow extensions
4. **Schema Evolution** - Namespaces allow old and new versions of schemas to coexist
5. **Standards Integration** - Mixing SVG graphics into XHTML, or MathML into documents

## DTD Limitations

While useful, DTDs have significant limitations:

| Limitation              | Impact                                           | Example                                                     |
| ----------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| **Weak Data Types**     | Can't specify "year must be 4 digits"            | Only text, CDATA, or ID types available                     |
| **Limited Constraints** | Can't enforce relationships between attributes   | No way to say "if status=draft, then can't have publicDate" |
| **No Namespaces**       | DTD rules can't apply to specific namespaces     | Conflicts with modern design                                |
| **Text-Based Grammar**  | Hard to read and maintain for complex structures | No object-oriented concepts                                 |
| **Difficult Reuse**     | Including one DTD into another is cumbersome     | Must use entities, which is complex                         |
| **No Inheritance**      | Can't extend or modify existing rules            | Must duplicate rules in each DTD                            |

**This is why XSD (XML Schema Definition) replaced DTDs for most modern applications.**

## DTD Validation Tools and Best Practices

### Validation in Python

```python
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Parse with DTD validation
try:
    tree = ET.parse('book.xml')
    root = tree.getroot()
    print("XML is well-formed")
except ET.ParseError as e:
    print(f"Parse error: {e}")

# For DTD validation, you'd typically use lxml:
try:
    from lxml import etree
    xmlschema_doc = etree.parse('book.dtd')
    # Note: DTD validation in lxml is less common than XSD
except ImportError:
    print("Install lxml for DTD support: pip install lxml")
```

### Best Practices

✅ **DO:**

- Use external DTDs for reusability across multiple documents
- Keep DTD rules simple and understandable
- Document what each rule enforces
- Test your DTD with various valid and invalid XML documents
- Use meaningful element and attribute names

❌ **DON'T:**

- Use `ANY` content model (defeats validation purpose)
- Mix PCDATA with child elements too liberally
- Create DTDs that are too permissive
- Rely on DTD alone for security (validate input separately)
- Use DTDs for new projects when XSD is more appropriate

## Namespace Best Practices

✅ **DO:**

- Use meaningful namespace URIs (typically use reverse domain notation)
- Declare namespaces at the root element level
- Use prefixes consistently throughout the document
- Document your namespace conventions
- Limit the number of namespaces (cognitive overhead)

❌ **DON'T:**

- Use actual URLs as namespaces unless they're resolvable
- Declare multiple namespace prefixes for the same URI
- Use cryptic or single-letter prefixes without documentation
- Change namespace prefixes mid-document
- Assume namespace prefix names are standardized

## Common DTD Mistakes & Fixes

### Mistake 1: Incorrect Element Order

❌ **Wrong:** DTD says sequence but XML has different order

```dtd
<!ELEMENT book (author, title, year)>  <!-- Must be: author, title, year -->
```

```xml
<book>
  <title>1984</title>  <!-- Wrong - title comes first -->
  <author>Orwell</author>
  <year>1949</year>
</book>
```

✅ **Fixed:** Match DTD order or use `(title|author|year)*` if order doesn't matter

```dtd
<!ELEMENT book (title, author, year)>  <!-- Or use choice: (author|title|year)* -->
```

### Mistake 2: Missing Required Attributes

❌ **Wrong:**

```dtd
<!ATTLIST book id ID #REQUIRED>
```

```xml
<book>  <!-- Missing required id attribute -->
  <title>1984</title>
</book>
```

✅ **Fixed:** Always include required attributes

```xml
<book id="bk001">
  <title>1984</title>
</book>
```

### Mistake 3: Mixing PCDATA with Elements

❌ **Problematic:**

```dtd
<!ELEMENT paragraph (#PCDATA | bold | italic)*>  <!-- Can lead to content ambiguity -->
```

### Mistake 4: Using Undefined Entity References

❌ **Wrong:**

```xml
<description>Price: &euro; 99.99</description>  <!-- &euro; not defined -->
```

✅ **Fixed:** Declare entity or use numeric reference

```dtd
<!ENTITY euro "€">
```

```xml
<!-- Or use numeric reference -->
<description>Price: &#8364; 99.99</description>
```

### Mistake 5: Namespace Prefix Confusion

❌ **Wrong:**

```xml
<?xml version="1.0"?>
<book xmlns:b="http://books.com">
  <title>1984</title>  <!-- No prefix - which namespace? -->
</book>
```

✅ **Fixed:** Be explicit about namespaces

```xml
<?xml version="1.0"?>
<book xmlns="http://books.com">  <!-- Define default namespace -->
  <title>1984</title>
</book>
```

## DTD vs XSD Comparison

| Feature             | DTD                | XSD                                | Use Case                   |
| ------------------- | ------------------ | ---------------------------------- | -------------------------- |
| **Data Types**      | Limited (text, ID) | Rich (string, integer, date, etc.) | Strict type validation     |
| **Constraints**     | Basic (occurrence) | Advanced (range, patterns)         | Complex business rules     |
| **Namespaces**      | Poor support       | Full support                       | Multi-vocabulary documents |
| **Readability**     | Simple text format | XML-based (verbose)                | Learning & maintenance     |
| **Reusability**     | Entity inclusion   | Modular composition                | Large shared schemas       |
| **Standard**        | 1998               | 2001+ (modern)                     | New projects               |
| **Browser Support** | Basic              | Better support                     | Web validation             |

**Recommendation:** Use XSD for new projects; DTD primarily for legacy system maintenance.

## Key Takeaways

1. ✓ **Well-formed vs Valid** - Validation requires a schema (DTD or XSD); well-formedness only checks XML syntax
2. ✓ **DTD Components** - ELEMENT definitions, ATTLIST declarations, content models (+, \*, ?, |, ,)
3. ✓ **Internal vs External** - Internal DTDs for single documents; external for reuse across documents
4. ✓ **Namespaces Prevent Collisions** - Use prefixes (b:title, r:title) or default namespaces to distinguish vocabularies
5. ✓ **Namespace URIs Are Identifiers** - Not actual URLs; they uniquely identify vocabularies
6. ✓ **DTD Limitations** - No advanced type system, weak constraint support; XSD is more powerful
7. ✓ **Modern Practice** - XSD is the current standard; DTD primarily for legacy systems and simple validation

---

**Previous:** [Week 1 - Foundations](../week01_foundations/)  
**Next:** [Week 3 - XML Schema (XSD)](../week03_xsd/)
