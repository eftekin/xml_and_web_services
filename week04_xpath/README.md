# Week 4: XPath

W3C-standard query and navigation language for XML trees.

## Learning Goals

By the end of Week 4, you should be able to:

- Explain what XPath is and where it is used.
- Understand XPath node types and the XML tree model.
- Write absolute and relative location paths.
- Use axes, predicates, operators, and built-in functions.
- Build practical queries for filtering, counting, and navigating XML.

## Course Roadmap (XPath Portion)

1. What is XPath?
2. Node Types
3. Location Paths and Syntax
4. The 13 Axes
5. Predicates and Operators
6. Built-in Functions

## Reference XML (used in lecture examples)

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

## 1) What Is XPath?

XPath (XML Path Language) is an expression language for selecting nodes in XML.

- Standard: W3C Recommendation.
- Returns: node sets, strings, numbers, or booleans.
- Used by: XSLT, XQuery, DOM tooling, XML test/assertion tools.

## 2) XPath Node Types

XPath models XML as nodes. The seven node types are:

1. Document
2. Element
3. Attribute
4. Text
5. Comment
6. Processing Instruction
7. Namespace

Important rule: attributes are not child nodes.

```xpath
//book/title        /* element child */
//book/@category    /* attribute */
//book/*            /* all element children */
//book/@*           /* all attributes */
```

## 3) Expressions, Steps, and Paths

Each step conceptually follows:

`axis::node-test[predicate]`

### Absolute vs relative

- Absolute paths start with `/` (from document root).
- Relative paths start from current context node.

```xpath
/bookstore/book/title
//book
book/title
../title
./author
@category
```

### Wildcards and special tokens

```xpath
*           /* any element */
@*          /* any attribute */
node()      /* any node */
text()      /* text nodes */
comment()   /* comments */
.           /* current node */
..          /* parent node */
//          /* descendant-or-self shorthand */
```

### Union of paths

```xpath
//book/title | //book/price
//title | //price
```

## 4) Predicates (Filtering)

Predicates narrow node sets using `[...]`.

```xpath
//book[1]
//book[last()]
//book[position() <= 2]
//book[@category]
//book[@category='fiction']
//book[@id='b2']
//book[price]
//book[price < 10]
//book[title='Dune']
//book[@category='fiction'][price < 15]
```

## 5) The 13 XPath Axes

All axes:

- `child::`
- `parent::`
- `self::`
- `descendant::`
- `descendant-or-self::`
- `ancestor::`
- `ancestor-or-self::`
- `following::`
- `following-sibling::`
- `preceding::`
- `preceding-sibling::`
- `attribute::`
- `namespace::`

Most common in practice: `child::` (default), `@` (`attribute::`), `..` (`parent::`), and `//` (`descendant-or-self::node()/child::`).

### Forward examples

```xpath
child::book
descendant::title
descendant-or-self::book
following::book
following-sibling::book[1]
```

### Reverse examples

```xpath
parent::node()
ancestor::bookstore
ancestor-or-self::book
preceding-sibling::book[1]
preceding::title
```

## 6) Operators

### Comparison

- `=`, `!=`, `<`, `>`, `<=`, `>=`

### Logical

- `and`, `or`, `not()`

### Arithmetic

- `+`, `-`, `*`, `div`, `mod`

### Union and coercion

```xpath
//title | //author
//book[year = '1988']
//book[year = 1988]
//book[number(price) > 10]
```

XPath 1.0 has only one set operator: `|` (union).

## 7) Built-in Functions

### String functions

- `string()`
- `concat()`
- `string-length()`
- `substring()`
- `contains()`
- `starts-with()`
- `normalize-space()`
- `translate()`
- `ends-with()`, `upper-case()`, `lower-case()` in XPath 2.0+

### Node-set functions

- `count()`
- `last()`
- `position()`
- `name()`

### Number and boolean functions

- `number()`
- `sum()`
- `round()`
- `floor()`
- `ceiling()`
- `boolean()`
- `not()`
- `true()`
- `false()`
- `lang()`

`abs()` is available in XPath 2.0+.

## 20 Practical XPath Examples (Lecture Set)

```xpath
1.  //book
2.  //book[@category='fiction']
3.  //book[price < 10]
4.  //book[@category='fiction'][1]
5.  //book/title
6.  //book/title/text()
7.  //book/@id
8.  count(//book)
9.  sum(//price)
10. //book[last()]
11. //book[contains(title,'Brief')]
12. /bookstore/*
13. //book/preceding-sibling::book
14. //title[@lang]
15. //title[@lang='en']
16. //book[year > 1970]
17. //book[not(@category)]
18. string(//book[1]/title)
19. //book | //author
20. //*[@id]
```

## Practice Exercises (XPath)

Using the reference `bookstore.xml`:

1. Select all `<author>` elements.
2. Select books published after 1970.
3. Count books with `price > 10`.
4. Get the title of the most expensive book.
5. Select fiction books sorted by year.
6. Use `ancestor::` to find `bookstore` from a `price` node.

## Week 4 Key Takeaways

- XPath is the core language for XML navigation and selection.
- Mastering nodes, predicates, axes, and functions enables concise and powerful queries.
- These same XPath skills are directly reused in Week 5 (XSLT).

---

**Previous:** [Week 3 - XML Schema](../week03_xsd/)
**Next:** [Week 5 - XSLT](../week05_xslt/)
