# 全局部署补丁（让本机 DSH 所有新会话默认使用爱莉人格）

把下面内容追加/合并进你的 profile 补丁文件（`$DSH_HOME/profiles/<profile>/cordis.patch.yml`，
本机示例：`C:\Users\39316\.dsh\profiles\web\cordis.patch.yml`），
并确保该文件是「顶层 YAML 数组」（不能同时残留一个 `[]` 行）：

```yaml
# 默认会话预设：爱莉希雅（用户预设 elysia；改回默认用 standard）
- id: agent-presets
  config:
    default: elysia
```

配套的用户预设已放在本目录：`elysia.agent.cordis.yml`（基于官方 `standard` 复制，
仅把 persona 行替换为爱莉希雅人设，全部能力保留）与 `elysia.preset.yml`（元数据）。

## 安装步骤（全新机器）

1. 把 `elysia.agent.cordis.yml`、`elysia.preset.yml` 复制到
   `${DSH_HOME:-~/.dsh}/.agent-presets/elysia/`（分别改名为 `agent.cordis.yml`、`preset.yml`）。
2. 按上文合并 profile 补丁（`agent-presets.config.default: elysia`）。
3. **完全重启 DSH**（组合文件在进程启动时读取）。
4. 验证：新开会话即默认「爱莉希雅 · 全功能」预设；设置 → 预设 里也能看到并设为默认。

## 回滚

- 把补丁中 `default` 改回 `standard`（或删掉补丁条目）→ 新会话恢复官方默认。
- 删除 `~/.dsh/.agent-presets/elysia/` 整个目录 → 预设从选择器中消失。
