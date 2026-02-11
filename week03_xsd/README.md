# Week 3: XML Schema (XSD)

## DTD to XSD

DTDs work, but they're limited. They can't really validate data types or values. What if a year should be a number between 1900 and 2100? DTD can't express that. What if an email must match an email pattern?

XSD (XML Schema) is DTD's more powerful cousin. It can validate data types, value ranges, patterns, and complex rules. Plus, it's written in XML itself (not weird DTD syntax).

## XSD Advantages Over DTD

DTDs work, but they're limited:

```dtd
<!ELEMENT year (#PCDATA)>  <!-- Can't specify: must be 4 digits, between 1900-2100 -->
<!ELEMENT email (#PCDATA)> <!-- Can't specify: must match email format -->
<!ELEMENT price (#PCDATA)> <!-- Can't specify: must be a decimal number -->
```

DTD treats everything as text. XSD can specify data types and constraints:

```xml
<xs:element name="year" type="xs:integer"/>
<xs:element name="email" type="xs:email"/>
<xs:element name="price" type="xs:decimal"/>
```

Better yet, you can define restrictions:

```xml
<xs:element name="year" type="xs:integer">
  <xs:restriction base="xs:integer">
    <xs:minInclusive value="1900"/>
    <xs:maxInclusive value="2100"/>
  </xs:restriction>
</xs:element>
```

Now `<year>3000</year>` would be INVALID. The parser catches it.

## XSD File Structure

XSD documents are XML documents themselves (unlike DTD's weird syntax):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <!-- Schema definitions go here -->
</xs:schema>
```

The namespace `http://www.w3.org/2001/XMLSchema` is the official XSD namespace.

## Simple Types

Simple types hold text or numbers with no child elements:

```xml
<xs:element name="title" type="xs:string"/>
<xs:element name="price" type="xs:decimal"/>
<xs:element name="published" type="xs:integer"/>
<xs:element name="available" type="xs:boolean"/>
```

Common XSD types:

- `xs:string` - Text
- `xs:integer` - Whole numbers
- `xs:decimal` - Numbers with decimals
- `xs:boolean` - true/false
- `xs:date` - Date (2024-01-15)
- `xs:email` - Email addresses
- `xs:anyURI` - URLs

## Complex Types

Complex types contain child elements or attributes:

```xml
<xs:complexType name="BookType">
  <xs:sequence>
    <xs:element name="title" type="xs:string"/>
    <xs:element name="author" type="xs:string"/>
    <xs:element name="year" type="xs:integer"/>
  </xs:sequence>
  <xs:attribute name="id" type="xs:integer" use="required"/>
</xs:complexType>

<xs:element name="book" type="BookType"/>
```

This defines what a book looks like, then creates an element of that type.

## Occurrence Indicators

How many times can elements appear?

```xml
<!-- Exactly once (default) -->
<xs:element name="title" type="xs:string"/>

<!-- Zero or one -->
<xs:element name="isbn" type="xs:string" minOccurs="0" maxOccurs="1"/>

<!-- One or more -->
<xs:element name="author" type="xs:string" minOccurs="1" maxOccurs="unbounded"/>

<!-- Zero or more -->
<xs:element name="tag" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
```

## Using XSD in Your XML

Once you have an XSD, point your XML document to it:

```xml
<?xml version="1.0"?>
<catalog xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://books.com book-schema.xsd">
  <book id="1">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
  </book>
</catalog>
```

Now parsers can validate your XML against book-schema.xsd.

## Complete XSD Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <!-- Define what a book looks like -->
  <xs:complexType name="BookType">
    <xs:sequence>
      <xs:element name="title" type="xs:string"/>
      <xs:element name="author" type="xs:string"/>
      <xs:element name="year" type="xs:integer">
        <xs:restriction base="xs:integer">
          <xs:minInclusive value="1000"/>
          <xs:maxInclusive value="2100"/>
        </xs:restriction>
      </xs:element>
      <xs:element name="price" type="xs:decimal" minOccurs="0"/>
    </xs:sequence>
    <xs:attribute name="id" type="xs:integer" use="required"/>
    <xs:attribute name="available" type="xs:boolean" default="true"/>
  </xs:complexType>

  <!-- Define the root element -->
  <xs:element name="catalog">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="book" type="BookType" maxOccurs="unbounded"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>

</xs:schema>
```

This XSD says:

- A catalog contains one or more books
- Each book has: title (string), author (string), year (1000-2100), optional price (decimal)
- Each book has a required id attribute and optional available attribute"

---

**Previous:** [Week 2 - DTDs & Namespaces](../week02_dtd_namespaces/)  
**Next:** [Week 4 - XPath](../week04_xpath/)
