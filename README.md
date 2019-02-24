# GitHub Exchange

Exchange GitHub OAuth codes for tokens

## Authentication

All routes support bearer tokens for authentication, of the form `Bearer {token}`

## `GET /api/apps`

List all client IDs associated with the authenticated user

### Response

```
[
  "aaabbbcccdddeeefffff"
]
```

## `GET /api/apps/:client_id/token`

Exchange an OAuth code for an access token associated with the given client ID

### Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>code</code></td>
            <td><code>string</code></td>
            <td>The OAuth code returned as part of the GitHub OAuth flow</td>
        </tr>
    </tbody>
</table>

### Response

```
{
  "access_token": "11111aaaaa22222bbbbb33333ccccc44444ddddd",
  "token_type": "bearer",
  "scope": "read:user,repo"
}
```

## `POST /api/apps`

Register a new client ID and client secret pair, and receive a token for editing later. If the user is authenticated, this registration will be associated with the passed token. Otherwise, a new token will be returned.

Note: once a client secret is registered, it cannot be retrieved again.

### Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>client_id</code></td>
            <td><code>string</code></td>
            <td>The client ID associated with the app</td>
        </tr>
        <tr>
            <td><code>client_secret</code></td>
            <td><code>string</code></td>
            <td>The client secret associated with the app</td>
        </tr>
    </tbody>
</table>

#### Example

```
{
  "client_id": "aaabbbcccdddeeefffff",
  "client_secret": "11111aaaaa22222bbbbb33333ccccc44444ddddd"
}
```

### Response

```
{
  "token": "bearer-token",
  "client_id": "aaabbbcccdddeeefffff"
}
```

## `PUT /api/apps/:client_id`

Update an existing client secret for the specified client ID belonging to the authenticated user

### Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>client_id</code></td>
            <td><code>string</code></td>
            <td>The client ID associated with the app</td>
        </tr>
        <tr>
            <td><code>client_secret</code></td>
            <td><code>string</code></td>
            <td>The client secret associated with the app</td>
        </tr>
    </tbody>
</table>

#### Example

```
{
  "client_secret": "11111aaaaa22222bbbbb33333ccccc44444ddddd"
}
```

### Response

```
{
  "client_id": "aaabbbcccdddeeefffff"
}
```

## `DELETE /api/apps/:client_id`

Delete an existing client ID and client secret pair belonging to the authenticated user

### Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>client_id</code></td>
            <td><code>string</code></td>
            <td>The client ID associated with the app</td>
        </tr>
    </tbody>
</table>

### Response

```
200 OK
```