# Railway 部署步骤 - 可视化指南

## 📸 详细步骤（带截图说明）

### Step 1: 访问 Railway
🔗 **URL**: https://railway.app/new

点击 "Start a New Project" 按钮

---

### Step 2: 选择 GitHub 部署
点击 "Deploy from GitHub repo" 选项

---

### Step 3: 授权 GitHub
- 如果没有授权过，Railway 会请求 GitHub 访问权限
- 点击 "Authorize railway-app"

---

### Step 4: 选择仓库
在仓库列表中找到并选择：
```
duliangkuan/Agent_test
```

---

### Step 5: 配置 Python 服务
Railway 会自动检测到 Python 项目

点击右侧的 **Settings** 或 **Variables** 标签

---

### Step 6: 设置根目录
在 Settings 页面：

找到 **"Root Directory"** 字段，输入：
```
backend
```

---

### Step 7: 设置启动命令（可选）
在 Settings 页面找到 **"Start Command"** 字段，输入：
```
python run.py
```

或者留空，让 Railway 自动检测。

---

### Step 8: 等待部署
Railway 会自动：
1. 安装依赖 (`pip install -r requirements.txt`)
2. 启动服务 (`python run.py`)
3. 分配公网 URL

这个过程大约需要 2-5 分钟。

---

### Step 9: 获取后端 URL
部署成功后：

1. 点击 **"Settings"** 标签
2. 找到 **"Custom Domain"** 或 **"Public URL"**
3. 复制 URL，格式类似：`https://your-app.up.railway.app`

---

### Step 10: 测试后端
在浏览器访问：
```
https://your-app.up.railway.app/docs
```

应该能看到 FastAPI 的 Swagger 文档界面。

---

## ✅ 部署检查清单

- [ ] Railway 项目创建成功
- [ ] 仓库连接成功
- [ ] Root Directory 设置为 `backend`
- [ ] 部署日志没有错误（绿色✅）
- [ ] 获取到 Public URL
- [ ] 能访问 `/docs` 接口文档

---

## 🎉 下一步

部署成功后，**把后端 URL 发给我**，我会帮你配置前端连接！

