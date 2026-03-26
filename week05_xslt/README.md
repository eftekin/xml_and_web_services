# Week 5: XSLT

XML-based transformation language for producing HTML, XML, and text output from XML input.

## Learning Goals

By the end of Week 5, you should be able to:

- Explain what XSLT is and how it uses XPath.
- Write valid XSLT stylesheets and template rules.
- Use `xsl:apply-templates`, `xsl:value-of`, and `xsl:for-each` effectively.
- Apply sorting and conditional logic (`xsl:sort`, `xsl:if`, `xsl:choose`).
- Build reusable transformations with variables, parameters, modes, and named templates.
- Transform XML to HTML with a complete multi-template stylesheet.

## XSLT in One Line

`Input XML + XSLT Stylesheet -> Output (HTML/XML/text)`

XSLT is declarative: you define matching templates, and the processor applies them.

## 1) What Is XSLT?

XSLT (Extensible Stylesheet Language Transformations):

- Standard: W3C Recommendation.
- Language: XML vocabulary (stylesheets are XML documents).
- Query engine: XPath.
- Output: HTML, XML, text, and more (with related technologies).

## 2) Stylesheet Structure

Minimal structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <!-- root template -->
  </xsl:template>

  <xsl:template match="book">
    <!-- book template -->
  </xsl:template>

</xsl:stylesheet>
```

`xsl:transform` can be used as an equivalent root element name.

## 3) Output Control with `xsl:output`

Common settings:

```xml
<xsl:output method="html" version="5" encoding="UTF-8" indent="yes"/>
<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:output method="text" encoding="UTF-8"/>
```

Key attributes: `method`, `encoding`, `indent`, and optional doctype controls.

## 4) Templates and Matching

### `xsl:template`

`match` contains an XPath expression.

```xml
<xsl:template match="/">...</xsl:template>
<xsl:template match="book">...</xsl:template>
<xsl:template match="book[@category='fiction']">...</xsl:template>
```

### `xsl:apply-templates`

Delegates processing to matching templates.

```xml
<xsl:apply-templates/>
<xsl:apply-templates select="book"/>
<xsl:apply-templates select="book" mode="summary"/>
```

Without `select`, all child nodes are processed, including text nodes.

### `xsl:value-of`

Outputs string value of an XPath expression.

```xml
<xsl:value-of select="title"/>
<xsl:value-of select="@category"/>
<xsl:value-of select="price * 1.1"/>
```

Use `xsl:copy-of` when you need to copy full node subtrees (not just string values).

## 5) Looping, Sorting, and Conditionals

### `xsl:for-each`

```xml
<xsl:for-each select="book">
  <p><xsl:value-of select="title"/></p>
</xsl:for-each>
```

### `xsl:sort`

```xml
<xsl:for-each select="book">
  <xsl:sort select="price" data-type="number" order="ascending"/>
</xsl:for-each>
```

Sort attributes: `select`, `data-type`, `order`, `case-order`, `lang`.

### `xsl:if`

```xml
<xsl:if test="price &lt; 12">
  <span class="cheap"><xsl:value-of select="title"/></span>
</xsl:if>
```

Inside XML attributes, `<` must be escaped as `&lt;`.

### `xsl:choose`

```xml
<xsl:choose>
  <xsl:when test="@category='fiction'">...</xsl:when>
  <xsl:when test="@category='science'">...</xsl:when>
  <xsl:otherwise>...</xsl:otherwise>
</xsl:choose>
```

## 6) Reuse and Parameterization

### Variables and parameters

```xml
<xsl:variable name="tax" select="0.1"/>
<xsl:param name="lang" select="'en'"/>
```

- Variables are immutable.
- Parameters can be passed from caller context.

### Named templates

```xml
<xsl:template name="displayPrice">
  <xsl:param name="price"/>
  <xsl:param name="currency" select="'$'"/>
  <xsl:value-of select="$currency"/>
  <xsl:value-of select="format-number($price, '0.00')"/>
</xsl:template>

<xsl:call-template name="displayPrice">
  <xsl:with-param name="price" select="price"/>
</xsl:call-template>
```

### Modes

Modes allow different templates for same node type in different contexts.

```xml
<xsl:template match="book" mode="summary">...</xsl:template>
<xsl:template match="book" mode="detail">...</xsl:template>
```

## 7) XML -> HTML Worked Example (Bookstore)

The lecture’s full example performs:

- Root template renders page shell (HTML + CSS).
- `bookstore` template creates a table.
- `book` template renders rows.
- Sorting by numeric `price`.
- Dynamic CSS class from `@category`.
- Price formatting with `format-number(price, '0.00')`.
- Position-based numbering with `position()`.

Expected sorted order by price:

1. A Brief History of Time
2. The Great Gatsby
3. Dune

## XSLT Elements Quick Reference

- `xsl:template`
- `xsl:apply-templates`
- `xsl:call-template`
- `xsl:value-of`
- `xsl:copy-of`
- `xsl:for-each`
- `xsl:sort`
- `xsl:if`
- `xsl:choose`, `xsl:when`, `xsl:otherwise`
- `xsl:variable`
- `xsl:param`
- `xsl:with-param`
- `xsl:attribute`
- `xsl:element`
- `xsl:comment`
- `xsl:output`
- `xsl:import`, `xsl:include`

## Useful Functions in XSLT Context

- `format-number()`
- `generate-id()`
- `key()` with `xsl:key` lookup tables
- `document()` for external XML
- `current()` for stable context in nested expressions
- `unparsed-text()`, `resolve-uri()` in XSLT 2.0+

## Common XSLT Mistakes and Fixes

- Using `select='title'` when string output is needed:
  Use `title/text()` or `string(title)`.
- Writing `<` directly in `test` attributes:
  Use `&lt;`.
- Unquoted string literal in tests:
  `@category = 'fiction'` not `@category = fiction`.
- Unexpected text copied due to default templates:
  Add explicit handling for text nodes when needed.
- Numeric sorting treated as text:
  Set `data-type='number'`.
- Trying to copy full subtree with `xsl:value-of`:
  Use `xsl:copy-of`.

## Practice Exercises (XSLT)

Using `bookstore.xml`:

1. Output a `<ul>` of book titles.
2. Include price next to each title (2 decimals).
3. Sort titles alphabetically.
4. Highlight books under `$12` in red.
5. Label books by category using `xsl:choose`.
6. Create a named template to output a reusable book-card `<div>`.

## Week 5 Key Takeaways

- XSLT is the transformation layer built on XPath.
- Template matching plus `apply-templates` gives recursive, scalable transformations.
- Sorting, conditionals, and reusable templates are core for real projects.
- Understanding common pitfalls saves major debugging time.

---

**Previous:** [Week 4 - XPath](../week04_xpath/)
**Next:** [Week 6 - DOM & SAX](../week06_dom_sax/)
