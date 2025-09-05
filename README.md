# Atmosfair Email Microservice

## Welcome Admin Email API

### Endpoint

`POST /email/send`

### Payload

```
{
  "email": "admin@organization.com",
  "user_name": "Admin Full Name",
  "organization_name": "Organization Name",
  "password": "generated_password",
  "type": "welcome-admin"
}
```

### Example curl

```
curl -X POST http://localhost:3000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@organization.com",
    "user_name": "Admin Full Name",
    "organization_name": "Organization Name",
    "password": "generated_password",
    "type": "welcome-admin"
  }'
```

### Success Response

```
{
  "success": true,
  "data": {
    "messageId": "<unique-message-id>",
    "timestamp": "2025-09-05T12:34:56.789Z"
  },
  "message": "Email sent successfully"
}
```

### Error Response (example)

```
{
  "success": false,
  "error": "Missing required field: password",
  "status": 400,
  "details": null
}
```
