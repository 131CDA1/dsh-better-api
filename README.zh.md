# dsh-better-api

增强版「模型设置」页插件（DSH Web GUI）：给自定义模型的**每个模型**提供**推理强度**（reasoningEfforts）编辑能力。

官方模型设置页刻意不提供推理强度控件（认为它是"每个模型各自的能力"）。本插件在官方页面的模型目录编辑器里补上了它：

- 每个模型行的高级区新增 **推理强度** 复选框组：`off / minimal / low / medium / high / xhigh / max`
- 勾选的档位写入该模型的 `reasoningEfforts`（档位按同名值发送；`off` 特殊处理为"不发送参数"）
- 全部取消勾选即移除声明，模型回退为"不支持推理"，界面不出现自相矛盾的控件
- 手工声明的自定义模型（OpenAI 兼容网关等）从此在聊天模型选择器中显示 **Effort 菜单**（提供方默认 + 各档位），选中后自动记住为会话默认

基于官方 [@deepseek-ai/dsh-client-ui-settings-models](https://github.com/deepseek-ai/deepseek-harness)（MIT）分支，仅增加上述编辑能力，其余行为与官方一致。

## 功能

- 设置 → 模型 → 任意提供方 → 模型目录 → 展开模型行 → 勾选推理强度
- 新建自定义提供方时同样可用
- 中英文界面文案齐备
- 配置即写即存：保存后写入 settings 文档（如 `~/.dsh/settings.yaml`），无需重启

## 安装

### 方式一：dsh-market 插件市场一键安装（推荐）

1. 等待本插件收录进 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 注册表（见下文「提交到插件市场」），
   收录后打开 Web GUI 的 **插件市场**（dshmarket），搜索 **dsh-better-api**，点 **安装** 即可。
2. 市场会执行 `dsh plugin --profile web add github:131CDA1/dsh-better-api`，
   随包 `cordis.patch.yml` 会被自动合并：**禁用官方模型设置行 `ui-settings-models`** + 插入本插件行。
3. 刷新页面。

### 方式二：命令行安装

```bash
cd ~/.dsh/profiles/web
npm i github:131CDA1/dsh-better-api
# 把仓库根目录的 cordis.patch.yml 合并进本 profile 的 cordis.patch.yml
```

或直接：

```bash
dsh plugin --profile web add github:131CDA1/dsh-better-api
```

### 为什么必须禁用官方模型设置页？

本插件与官方插件共用同一个 `settings.section#models` 槽位，二者同时启用会因重复注册直接报错。
本插件是官方「模型设置页」的增强版替代品，随包补丁会自动禁用官方行
（`ui-settings-models` / `@deepseek-ai/dsh-client-ui-settings-models`）；
若手动安装，请先在 GUI 插件管理中禁用该行。

## 与其他插件是否冲突？

**不会与 API 代理/中转/用量类插件冲突。** 结论依据：

- 本插件是**纯客户端 UI 插件**：宿主侧为空实现，不注册任何模型工具、不拦截请求、
  不提供 LLM 路由、不占用 `llm-pi-ai` 等设置命名空间（推理强度写入仍走官方
  `settings.mutate`，写入的就是官方 schema 支持的 `reasoningEfforts` 字段）。
- 它对外唯一的"共享状态"是两个槽位注册（`settings.section#models`、
  `settings.onboarding`）。DSH 槽位注册表对同 id 重复注册会**直接抛错**，
  因此潜在硬冲突只有一种：另一个插件也注册 `settings.section#models`。
  官方行已被本插件补丁禁用；若将来出现同类替代插件，二者不可同时启用（文档会同步说明）。
- API 代理 / Key 轮换池 / 中转（one-api、new-api 类）/ 用量统计等插件：
  要么在宿主侧接管 provider 与请求，要么以**各自独立的槽位 id** 注册 UI 分区，
  均不触碰 `settings.section#models`。它们配置的 provider 依然会出现在
  模型设置页（页面读取的是同一份 `llm.providers` 目录），并且它们的模型
  同样可以用本插件声明推理强度——是互补关系。
- 模型选择器类增强（如推理滑块 dsh-reasoning-slider、dsh-models-dev-reasoning）：
  它们读取的是**同一个适配器推理元数据**（本插件编辑的正是这份数据），
  不注册设置页槽位，因此共存无冲突；两个插件对同一模型写 `reasoningEfforts`
  也只是 settings 文档里的后写覆盖，不会崩溃。

一句话：本插件只拥有「模型设置页」这一个槽位，其他插件只要不抢占同一槽位就不会冲突。

## 使用

1. 打开 **设置 → 模型**，找到你的提供方（如自定义 `gpt`）并展开其编辑卡片。
2. 在 **模型目录** 中展开某个模型行（高级区），勾选需要的推理强度。
3. 点击 **保存**。
4. 回到会话，在模型选择器中选中该模型，即可看到 **Effort** 菜单并选择档位。

## 配置参考（settings.yaml）

`reasoningEfforts` 声明模型可选的思考档位：键是选择器提供的档位，值是该档位在协议中发送的拼写（`low: low` 原样透传，`max: ultra` 则为使用自有词汇的网关改名）。键取自档位集合 `off / minimal / low / medium / high / xhigh / max`；未声明的档位不会被提供。

```yaml
llm-pi-ai:
  providers:
    gpt:
      apiKeyEnv: GPT_API_KEY
      api: openai-completions
      baseURL: https://api.example.com
      models:
        - id: gpt-5.6-sol
          name: GPT-5.6 Sol
          reasoningEfforts:
            low: low
            medium: medium
            high: high
```

- `off` 是唯一的三态键：声明且不给值（`off:`）时提供 Off，选中后不发送任何参数；给值（`off: none`）则按该值发送。
- 一旦声明，这份声明就是对外提供的全部档位；要保留的档位需要全部重述。
- 网关使用自有词汇时改值即可（如 `max: ultra`），界面无需改动。

## 提交到插件市场（dsh-market 一键安装的前置步骤）

dsh-market 的一键安装只接受 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
注册表（`awesome-dsh-plugin.com/plugins.json`）里收录的来源，因此需要先提交收录 PR：

1. 把本仓库推到 GitHub：`git@github.com:131CDA1/dsh-better-api.git`（**main 分支**）。
2. 在仓库 Settings → Topics 添加 **`dsh-plugin`** 标签。
3. fork [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，
   新增 `data/plugins/131CDA1__dsh-better-api.yml`（内容见本仓库 `market/awesome-dsh-plugin-entry.yml`），
   然后 `npm ci && node scripts/generate-readme.mjs` 重新生成 README，提交并开 PR。
4. 收录门槛（CI 自动检查）：仓库**创建满 1 天**、**提交数 ≥ 10**、package.json 声明
   `dsh.bundle` manifest（本仓库已声明）、描述与实际功能一致。
5. 合并后，市场 UI 刷新即出现本插件，一键安装命令为：
   `dsh plugin --profile web add github:131CDA1/dsh-better-api`。

打 `v*` 标签会触发 GitHub Actions 构建发布包（zip + `dsh-better-api.tgz` + SHA256SUMS）并发布 Release，
注册表中的 `tarball:` 字段即指向 Release 的固定文件名 `dsh-better-api.tgz`。

## License

MIT。本插件是 [@deepseek-ai/dsh-client-ui-settings-models](https://github.com/deepseek-ai/deepseek-harness) 的分支，保留上游版权声明。
