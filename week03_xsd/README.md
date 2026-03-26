# Week 3: XML Schema (XSD)

Type-safe XML validation with rich data types, reusable schema design, and practical patterns.

## Learning Objectives

By the end of this week, you should be able to:

- Explain why XSD exists and how it improves on DTD.
- Write valid XML Schema documents using proper XSD syntax.
- Use built-in data types (`xs:string`, `xs:integer`, `xs:decimal`, `xs:date`, `xs:boolean`, etc.).
- Create custom simple types with facets (`pattern`, `enumeration`, range and length constraints).
- Design complex types using `xs:sequence`, `xs:choice`, `xs:all`, and attributes.
- Validate XML instances against `.xsd` schemas.
- Apply practical schema design patterns for reusable, maintainable schemas.

## Agenda (from lecture)

1. Part 1: Why XML Schema? XSD vs DTD
2. Part 2: XSD Structure and Basic Syntax
3. Part 3: Built-in Data Types
4. Part 4: Simple Types and Restrictions
5. Part 5: Complex Types and Elements
6. Part 6: Practical XSD Design Patterns

## Part 1: Why XML Schema?

### DTD limitations (recap)

- No strong data typing: most content is just text (`#PCDATA`).
- DTD is not XML syntax.
- Limited/awkward namespace handling.
- Limited occurrence control (`?`, `*`, `+` only).
- No true type derivation (inheritance-style reuse).
- Weak in-schema documentation support.

### Why XSD

XSD addresses those gaps:

- 44+ built-in data types.
- Written in XML.
- First-class namespace support.
- Precise occurrence control via `minOccurs`/`maxOccurs`.
- Type derivation with extension and restriction.
- Built-in documentation (`xs:annotation`, `xs:documentation`, `xs:appinfo`).

### DTD vs XSD at a glance

- Syntax: DTD custom syntax vs XML syntax.
- Data types: text-only vs rich typed system.
- Namespaces: limited vs full support.
- Occurrences: symbolic only vs exact numeric ranges.
- Reuse/derivation: weak vs strong.
- Industry usage: mostly legacy vs modern standard.

### Same validation task, different result

DTD can accept invalid business data like `<price>abc</price>`.
XSD can reject it immediately by declaring `price` as `xs:decimal`.

### When to use DTD vs XSD

Use DTD for legacy compatibility and very simple structures.
Use XSD for new projects, web services, namespaces, and strict validation.

## Part 2: XSD Structure and Basic Syntax

### XSD file basics

- File extension: `.xsd`
- Namespace URI: `http://www.w3.org/2001/XMLSchema`
- Root element: `xs:schema`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <!-- declarations -->
</xs:schema>
```

### First complete example

Schema (`note.xsd`):

```xml
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="note">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="to" type="xs:string"/>
        <xs:element name="from" type="xs:string"/>
        <xs:element name="heading" type="xs:string"/>
        <xs:element name="body" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

XML instance (`note.xml`):

```xml
<?xml version="1.0"?>
<note xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="note.xsd">
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me!</body>
</note>
```

### `xs:element` declaration

```xml
<xs:element name="firstname" type="xs:string"/>
<xs:element name="age" type="xs:integer"/>
<xs:element name="price" type="xs:decimal"/>
<xs:element name="active" type="xs:boolean"/>
```

Common attributes:

- `name`
- `type`
- `default`
- `fixed`
- `minOccurs`
- `maxOccurs`

### Simple vs complex elements

- Simple element: text only.
- Complex element types:

1. Empty (attributes only)
2. Elements only
3. Text + attributes (`simpleContent`)
4. Mixed text + elements (`mixed="true"`)

### Connecting XML to XSD

No target namespace:

```xml
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="schema.xsd">
</root>
```

With target namespace:

```xml
<root xmlns="http://example.com/myschema"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://example.com/myschema schema.xsd">
</root>
```

## Part 3: Built-in Data Types

### Type hierarchy

`xs:anyType` is the root type. Built-in primitive and derived types branch from it, and custom types derive from those.

### String-related types

- `xs:string`
- `xs:normalizedString`
- `xs:token`
- `xs:language`
- `xs:Name`
- `xs:NCName`
- `xs:ID`
- `xs:IDREF`

### Numeric types

- `xs:decimal`
- `xs:integer`
- `xs:long`
- `xs:int`
- `xs:short`
- `xs:byte`
- `xs:positiveInteger`
- `xs:nonNegativeInteger`
- `xs:negativeInteger`
- `xs:float`
- `xs:double`

### Date/time types (ISO 8601)

- `xs:date`
- `xs:time`
- `xs:dateTime`
- `xs:duration`
- `xs:gYear`
- `xs:gMonth`
- `xs:gDay`
- `xs:gYearMonth`
- `xs:gMonthDay`

### Other commonly used built-ins

- `xs:boolean`
- `xs:anyURI`
- `xs:base64Binary`
- `xs:hexBinary`
- `xs:QName`
- `xs:NOTATION`

## Part 4: Simple Types and Restrictions

Create custom types with `xs:simpleType` + `xs:restriction`.

```xml
<xs:simpleType name="ageType">
  <xs:restriction base="xs:integer">
    <xs:minInclusive value="0"/>
    <xs:maxInclusive value="150"/>
  </xs:restriction>
</xs:simpleType>
```

### Facets covered

- `length`, `minLength`, `maxLength`
- `pattern`
- `enumeration`
- `minInclusive`, `maxInclusive`
- `minExclusive`, `maxExclusive`
- Also used later: `fractionDigits`, `whiteSpace`

### Pattern examples

- US phone: `\d{3}-\d{3}-\d{4}`
- Email: `[^@]+@[^@]+\.[^@]+`
- ZIP code: `\d{5}(-\d{4})?`
- ISBN-13 style: `978-\d-\d{2}-\d{6}-\d`

### Enumeration examples

T-shirt sizes (`XS`, `S`, `M`, `L`, `XL`, `XXL`) and order statuses (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).

### Length and range examples

- Country code length exactly 2.
- Username length 3..20.
- Percentage range 0..100.
- Positive price with 2 fractional digits.
- Product code combining `length` and `pattern`.

## Part 5: Complex Types and Elements

### Inline vs named complex types

- Inline (anonymous): quick, not reusable.
- Named types: reusable and clearer in larger schemas.

### Content models

1. `xs:sequence`: ordered children.
2. `xs:choice`: one of many.
3. `xs:all`: any order, each child max once.

### Occurrence control

DTD equivalents in XSD:

- Exactly once: `minOccurs="1" maxOccurs="1"` (default)
- Optional (`?`): `0..1`
- One or more (`+`): `1..unbounded`
- Zero or more (`*`): `0..unbounded`
- Exact ranges, e.g. `2..5`

### Attributes in complex types

Attributes are declared after content models (`sequence`/`choice`/`all`).

Useful properties:

- `name`
- `type`
- `use` (`required`, `optional`, `prohibited`)
- `default`
- `fixed`

### Text + attributes: `xs:simpleContent`

For values like:

```xml
<price currency="USD">29.99</price>
```

Use `xs:complexType` + `xs:simpleContent` + `xs:extension base="..."`.

### Empty elements (attributes only)

Define a complex type with only attributes and no content model.

### Mixed content

Use `mixed="true"` to allow text and child elements interleaved.

## Part 6: Practical XSD Design Patterns

### Named types for reuse

Define once, use many times. Benefits:

- DRY
- Single point of change
- Consistency
- Better readability

### Type extension (inheritance-like)

Use `xs:complexContent` + `xs:extension` to add fields to a base type.

### Type restriction

- Restrict simple types via facets.
- Restrict complex types by tightening allowed structure/content.

### Modular schema design

- `xs:include` for same target namespace.
- `xs:import` for different target namespace.

### Global vs local declarations

- Global elements (children of `xs:schema`) are reusable and can be roots.
- Local elements are scoped within their parent type.

## Complete Bookstore Example (from lecture)

The lecture builds a complete bookstore schema with:

- Simple types: `isbnType`, `priceType`, `categoryType`
- Complex types: `authorType`, `bookType`
- Root element: `bookstore`
- Validation-ready instance XML using `xsi:noNamespaceSchemaLocation`

You can cross-reference this week’s example files:

- `examples/bookstore_schema.xsd`
- `examples/valid_instance_example.xml`

## Hands-On Exercise: Music Library Schema

### Requirements

Build an XSD where:

- Root: `musicLibrary` with required `name` attribute
- Contains multiple `album` elements
- `album` has `title`, `artist`, `year`, `genre`, and one-or-more tracks
- `year` range: 1900..2100
- `genre` enum: `rock`, `pop`, `jazz`, `classical`
- `track` includes `name`, `duration` (seconds, positive integer), and required `trackNumber` attribute

### Suggested types

- Simple: `yearType`, `genreType`
- Complex: `trackType`, `albumType`

### Solution highlights from lecture

The provided solution defines:

- `yearType` via `minInclusive`/`maxInclusive`
- `genreType` via `enumeration`
- `trackType` with required `trackNumber`
- `albumType` with nested `tracks/track` and `maxOccurs="unbounded"`
- root `musicLibrary` with repeated `album`

## Common XSD Mistakes to Avoid

- Defining derived types before base types.
- Putting `maxOccurs` on `xs:complexType` instead of `xs:element`.
- Missing `xs:` prefix on schema vocabulary.
- Misspelling facets (`minInclusive`, `maxOccurs`, etc.).
- Declaring attributes inside `xs:sequence`.
- Using `default` with required attributes.
- Forgetting to close schema/type tags.
- Confusing element names and type names.

## Additional Advanced Topics Covered

### XSD vs other schema languages

- DTD: simple/fast, limited typing.
- XSD: rich types, standard tooling, verbose.
- RELAX NG: simpler style, less tooling.
- Schematron: rule-based constraints; often complementary with XSD.

### Whitespace handling (`xs:whiteSpace`)

- `preserve`
- `replace`
- `collapse`

### Schema annotations

- `xs:documentation` for humans.
- `xs:appinfo` for tools and integration metadata.

### Keys and references

- `xs:key` for uniqueness.
- `xs:keyref` for referential integrity.

### Substitution groups

Polymorphic element substitution using `substitutionGroup`.

### Default and fixed values

- `default`: used when omitted/empty.
- `fixed`: value cannot vary.

### Nillable elements

Set `nillable="true"` and use `xsi:nil="true"` for explicit null semantics.

## Quick Validation Workflow

1. Write your schema in `.xsd`.
2. Link XML to schema using `xsi:noNamespaceSchemaLocation` or `xsi:schemaLocation`.
3. Validate with an XML editor or validator.
4. Fix by reading validator messages from top to bottom.

## Week 3 Summary

- XSD is the modern, typed, namespace-aware schema language for XML.
- Built-in types plus custom restrictions let you encode real data rules.
- Complex types model structure precisely with reusable design.
- Extension/restriction and modularization support scalable schema design.
- You are now ready for querying validated XML in Week 4 (XPath/XQuery).

---

**Previous:** [Week 2 - DTDs & Namespaces](../week02_dtd_namespaces/)
**Next:** [Week 4 - XPath](../week04_xpath/)
