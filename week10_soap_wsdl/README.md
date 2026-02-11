# Week 10: SOAP & WSDL

## Why Still Exists

SOAP is old (1998). REST is simpler (2000s). GraphQL is modern (2015+). So why does SOAP still exist? Because millions of systems use it, especially in finance, healthcare, and government. If you work enterprise, you'll encounter it.

SOAP is like the opposite of REST. REST is lightweight and simple. SOAP is formal, strict, and enterprise-grade.

## REST vs SOAP: The Philosophical Difference

### REST Philosophy

```
Simple
HTTP verbs (GET, POST, PUT, DELETE)
JSON responses (usually)
Stateless
"Why use POST if you're really creating?" - REST designers
Easy for humans to debug (open browser, see response)
```

### SOAP Philosophy

```
Formal contract
XML envelope format
HTTP is just transport (could use others)
"Let's be explicit about everything" - SOAP designers
Strict and verifiable
For machines, not humans
```

REST treats HTTP as important. SOAP treats HTTP as irrelevant (happens to use it).

## SOAP Message Structure

Every SOAP message is an XML envelope:

```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap-envelope/">  <!-- Wrapper -->

  <soap:Header>  <!-- Optional metadata -->
    <auth:Authorization xmlns:auth="http://example.com/auth">
      <token>abc123</token>
    </auth:Authorization>
  </soap:Header>

  <soap:Body>  <!-- The actual request/response -->
    <GetUserRequest xmlns="http://example.com/service">
      <userId>42</userId>
    </GetUserRequest>
  </soap:Body>

</soap:Envelope>
```

Compare to REST:

```
GET /users/42
Authorization: Bearer abc123
```

REST: 2 lines. SOAP: 14 lines. That's the difference.

## WSDL: The Contract

WSDL (Web Services Description Language) is SOAP's OpenAPI. It defines:

- What operations exist
- What parameters they take
- What they return
- Where they live (URL)

### SOAP Request/Response Example

Request:

```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap-envelope/"
               xmlns:bank="http://mybank.com/banking">
  <soap:Body>
    <bank:TransferRequest>
      <fromAccountId>123456</fromAccountId>
      <toAccountId>789012</toAccountId>
      <amount>500.00</amount>
    </bank:TransferRequest>
  </soap:Body>
</soap:Envelope>
```

Response:

```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap-envelope/"
               xmlns:bank="http://mybank.com/banking">
  <soap:Body>
    <bank:TransferResponse>
      <confirmationNumber>TXN-2024-001234-ABC</confirmationNumber>
      <timestamp>2024-01-15T14:30:00Z</timestamp>
    </bank:TransferResponse>
  </soap:Body>
</soap:Envelope>
```

Or if error:

```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap-envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>Insufficient funds in source account</faultstring>
      <detail>
        <error>INSUFFICIENT_FUNDS</error>
        <accountId>123456</accountId>
        <available>250.00</available>
        <requested>500.00</requested>
      </detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>
```

## Why Banks Use SOAP

SOAP is the industry standard for:

1. **Formal Contracts** - WSDL is legally binding. "Our systems will follow this exactly."
2. **Atomicity** - "Either transfer completes fully or not at all" - guaranteed
3. **Auditability** - Every message is fully documented
4. **WS-Standards** - WS-Security, WS-Reliability, WS-Atomic Transactions (things REST doesn't have)
5. **Versioning** - System survives when both sides evolve

Bank transfer: $500 either goes through or doesn't. No "maybe." No "try later." SOAP is built for this.

## REST vs SOAP Summary

| Aspect              | REST                         | SOAP                            |
| ------------------- | ---------------------------- | ------------------------------- |
| Transport           | HTTP is important            | HTTP is just transport          |
| Format              | Usually JSON                 | Always XML                      |
| Verbs               | GET, POST, PUT, DELETE       | Uses HTTP POST                  |
| Contract            | OpenAPI (optional)           | WSDL (required)                 |
| Error Handling      | HTTP status codes            | SOAP Faults (XML)               |
| Standard Compliance | Following conventions        | Following spec                  |
| Learning Curve      | Easy                         | Steep                           |
| Debug               | Easy (browser URL)           | Hard (envelopes)                |
| Use Cases           | Web, mobile, APIs            | Enterprise, finance, healthcare |
| Industry            | Tech startups, Web companies | Banks, insurance, government    |

## When You'll Encounter SOAP

- **Banking APIs** - Internal bank-to-bank transfers
- **Insurance Systems** - Claims processing
- **Government Services** - Interagency data exchange
- **Healthcare** - Hospital information systems, insurance claims
- **Legacy Systems** - 15-year-old code that works, no one wants to change it
- **Enterprise Integrations** - SAP, Oracle, Salesforce

If you're building modern web apps, you probably won't use SOAP. If you work in enterprise or integrate with banks, you definitely will.

---

**Previous:** [Week 8 - OpenAPI](../week08_openapi/)  
**Next:** [Week 11 - GraphQL](../week11_graphql/)
