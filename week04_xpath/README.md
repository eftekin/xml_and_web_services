# Week 4: XPath

## The Problem

You have an XML document with hundreds of books. You need to find all books published after 2020. You could loop through everything, but that's tedious. XPath is the query language for XML—think SQL for databases, but for XML documents.

## XPath vs Loops

Compare two ways to find all books published after 2020:

**The Loop Way:**
```javascript
const allBooks = document.querySelectorAll('book');
const recentBooks = [];
for (let book of allBooks) {
  const year = parseInt(book.querySelector('year').textContent);
  if (year > 2020) {
    recentBooks.push(book);
  }
}
```

**The XPath Way:**
```xpath
//book[year > 2020]
```

XPath does in one expression what takes 5+ lines of code.

## XPath Syntax: The Basics

### Navigation

XPath lets you navigate the XML tree:

```xpath
/catalog                    <!-- Root element -->
/catalog/book              <!-- All <book> children of <catalog> -->
//book                      <!-- All <book> elements anywhere -->
//book/title                <!-- <title> elements inside any <book> -->
/catalog/book[1]/title      <!-- Title of first book -->
```

**Key characters:**
- `/` = child
- `//` = anywhere in the tree
- `[1]` = position (1-based, not 0-based!)
- `.` = current node
- `..` = parent node

### Attributes

Select elements by their attributes:

```xpath
/catalog/book[@id="123"]    <!-- Book with id attribute = "123" -->
//book[@available="true"]   <!-- Any book with available=true -->
//@id                        <!-- All id attributes anywhere -->
```

## Predicates: Filtering Data

Predicates are conditions inside `[brackets]`:

```xpath
//book[author="George Orwell"]     <!-- Books by specific author -->
//book[year > 2000]                 <!-- Books published after 2000 -->
//book[price < 20]                  <!-- Books under $20 -->
//book[author and isbn]             <!-- Books that have author AND isbn -->
//book[position() < 4]              <!-- First three books -->
```

### Working with Text

XPath functions work on text:

```xpath
//book[contains(title, "Adventure")]     <!-- Title contains "Adventure" -->
//book[starts-with(author, "J.R.")]     <!-- Author starts with "J.R." -->
//book[string-length(title) > 20]       <!-- Long titles (>20 characters) -->
//book[normalize-space(description)]    <!-- Has non-empty description -->
```

## Axes: Directions of Travel

XPath axes let you move in different directions from a node:

```xpath
//book/author                      <!-- children -->
/catalog/book                      <!-- children (with explicit /)
(/catalog//book)[1]/author         <!-- ancestor book's author
//author/..                        <!-- parent (ancestor) -->
//author/parent::book              <!-- parent (explicit axis) -->
//author/following-sibling::rating <!-- Siblings that come after -->
//author/preceding-sibling::title  <!-- Siblings that come before -->
//title/ancestor::*                <!-- All ancestors of any title -->
```

Common axes:
- `child::` - Direct children (default)
- `parent::` - Parent node
- `ancestor::` - Any ancestor
- `following-sibling::` - Siblings after this node
- `preceding-sibling::` - Siblings before this node
- `descendant::` - Any descendant

## XPath Functions

### Counting and Position

```xpath
count(//book)                    <!-- Total number of books -->
count(//book[year > 2020])       <!-- Number of recent books -->
position()                        <!-- Current position in result set -->
last()                            <!-- Last position -->
```

### String Functions

```xpath
concat('Book: ', //book[1]/title)    <!-- Combine strings -->
substring(//book[1]/title, 1, 5)     <!-- First 5 characters -->
string-length(//book[1]/title)       <!-- Number of characters -->
translate(//book[1]/author, ' ', '_') <!-- Replace spaces with underscores -->
```

### Math

```xpath
sum(//book/price)                <!-- Total of all prices -->
floor(//book[1]/price)           <!-- Round down -->
ceiling(//book[1]/price)         <!-- Round up -->
round(//book[1]/price)           <!-- Round to nearest -->
```

## Real Example: A Book Catalog

Given this XML:

```xml
<?xml version="1.0"?>
<catalog>
  <book id="001" available="true">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
    <price>13.99</price>
    <rating>4.5</rating>
  </book>
  <book id="002" available="true">
    <title>Brave New World</title>
    <author>Aldous Huxley</author>
    <year>1932</year>
    <price>14.99</price>
    <rating>4.2</rating>
  </book>
  <book id="003" available="false">
    <title>The Hobbit</title>
    <author>J.R.R. Tolkien</author>
    <year>1937</year>
    <price>15.99</price>
    <rating>4.7</rating>
  </book>
</catalog>
```

Useful XPath queries:

```xpath
//book[@available="true"]              <!-- Available books only -->
//book[price < 15]                     <!-- Cheaper books -->
//book[year > 1940]/title              <!-- Titles of post-1940 books -->
//book[rating >= 4.5]/author           <!-- Authors of highly-rated books -->
count(//book)                          <!-- Total books -->
sum(//book/price)                      <!-- Total inventory value -->
//book[position() = 1]/title            <!-- First book title -->
//author[contains(., 'Tolkien')]/..    <!-- Book(s) by Tolkien -->
```

## Why XPath Matters

XPath is used everywhere:
- **Web scraping** - Extract data from HTML/XML
- **API responses** - Parse XML responses
- **XSLT** - XPath is core to XSLT transformations
- **XQuery** - Building block for XML databases
- **Assertions** - Testing frameworks use XPath

Learning XPath gives you a superpower for working with structured data."

---

**Previous:** [Week 3 - XML Schema](../week03_xsd/)  
**Next:** [Week 5 - XSLT](../week05_xslt/)
