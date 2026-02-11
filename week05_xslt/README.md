# Week 5: XSLT

## The Problem

You have XML data. You want to display it as HTML on a website. Or convert it to CSV. Or transform it into a different XML schema. You could write code to loop and extract and rebuild, but XSLT is purpose-built for this.

XSLT (eXtensible Stylesheet Language Transformations) is XML's transformation language. You define templates for different elements, and XSLT applies them to transform your data.

## How XSLT Works

XSLT is a transformation engine:

```
Input XML Document  +  XSLT Stylesheet  →  Output (HTML, CSV, different XML, etc.)
```

You write rules (templates) that say: "When you encounter element X, transform it to Y."

**Example:** You have a book catalog in XML. You want it as HTML for a website:

```xml
<!-- Input: book.xml -->
<catalog>
  <book>
    <title>1984</title>
    <author>George Orwell</author>
    <price>13.99</price>
  </book>
</catalog>
```

Your XSLT says: "Turn each book element into an HTML table row."

```xml
<!-- book.xsl -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/catalog">
    <html><body>
      <table border="1">
        <xsl:apply-templates select="book"/>
      </table>
    </body></html>
  </xsl:template>

  <xsl:template match="book">
    <tr>
      <td><xsl:value-of select="title"/></td>
      <td><xsl:value-of select="author"/></td>
      <td><xsl:value-of select="price"/></td>
    </tr>
  </xsl:template>
</xsl:stylesheet>
```

Result:

```html
<html><body>
  <table border="1">
    <tr>
      <td>1984</td>
      <td>George Orwell</td>
      <td>13.99</td>
    </tr>
  </table>
</body></html>
```

## Core XSLT Elements

### `<xsl:template match="...">`

Defines a rule: "When you find nodes matching this pattern, do this."

```xml
<xsl:template match="/catalog">  <!-- Match root element -->
  <!-- Transform it here -->
</xsl:template>

<xsl:template match="book">  <!-- Match any <book> element -->
  <!-- Transform it here -->
</xsl:template>

<xsl:template match="book[@available='true']">  <!-- Match only available books -->
  <!-- Transform it here -->
</xsl:template>
```

### `<xsl:value-of select="...">`

Output the value of a node:

```xml
<xsl:value-of select="title"/>  <!-- Output the book's title -->
<xsl:value-of select="../title"/>  <!-- Output parent's title -->
<xsl:value-of select="//author[1]"/>  <!-- First author in document -->
```

### `<xsl:for-each select="...">`

Loop through multiple nodes:

```xml
<!-- For each book in the catalog -->
<xsl:for-each select="book">
  <div>
    <h2><xsl:value-of select="title"/></h2>
    <p>By: <xsl:value-of select="author"/></p>
  </div>
</xsl:for-each>
```

### `<xsl:if test="...">`

Conditional output:

```xml
<!-- Only output price if available is true -->
<xsl:if test="@available='true'">
  Price: <xsl:value-of select="price"/>
</xsl:if>

<!-- Only output if price is high -->
<xsl:if test="price > 50">
  <span class="expensive">Luxury item</span>
</xsl:if>
```

### `<xsl:choose>` (Like switch/case)

```xml
<xsl:choose>
  <xsl:when test="price < 10">
    <span>Budget friendly</span>
  </xsl:when>
  <xsl:when test="price < 30">
    <span>Moderate price</span>
  </xsl:when>
  <xsl:otherwise>
    <span>Premium item</span>
  </xsl:otherwise>
</xsl:choose>
```

### `<xsl:apply-templates>`

Process child elements using their templates:

```xml
<!-- Process all children of catalog -->
<xsl:apply-templates/>

<!-- Process only book children -->
<xsl:apply-templates select="book"/>

<!-- Process in a specific order -->
<xsl:apply-templates select="book">
  <xsl:sort select="price"/>
</xsl:apply-templates>
```

## Complete Transformation Example

Transform a catalog to interactive HTML:

```xml
<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Root template -->
  <xsl:template match="/catalog">
    <html>
      <head>
        <title>Book Catalog</title>
        <style>
          .book { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
          .expensive { color: red; font-weight: bold; }
          .cheap { color: green; }
        </style>
      </head>
      <body>
        <h1>Our Books</h1>
        <xsl:apply-templates select="book">
          <xsl:sort select="price"/>
        </xsl:apply-templates>
      </body>
    </html>
  </xsl:template>

  <!-- Book template -->
  <xsl:template match="book">
    <div class="book">
      <h2><xsl:value-of select="title"/></h2>
      <p>Author: <xsl:value-of select="author"/></p>
      <p>
        Price:
        <xsl:choose>
          <xsl:when test="price > 20">
            <span class="expensive">$<xsl:value-of select="price"/></span>
          </xsl:when>
          <xsl:otherwise>
            <span class="cheap">$<xsl:value-of select="price"/></span>
          </xsl:otherwise>
        </xsl:choose>
      </p>
      <xsl:if test="@available='true'">
        <p style="color:green;">✓ In stock</p>
      </xsl:if>
    </div>
  </xsl:template>

</xsl:stylesheet>
```

## When to Use XSLT

**Good for:**

- Converting XML to HTML for display
- Transforming between XML schemas
- Batch processing XML documents
- Server-side templating
- SOAP web services

**Not ideal for:**

- Complex business logic (use a programming language)
- Real-time transformations (can be slow)
- Interactive processing (static transformations)

**Industry use:**

- Banks transform financial data between systems
- Publishers convert different manuscript formats
- Government data exchange pipelines
- Enterprise integrations (ESB - Enterprise Service Bus)

---

**Previous:** [Week 4 - XPath](../week04_xpath/)  
**Next:** [Week 6 - DOM & SAX](../week06_dom_sax/)
