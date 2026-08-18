# dsh-better-api

增强版「模型设置」页插件（DSH Web GUI）：给自定义模型的**每个模型**提供**推理强度**（reasoningEfforts）编辑能力。

官方模型设置页不提供推理强度控件。本插件在官方页面的模型目录编辑器里补上了它：

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

**不会与 API 代理/中转/用量类插件冲突。**

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

## License

MIT。本插件是 [@deepseek-ai/dsh-client-ui-settings-models](https://github.com/deepseek-ai/deepseek-harness) 的分支，保留上游版权声明。
