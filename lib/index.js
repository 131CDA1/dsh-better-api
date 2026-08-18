/**
 * dsh-better-api —— 模型设置增强插件（宿主组合行，Host 侧为空实现）。
 *
 * 真正的实现在浏览器侧（./client）：给「设置 → 模型」页的模型目录编辑器
 * 增加每模型推理强度（reasoningEfforts）编辑能力，让手工声明的自定义模型
 * （OpenAI 兼容网关等）也能在模型选择器中选择推理档位。
 *
 * 本包与官方 @deepseek-ai/dsh-client-ui-settings-models 共用同一个
 * `settings.section#models` 槽位，二者不能同时启用：安装本插件时必须
 * 禁用官方行（cordis 行 id: ui-settings-models），随包 cordis.patch.yml 已包含。
 */

/** Host plugin body — no host-side behavior for the models settings plugin. */
function apply() {}

export { apply }
