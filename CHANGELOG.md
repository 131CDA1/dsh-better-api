# Changelog

## 0.1.0 (2026-08-18)

- 首个发布版本。
- 基于官方 @deepseek-ai/dsh-client-ui-settings-models（MIT）分支，
  在「设置 → 模型」的模型目录编辑器中新增每模型**推理强度**（reasoningEfforts）编辑：
  - 每个模型行的高级区提供 off / minimal / low / medium / high / xhigh / max 复选框；
  - 勾选档位写入该模型的 `reasoningEfforts`（档位按同名值发送，off 不发送参数）；
  - 全部取消勾选即移除声明，模型回退为“不支持推理”。
- 中英文界面文案齐备；新建自定义提供方时同样可用。
- 兼容 dsh-market / awesome-dsh-plugin 一键安装（声明 `dsh.bundle` manifest）。
