# Policies API

以程式方式取得組織已設定的 Policies。

## Endpoint

```http
GET /api/v1/policies/
```

驗證使用 `X-API-KEY` header。詳情見英文版 [API Keys & Authentication](https://roostorg.github.io/coop/latest/development/api-auth.html)。

## Response

```json
{
  "policies": [
    { "id": "policy-id-1", "name": "Violence", "parentId": null },
    {
      "id": "policy-id-2",
      "name": "Graphic Violence",
      "parentId": "policy-id-1"
    },
    { "id": "policy-id-3", "name": "Threats", "parentId": "policy-id-1" },
    { "id": "policy-id-4", "name": "Spam", "parentId": null }
  ]
}
```

### Response Fields

| Field | Type | 說明 |
| :--- | :--- | :--- |
| `policies` | Array | 組織的全部 Policies |
| `policies[].id` | String | Coop 為 Policy 建立的唯一且不可變 ID |
| `policies[].name` | String | 使用者為 Policy 指定的顯示名稱 |
| `policies[].parentId` | String 或 null | 上層 Policy 的 ID，頂層 Policy 則為 `null` |

## 注意事項

- 使用 `parentId` 重建完整 Policy tree。`parentId` 為 `null` 代表頂層 Policy，非 null 值則將子 Policy 連至上層
- 整合應使用 Policy `id`，不要使用 `name`。名稱可從資訊儀表板變更，ID 則不可變
- Policy 結構與用途見[基本概念](../user/concepts.md#policy)及[管理與設定](../user/administration.md#policies)
