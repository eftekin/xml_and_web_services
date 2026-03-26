# Week 6: DOM & SAX Parsing

Programmatic XML processing in real applications: tree-based parsing (DOM) vs event-stream parsing (SAX), plus StAX-style alternatives.

## Learning Goals

By the end of Week 6, you should be able to:

1. Explain why XML parsing inside code is still necessary even with XPath/XSLT.
2. Compare DOM, SAX, and StAX-style parsing models.
3. Use core DOM APIs for reading, navigating, and modifying XML.
4. Build SAX handlers with robust state and text buffering.
5. Choose the right parser for file size, memory constraints, and use case.
6. Apply secure parsing practices (especially XXE prevention).

## Agenda (Lecture Structure)

1. Why programmatic parsing?
2. XML parsing landscape
3. DOM concepts and data model
4. DOM core API and navigation
5. DOM document modification
6. DOM code examples (Java, JavaScript, Python)
7. SAX concepts and event model
8. SAX handler interface and implementation
9. SAX examples and advanced patterns
10. DOM vs SAX decision guide
11. StAX and other alternatives
12. Best practices, pitfalls, and exercises

## Reference XML (used across examples)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
    <book category="fiction" id="b1">
        <title lang="en">The Great Gatsby</title>
        <author>F. Scott Fitzgerald</author>
        <year>1925</year>
        <price>12.99</price>
    </book>
    <book category="science" id="b2">
        <title lang="en">A Brief History of Time</title>
        <author>Stephen Hawking</author>
        <year>1988</year>
        <price>9.99</price>
    </book>
    <book category="fiction" id="b3">
        <title lang="en">Dune</title>
        <author>Frank Herbert</author>
        <year>1965</year>
        <price>14.99</price>
    </book>
</bookstore>
```

## 1) Why Programmatic Parsing?

XSLT and XPath are excellent for querying/transforming, but application code is needed for:

- API/data integration into objects or databases
- dynamic XML generation from runtime data
- business-rule validation beyond schema constraints
- very large file processing
- targeted incremental updates
- embedding XML logic in services, jobs, and frameworks

## 2) What Is an XML Parser?

An XML parser turns raw XML text into either:

- an in-memory structure (DOM tree), or
- a stream of parse events (SAX)

Core parser responsibilities:

1. Well-formedness checking (mandatory)
2. Optional validation (DTD/XSD when enabled)

## 3) Parsing Landscape: DOM, SAX, StAX

### DOM

- loads whole document in memory
- random access in any direction
- supports read and write
- easier to code
- memory intensive

### SAX

- event-driven streaming
- forward-only processing
- read-oriented (no output tree)
- very low memory footprint
- more complex state handling

### StAX (mainly Java)

- pull-based streaming
- your code controls event iteration
- lower memory, often simpler than SAX callbacks
- supports streaming reads and writes

Key idea: DOM trades memory for convenience; SAX/StAX trade convenience for scalability.

## 4) DOM Concepts and Data Model

DOM is a W3C standard (Levels 1-4 evolution). XML becomes a graph of `Node` objects.

Frequently encountered node types:

- `DOCUMENT_NODE` (9)
- `ELEMENT_NODE` (1)
- `ATTRIBUTE_NODE` (2)
- `TEXT_NODE` (3)
- `COMMENT_NODE` (8)
- `PROCESSING_INSTRUCTION_NODE` (7)
- `DOCUMENT_TYPE_NODE` (10)

Core `Node` properties include:

- `nodeName`, `nodeValue`, `nodeType`
- `parentNode`, `childNodes`, siblings
- `ownerDocument`, `textContent`

Important beginner pitfall: `childNodes` contains text nodes (including whitespace), not just elements.

## 5) DOM Core API and Navigation

Typical flow (Java):

```java
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(new File("bookstore.xml"));
doc.getDocumentElement().normalize();
Element root = doc.getDocumentElement();
```

Navigation patterns:

- `getElementsByTagName("book")`
- `getAttribute("category")`
- `getTextContent()`
- filter by `nodeType` when iterating `childNodes`

## 6) DOM in JavaScript and Python

### JavaScript (browser)

- `DOMParser().parseFromString(xml, 'application/xml')`
- inspect `parsererror`
- use `getElementsByTagName` or `querySelector`

### Node.js

- use a DOM-compatible package (for example `xmldom`)

### Python

- `xml.dom.minidom`: W3C-like DOM API
- `xml.etree.ElementTree`: Pythonic, simpler, not W3C DOM

## 7) DOM Modification Workflows

DOM supports full read/write:

- create nodes (`createElement`)
- set attributes (`setAttribute`)
- append/insert/replace/remove nodes
- update text (`setTextContent`)

Java serialization pattern:

```java
TransformerFactory tf = TransformerFactory.newInstance();
Transformer transformer = tf.newTransformer();
transformer.setOutputProperty(OutputKeys.INDENT, "yes");
transformer.transform(new DOMSource(doc), new StreamResult(new FileWriter("bookstore_updated.xml")));
```

## 8) SAX Concepts and Event Model

SAX is event-driven and forward-only. The parser triggers callbacks such as:

- `startDocument()` / `endDocument()`
- `startElement(...)` / `endElement(...)`
- `characters(...)`

Critical rule: `characters()` may fire multiple times for one logical text node. Always append to a buffer.

## 9) SAX Handler Implementation Patterns

### Basic handler approach

- track current context (flags or state)
- capture attributes in `startElement`
- append text in `characters`
- consume buffered text in `endElement`

### State machine approach (recommended for complex XML)

Use an enum-like state model instead of many booleans to make parser behavior explicit and maintainable.

### Error handling

Register an `ErrorHandler` (Java SAX) and treat parse/validation errors explicitly.

## 10) DOM vs SAX Decision Guide

Use DOM when:

- files are small to medium
- you need random access
- you need in-place modification
- implementation simplicity is preferred

Use SAX when:

- files are large (for example > 50 MB) or streamed
- you only need one sequential pass
- memory usage must stay minimal
- you are counting/filtering/extracting subsets

Rule of thumb from lecture: start with DOM, switch to SAX when memory/performance become bottlenecks.

## 11) Real-World Scenarios

- Small SOAP/XML API response: DOM
- Multi-GB export/log feed: SAX
- Startup config files: DOM
- High-volume counting/filtering jobs: SAX
- Programmatic SVG/XML editing: DOM
- Streaming feed readers: SAX

## 12) StAX and Other Alternatives

### StAX (Java)

- pull model (`reader.next()` loop)
- easier control flow than callbacks
- good for pipelines and mixed strategies

### Writing with StAX

`XMLStreamWriter` is an efficient way to emit XML programmatically.

### Python `iterparse()`

`xml.etree.ElementTree.iterparse()` gives streaming-like behavior.
Call `elem.clear()` after processing subtrees to keep memory low.

## 13) Best Practices

1. Always handle parser exceptions with clear diagnostics.
2. Normalize DOM (`normalize()`) after parsing when appropriate.
3. Filter `childNodes` by `nodeType`.
4. In SAX, always buffer/append in `characters()`.
5. Close readers/streams safely (`try-with-resources`, context managers).
6. Disable external entities to prevent XXE.

## 14) Security Focus: XXE Prevention

When parsing untrusted XML, disable dangerous features (example Java factory settings):

```java
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setXIncludeAware(false);
factory.setExpandEntityReferences(false);
```

Treat all external XML as untrusted input.

## 15) Common Pitfalls Quick Reference

- Unexpected extra DOM children from whitespace text nodes
- truncated SAX text from overwriting (not appending) in `characters()`
- reading SAX attributes in `endElement` (too late)
- skipping `normalize()` then seeing odd text behavior
- file-handle leaks from unclosed streams
- enabled external entities (XXE risk)
- wrong `replaceChild` argument order
- blocking parse assumptions in SAX
- using DOM for huge files and hitting `OutOfMemoryError`
- no registered SAX error handler

## 16) Practice Exercises

Use `bookstore.xml` and implement in Java or Python.

### DOM exercises

1. Print title/author/price for every book.
2. Print books where `category='fiction'`.
3. Add a new `<book>` and save to a new file.
4. Change first book price to `8.99`.
5. Remove books with `year < 1970`.
6. Count `<bookstore>` child elements while distinguishing element vs text nodes.

### SAX exercises

1. Print element open/close events.
2. Collect all titles and print at `endDocument()`.
3. Count total `<book>` elements.
4. Print books where `price < 12.00` using state tracking.
5. Build and print a `Map<String,String>` per book.
6. Register an `ErrorHandler` and test with malformed XML.

## Week 6 Summary

- DOM: easiest model, full tree, read/write, memory heavy.
- SAX: streaming callbacks, minimal memory, read-oriented, more state complexity.
- StAX/iterparse: useful middle ground for streaming with clearer control.
- Security and correctness (XXE hardening, buffering, node filtering) are essential in production XML processing.

---

**Previous:** [Week 5 - XSLT](../week05_xslt/)
**Next:** [Week 7 - REST](../week07_rest/)
