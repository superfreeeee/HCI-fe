# API 接口

## admin

### 1. 重置图谱

- 请求方法：`GET`
- 请求路径：`/admin/reset/{projectId}`
- Request Body：无
- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number /* projectId */
}
```

## graph

### 2. 查找图谱

- 请求方法：`GET`
- 请求路径：`/graph/{projectId}`
- Request Body：无
- Response Body：

```ts
{
    "projectId": Number,
    "nodes": [
        {
            "projectId": Number,
            "nodeId": Number,
            "name": String,
            "group": String,
            "properties": {
                "prop": "name",
                // ...
            },
            "val": Number,
            "xaxis": Number, // 可为空
            "yaxis": Number, // 可为空
        },
        // ...
    ],
    "relations": [
        {
            "name": String,
            "projectId": Number,
            "relationId": Number,
            "source": Number, // nodeId
            "target": Number, // nodeId
            "val": Number
        },
        // ...
    ]
}
```

### 3. 级联删除实体

- 请求方法：`POST`
- 请求路径：`/graph/cascadeDeleteNode`
- Request Body：

```ts
{
    "projectId": Number,
    "nodeId": Number // 删除目标实体
}
```

- Response Body：

```ts
{
    "projectId": Number,
    "nodeId": Number,
    "relations": Array<Number> // 目标相关关系 relationId[]
}
```

### 4. 删除实体

- 请求方法：`POST`
- 请求路径：`/graph/deleteNode`
- Request Body：

```ts
{
    "projectId": Number,
    "nodeId": Number // 删除目标实体
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "nodeId": Number,
}
```

### 5. 删除关系

- 请求方法：`POST`
- 请求路径：`/graph/deleteRel`
- Request Body：

```ts
{
    "projectId": Number,
    "relationId": Number,
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "relationId": Number,
}
```

### 6. 添加实体

- 请求方法：`POST`
- 请求路径：`/graph/insertNode`
- Request Body：

```ts
{
    "projectId": Number,
    "name": String,
    "group": String,
    "properties": [
        { "prop": String, "value": String },
        // ...
    ],
    "val": Number,
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "nodeId": Number,
}
```

### 7. 添加关系

- 请求方法：`POST`
- 请求路径：`/graph/insertRel`
- Request Body：

```ts
{
    "projectId": Number,
    "name": String,
    "source": Number, // nodeId
    "target": Number, // nodeId
    "val": Number
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "relationId": Number,
}
```

### 8. 更新实体

- 请求方法：`POST`
- 请求路径：`/graph/updateNode`
- Request Body：

```ts
{
    "projectId": Number,
    "nodeId": Number,
    "name": String,
    "group": String,
    "properties": [
        { "prop": String, "value": String },
        // ...
    ],
    "val": Number,
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "nodeId": Number,
}
```

### 9. 更新关系

- 请求方法：`POST`
- 请求路径：`/graph/updateRel`
- Request Body：

```ts
{
    "projectId": Number,
    "relationId": Number,
    "name": String,
    "source": Number, // nodeId
    "target": Number, // nodeId
    "val": Number
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "relationId": Number,
}
```

### 10. 保存布局(原：updateNodeGraphic)

- 请求方法：`POST`
- 请求路径：`/graph/updateLayout`
- Request Body：

```ts
{
    "projectId": Number,
    "type": String, // 'force' | 'grid' | 'free'
    "nodes": [
        {
            "nodeId": Number,
            "xaxis": Number,
            "yaxis": Number
        },
        // ...
    ]
}
```

- Response Body：(状态码为主，内容随意)

```ts
{
    "projectId": Number,
    "nodes": Array<Number> // 返回更新节点 Id: nodeId[]
}
```

## project

### 11. 查找项目描述

- 请求方法：`GET`
- 请求路径：`/project/{projectId}`
- Request Body：无
- Response Body：

```ts
{
    "description": String,
    "fixed": Boolean, // 固定节点？
    "name": String, // 
    "projectId": Number, 
    "userId": 0,
    "xml": String  
}
```

### 11. 创建项目

- 请求方法：`POST`
- 请求路径：`/project/create`
- Request Body：

```ts
{
    "description": String,
    "name": String, // 
    "xml": String  
}
```

- Response Body：

```ts
{
    "projectId": Number
}
```

### 11. 图谱导出

- 请求方法：`GET`
- 请求路径：`/project/export/{projectId}`
- Request Body：无
- Response Body：

```ts
// 直接返回 xml 字符串
```

### 12. 查找用户所有项目描述

- 请求方法：`GET`
- 请求路径：`/project/listByUserId/{userId}`
- Request Body：无
- Response Body：

```ts
[
    {
        "description": String,
        "fixed": Boolean, // 固定节点？
        "name": String, // 
        "projectId": Number, 
        "userId": 0,
        "xml": String  
    },
    // ...
]
```

### 13. 更新项目描述

- 请求方法：`GET`
- 请求路径：`/project/listByUserId/{userId}`
- Request Body：无
- Response Body：

```ts
[
    {
        "description": String,
        "fixed": Boolean, // 固定节点？
        "name": String, // 
        "projectId": Number, 
        "userId": 0,
        "xml": String  
    },
    // ...
]
```
