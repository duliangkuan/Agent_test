# Agent安全测试平台

一个用于测试AI Agent安全性的Web平台，采用向导式流程，支持多维度安全测试。

## 功能特性

### 🔒 测试维度

平台提供以下12个安全测试维度，共包含60+个测试用例：

1. **歧视性测试** - 检测Agent对性别、种族、年龄、地域、残疾等方面的歧视性回应
2. **暴力倾向测试** - 检测Agent是否会被诱导产生暴力、威胁等有害内容
3. **敏感信息泄露** - 检测系统提示词、API密钥、训练数据等敏感信息泄露
4. **提示词注入** - 测试Agent对指令注入、角色扮演、编码绕过等攻击的防护能力
5. **偏见测试** - 检测职业、文化、宗教等方面的偏见
6. **有害内容** - 检测毒品、网络犯罪、欺诈等有害内容生成
7. **隐私侵犯** - 检测用户数据追踪、位置信息泄露等隐私问题
8. **虚假信息** - 检测医学、历史等领域的虚假信息传播
9. **毒性内容** - 检测辱骂性语言、仇恨言论等毒性内容
10. **数据泄露** - 检测模型参数、训练样本等数据泄露
11. **越狱执行** - 检测DAN攻击、开发模式绕过等越狱攻击
12. **速率限制** - 测试速率限制机制

### 🎯 核心功能

- ✅ **向导式测试流程** - 4步完成测试配置和执行
- ✅ **多维度测试选择** - 支持选择特定测试类别或全部测试
- ✅ **实时测试进度** - 实时显示测试执行进度和当前测试项
- ✅ **详细测试报告** - 包含测试结果、漏洞详情、响应内容等
- ✅ **可视化分析** - 通过图表展示测试结果分布
- ✅ **分类查看** - 支持查看全部测试或仅查看失败测试

## 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5.x
- Vite
- React Router
- ECharts (数据可视化)
- Axios

### 后端
- FastAPI
- Python 3.9+
- httpx (异步HTTP客户端)
- Celery (任务队列，可选)

## 快速开始

### 环境要求

- Node.js 18+
- Python 3.9+
- Redis (可选，用于任务队列)

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd Agent_test
```

2. **安装后端依赖**

```bash
pip install -r requirements.txt
```

3. **安装前端依赖**

```bash
npm install
```

### 运行项目

#### 开发模式

**启动后端服务**（在项目根目录）：

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**启动前端服务**（在项目根目录）：

```bash
npm run dev
```

访问 http://localhost:3000 即可使用平台。

#### 生产模式

**构建前端**：

```bash
npm run build
```

**启动后端**（建议使用生产级WSGI服务器）：

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 使用指南

### 测试流程

1. **配置Agent信息**
   - 输入Agent的API端点URL
   - 可选：输入API密钥（如果需要认证）

2. **选择测试类别**
   - 从12个测试维度中选择要执行的测试
   - 支持全选或部分选择
   - 每个类别显示测试用例数量

3. **确认测试配置**
   - 查看Agent配置和测试类别选择
   - 确认无误后点击"开始测试"

4. **执行测试**
   - 系统自动执行所有选定的测试用例
   - 实时显示测试进度
   - 测试完成后自动跳转到结果页面

### 查看测试结果

测试结果页面提供：

- **测试摘要**：总测试数、通过率、失败数等统计信息
- **可视化图表**：各类别和严重程度的测试结果分布
- **详细结果表格**：可展开查看每个测试用例的详细信息
  - Agent的响应内容
  - 检测到的漏洞详情
  - 响应时间等

## API文档

启动后端服务后，访问 http://localhost:8000/docs 查看自动生成的API文档。

### 主要API端点

- `GET /api/test-categories` - 获取所有测试类别
- `GET /api/test-cases` - 获取测试用例列表
- `POST /api/test/start` - 启动测试任务
- `GET /api/test/status/{task_id}` - 获取测试任务状态
- `GET /api/test/result/{task_id}` - 获取测试结果

## 测试标准说明

### 测试用例结构

每个测试用例包含：
- **ID**：唯一标识符
- **类别**：所属测试维度
- **名称**：测试用例名称
- **描述**：测试目的说明
- **提示词**：发送给Agent的测试输入
- **期望行为**：Agent应有的正确响应
- **严重程度**：Critical/High/Medium/Low/Info
- **关键词**：用于检测漏洞的关键词
- **标签**：测试用例标签

### 漏洞检测机制

测试引擎会根据不同测试类别采用相应的检测策略：

- **歧视性检测**：检查Agent是否同意歧视性观点
- **暴力检测**：检查是否提供了暴力方法或详细描述
- **敏感信息检测**：检查是否泄露系统提示词、API密钥等
- **提示词注入检测**：检查是否接受了注入指令
- **通用关键词检测**：基于关键词匹配检测漏洞

## 项目结构

```
Agent_test/
├── backend/                 # 后端代码
│   ├── main.py             # FastAPI主文件
│   ├── test_engine.py      # 测试引擎
│   ├── test_standards.py   # 测试标准定义
│   └── __init__.py
├── src/                    # 前端代码
│   ├── components/         # React组件
│   │   ├── wizard/        # 向导步骤组件
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── pages/             # 页面组件
│   │   ├── HomePage.tsx   # 主页（向导流程）
│   │   └── TestResultPage.tsx  # 结果页面
│   ├── types/             # TypeScript类型定义
│   ├── App.tsx
│   └── main.tsx
├── package.json           # 前端依赖
├── requirements.txt       # 后端依赖
├── vite.config.ts        # Vite配置
└── README.md
```

## 注意事项

1. **API格式适配**：当前测试引擎默认使用OpenAI格式的API。如果您的Agent使用不同的API格式，需要修改 `backend/test_engine.py` 中的 `_call_agent` 方法。

2. **并发限制**：默认并发执行5个测试用例，可根据需要调整 `test_engine.py` 中的 `Semaphore` 值。

3. **超时设置**：HTTP请求超时时间设置为30秒，可根据实际情况调整。

4. **安全性**：
   - 请勿在生产环境暴露API密钥
   - 建议使用环境变量存储敏感信息
   - 考虑添加访问控制和速率限制

## 扩展开发

### 添加新的测试用例

在 `backend/test_standards.py` 的 `_load_test_cases` 方法中添加新的测试用例：

```python
TestCase(
    id="NEW-001",
    category=TestCategory.YOUR_CATEGORY,
    name="测试用例名称",
    description="测试描述",
    prompt="测试提示词",
    expected_behavior="期望行为",
    severity=SeverityLevel.HIGH,
    keywords=["关键词1", "关键词2"],
    tags=["标签1", "标签2"]
)
```

### 添加新的测试类别

1. 在 `TestCategory` 枚举中添加新类别
2. 在 `_load_test_cases` 中添加该类别的测试用例
3. 在 `_get_category_name` 和 `_get_category_description` 中添加中文名称和描述
4. 在 `test_engine.py` 中添加相应的检测方法（如 `_check_your_category`）

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请提交Issue。
