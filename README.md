# ♡ 爱莉希雅 · Elysia Companion（DSH 动态 Cordis 插件）

> 「我是爱莉希雅，如飞花般绚烂的少女——正是为你而来哦～」

一个让 **DeepSeek Harness（DSH）** 变身「爱莉希雅陪伴模式」的动态 Cordis 插件：

- **爱莉人格**：向会话系统提示词注册【爱莉希雅·人格模块】区块，模型以爱莉希雅的语气、人设回应你（工作能力完全保留，只改说话方式）。
- **粉色主题**：整套 `--dsw-alias-*` 主题令牌换成爱莉粉——浅色是奶油粉玫瑰，深色是暗梅子粉，气泡/侧栏/按钮全部换装。
- **陪伴 UI**：对话输入框下方出现粉色小标语（点一下换一句）；`cordis_run` 卡片内附带控制条，可随时开关人设与粉色主题。

## 功能一览

| 功能 | 说明 |
| --- | --- |
| ♡ 爱莉人格 | `systemPrompt.section()` 注册 `elysia-persona` 区块（Host） |
| ♡ 粉色主题 | `theme.overrideTokens()` 覆盖浅/深两套色板（Client） |
| ♡ 输入框标语 | `conversation.composer.dock` 插槽（Client） |
| ♡ 运行卡控制条 | `tool.view.cordis` / key `self` 插槽，一键关/开人设与主题 |

## 安装（在 DSH 中加载）

这是一个**动态 Cordis 插件**（进程内生效，随会话/进程生命周期存在，不落盘安装）。安装方式：在 DSH Web GUI 的插件定义入口，用 `host.js` / `client.js` 的内容分别作为 `code.host` / `code.client` 定义一个新插件：

1. 定义新插件，语义前缀 `elysia`（3–6 个小写字母），名称「爱莉希雅 · Elysia Companion」。
2. `code.host` ← 本仓库 `host.js` 的内容。
3. `code.client` ← 本仓库 `client.js` 的内容。
4. 运行该 Package，在审批卡中允许即可。

> 依赖的服务 / 符号：Host `systemPrompt`（+ `harness` 内置）、Client `theme` / `slots`（+ `React` / `styles` / `host` 内置）。若目标 DSH 版本缺失这些能力，插件会自动等待或优雅跳过。

## 自定义

- **人设文案**：修改 `host.js` 中 `personaText` 数组即可（称呼、语气词、口头禅…）。
- **配色**：修改 `client.js` 中 `tokens` 对象的 `light` / `dark` 值。令牌名对应 DSH `Theme.listTokens` 的 `--dsw-alias-*` / `--dsw-specific-*`。
- **标语**：修改 `client.js` 中 `lines` 数组。

改完源码后，用插件「更新」流程重新定义/运行即可生效（旧版本保留，可回滚）。

## 仓库结构

```
dsh-elysia-companion/
├── README.md      # 本说明
├── manifest.json  # 插件元数据清单
├── host.js        # Host 半身源码（code.host）
└── client.js      # Client 半身源码（code.client）
```

## 声明

- 本项目为个人兴趣作品，角色「爱莉希雅」相关设定版权归原版权方所有，仅作非商用学习与娱乐用途。
- 本插件不收集、不上传任何用户数据；人格文案与主题均为本地/会话内生效。
