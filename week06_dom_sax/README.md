# Week 6: DOM & SAX

## Two Ways to Parse XML

You have an XML file. You need to read it in your code. There are two fundamentally different approaches:

**DOM** - Load the whole thing into memory as a tree, then navigate it

**SAX** - Stream through it, triggering events as you encounter elements

Each has tradeoffs.

## The Trade-off: Speed vs Simplicity

### DOM: "Load It All"

**How it works:**

1. Parse entire XML file
2. Build a tree structure in memory
3. Navigate the tree with code

**Example in Python:**

```python
import xml.etree.ElementTree as ET

# Load entire file
tree = ET.parse('books.xml')
root = tree.getroot()

# Navigate freely
for book in root.findall('book'):
    title = book.find('title').text
    author = book.find('author').text
    print(f"{title} by {author}")

# Can modify and save
for book in root.findall('book'):
    price_elem = book.find('price')
    if price_elem is not None:
        current = float(price_elem.text)
        price_elem.text = str(current * 1.10)  # 10% increase

tree.write('books_updated.xml')
```

**Advantages:**

- Easy to code - navigate like JavaScript DOM
- Can jump anywhere in document
- Can modify and save back
- Good for small files

**Disadvantages:**

- Loads entire file in memory (100MB file = 100MB+ RAM)
- Slow for huge files (consider 1GB XML file!)
- Wasteful if you only need part of the data

**Use DOM when:**

- File is small enough to fit in memory
- You need to modify the XML
- You need random access (jump around)
- Simplicity matters more than performance

### SAX: "Stream It"

**How it works:**

1. Start reading the file
2. Fire events as you encounter each element
3. Process one element at a time
4. Never store the whole tree

**Example in Python:**

````python
import xml.sax
from xml.sax.handler import ContentHandler

class BookHandler(ContentHandler):
    def __init__(self):
        self.current = {}
        self.in_book = False

    def startElement(self, name, attrs):
        if name == 'book':
            self.in_book = True
            self.current = {}
        elif self.in_book and name in ['title', 'author', 'price']:
            self.buffer = []

    def characters(self, content):
        if self.in_book:
            if hasattr(self, 'buffer'):
                self.buffer.append(content)

    def endElement(self, name):
        if self.in_book and name in ['title', 'author', 'price']:
            self.current[name] = ''.join(self.buffer).strip()
        elif name == 'book':
            print(f"{self.current.get('title')} by {self.current.get('author')}")
            self.in_book = False

# Use it
handler = BookHandler()
xml.sax.parse('books.xml', handler)
```

**Advantages:**
- Low memory usage (reads one element at a time)
- Fast even on huge files (1GB+ files)
- Perfect for Big Data processing
- Good for streaming (data coming from network)

**Disadvantages:**
- More complex code (event-driven)
- Can't jump around (must process sequentially)
- Can't modify original file
- Harder to understand/debug

**Use SAX when:**
- File is too large for memory
- You only need certain elements
- Reading speed is critical
- Data comes from a stream

## Real-World Comparisons

**Scenario 1: User's book collection (50 books)**
```
File size: ~500KB
Best approach: DOM
Reason: Small, user might want to edit in UI
Code simplicity wins over memory
```

**Scenario 2: Processing million stock transactions**
```
File size: ~2GB
Best approach: SAX
Reason: Huge file, only need totals/summaries
Memory/speed critical
```

**Scenario 3: Web API that returns XML**
```
File size: ~100KB (typical API response)
Best approach: DOM
Reason: Manageable size, need flexible access
Simplicity for quick parsing
```

**Scenario 4: Data pipeline processing 10,000+ files**
```
File size: Each ~5MB, total ~50GB
Best approach: SAX
Reason: Need to process all efficiently
Memory matters when processing at scale
```

## Practical DOM Example

```python
import xml.etree.ElementTree as ET

# Parse XML
xml_string = '''<?xml version="1.0"?>
<library>
  <book id="1">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
  </book>
  <book id="2">
    <title>Dune</title>
    <author>Frank Herbert</author>
    <year>1965</year>
  </book>
</library>
'''

root = ET.fromstring(xml_string)

# Find specific book
first_book = root.find('book')
print(f"First book: {first_book.find('title').text}")

# Find all books
for book in root.findall('book'):
    title = book.find('title').text
    attr_id = book.get('id')
    print(f"Book {attr_id}: {title}")

# XPath works too!
recent_books = root.findall(".//book[int(year) > 1950]")
print(f"Modern books: {len(recent_books)}")
```

## Industries Still Using XML

- **Finance**: SWIFT messages, FIX protocol, ISO 20022
- **Healthcare**: HL7, DICOM (medical imaging)
- **Government**: EDI, data exchange standards
- **Publishing**: EPUB (e-books), XML-based workflows
- **Web Services**: SOAP, REST APIs with XML responses
- **Configuration**: Maven, Ant, Spring, Office formats (DOCX, XLSX)

XML parsing (DOM/SAX) is still a core skill for enterprise systems."

---

**Previous:** [Week 5 - XSLT](../week05_xslt/)
**Next:** [Week 7 - REST](../week07_rest/)
```
