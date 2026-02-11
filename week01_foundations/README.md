# Week 1: XML Fundamentals

## Why This Matters

XML is everywhere. Banks use it for transactions. Airlines use it for reservations. Governments use it for data exchange. Your phone might sync data using XML. It's designed to be both human-readable and machine-parseable—data that you can actually read and understand while computers can process it reliably.

Before JSON and REST APIs became standard, XML was THE way systems talked to each other. Understanding XML teaches you core concepts that apply to modern APIs too.

## What is XML?

XML = eXtensible Markup Language. The key word is "extensible"—you design your own tags.

Compare:

- **HTML**: Fixed tags like `<p>`, `<div>`, `<img>` designed for displaying content
- **XML**: You define tags like `<book>`, `<author>`, `<price>` for describing content

HTML says "display this as a paragraph." XML says "this is a book catalog." The difference: XML is about meaning.

### Why Should You Care?

When systems need to talk to each other, they need to agree on format. XML provides:

- **Human readability** - You can read `<title>The Great Gatsby</title>` and instantly understand it
- **Machine parseability** - Computers can reliably extract structure and data
- **Self-describing** - The tags tell you what data they contain
- **Extensibility** - Add new tags without changing the standard

Examples in the wild:

- Bank transactions (ISO 20022 uses XML)
- Medical records (HL7, DICOM)
- Government data exchange
- RSS feeds (XML format)
- Configuration files (Maven, Ant, Spring)

## The Five Rules of Well-Formed XML

XML documents must follow strict rules. Break them, and the document is broken:

### 1. Single Root Element

Every XML document has exactly ONE root element that contains everything:

```xml
<?xml version="1.0"?>
<catalog>         <!-- This is the root element -->
  <book>...</book>
  <book>...</book>
</catalog>
```

NOT valid:

```xml
<book>...</book>
<book>...</book>  <!-- ERROR: Two root elements -->
```

### 2. Proper Nesting

Tags must close in reverse order of opening (like parentheses in math):

```xml
<!-- Correct -->
<book>
  <author>Stephen King</author>
</book>

<!-- WRONG -->
<book>
  <author>Stephen King
</book>
</author>  <!-- Closed in wrong order -->
```

### 3. All Tags Must Close

Every opening tag needs a closing tag (or self-close):

```xml
<!-- Correct -->
<description>This is text</description>

<!-- Also correct (self-closing) -->
<image src="cover.jpg" />

<!-- WRONG -->
<description>This is text
```

### 4. Case Sensitivity

`<Title>` and `<title>` are DIFFERENT tags:

```xml
<book>
  <title>XML Basics</title></Title>  <!-- ERROR: title vs Title -->
</book>
```

### 5. Special Characters Must Be Escaped

Some characters have special meaning in XML. To include them in content, use entities:

```xml
<!-- RIGHT -->
<description>Widgets cost &lt;$5 &amp; are great</description>

<!-- WRONG -->
<description>Widgets cost <$5 & are great</description>
```

The five you need to know:

- `&lt;` → `<`
- `&gt;` → `>`
- `&amp;` → `&`
- `&quot;` → `"`
- `&apos;` → `'`

## Elements vs Attributes

XML lets you store data in two ways:

```xml
<book isbn="978-0-13-110362-7">
  <title>The C Programming Language</title>
  <author>Brian Kernighan</author>
</book>
```

Here:

- `isbn` is an **attribute**
- `title` and `author` are **elements** (child elements)

When do you use which?

**Use attributes for:**

- Metadata about the element (ID, type, status)
- Fixed set of possible values
- Don't need child elements

**Use elements for:**

- Actual content/data
- Anything that might have sub-structure
- Anything that might repeat in an unordered way

Example: A book might have multiple authors, but only one ISBN:

```xml
<book isbn="123">  <!-- Attribute makes sense: one ID per book -->
  <title>...</title>
  <author>Author 1</author>
  <author>Author 2</author>  <!-- Elements make sense: can repeat -->
</book>
```

## Practical Example: A Book Catalog

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="001">
    <title>The Hobbit</title>
    <author>J.R.R. Tolkien</author>
    <year>1937</year>
    <price>15.99</price>
    <description>A fantasy adventure about a small hobbit</description>
  </book>

  <book id="002">
    <title>Dune</title>
    <author>Frank Herbert</author>
    <year>1965</year>
    <price>18.99</price>
    <description>Epic science fiction set on a desert planet</description>
  </book>
</catalog>
```

Notice:

- The XML declaration at the top
- One root element (`<catalog>`)
- Proper nesting (each `<book>` fully contained)
- Both elements (like `<title>`) and attributes (like `id`)
- All tags properly closed
- No special characters needing escaping

## Understanding the XML Declaration

Every XML document should start with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

This tells XML parsers:

- This is XML, version 1.0
- The text encoding is UTF-8 (supports all world languages)

## What's Next?

Now you can write well-formed XML. But your documents could be ANY shape:

```xml
<book>Hamlet</book>      <!-- Is this a valid book? -->
<book><title>Hamlet</title><author>Shakespeare</author></book>  <!-- How about this? -->
```

Both are well-formed, but are they CORRECT? Week 2 introduces **DTDs**, which are rules that define "correct" structure. Week 3 goes deeper with **XML Schema** for powerful validation."

## Assessment

- Understanding of distributed systems concepts
- Ability to write well-formed XML documents
- Recognition of XML syntax errors
- Knowledge of XML vs other formats

## Additional Resources

- [XML Specification (W3C)](https://www.w3.org/TR/xml/)
- [XML Tutorial - W3Schools](https://www.w3schools.com/xml/)
- [Learn X in Y Minutes: XML](https://learnxinyminutes.com/docs/xml/)

---

**Next Week:** [Week 2 - Document Modeling: DTDs & Namespaces](../week02_dtd_namespaces/)
