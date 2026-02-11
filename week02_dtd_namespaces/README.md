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

---

**Previous:** [Week 1 - Foundations](../week01_foundations/)  
**Next:** [Week 3 - XML Schema (XSD)](../week03_xsd/)
