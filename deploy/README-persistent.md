# 常驻插件（推荐）：装进 DSH 本体，重启不丢

把爱莉希雅做成 **DSH 组合级常驻插件包**（host 注册全局人格 section + client 粉色主题/陪伴 UI），
进程重启、会话新建都不需要再启用。

## 关键前提（踩坑记录）

**桌面版 DSH 的 DSH_HOME 不是 `~/.dsh`**，而是：

```
C:\Users\<你>\AppData\Roaming\open-deepseek-harness-desktop\dsh-home
```

（用 `dsh --profile web --dump-config` 输出里的 patch 来源路径可确认真实位置；
`~/.dsh` 是 CLI/开发用的另一个家目录，桌面应用不读它。）

## 安装步骤

1. 把本目录的 `@local/dsh-elysia-companion/` 整个复制到真实主目录：
   `$DSH_HOME/profiles/node_modules/@local/dsh-elysia-companion/`
   （package.json / lib/index.js / lib/client.js 三个文件）。
2. 在真实主目录的 `profiles/web/cordis.patch.yml` **末尾追加**：

   ```yaml
   # 爱莉希雅常驻插件（@local/dsh-elysia-companion）
   - insert:
       - id: elysia-companion
         name: '@local/dsh-elysia-companion'
   ```

3. 完全重启 DSH（桌面应用退出重开）。
4. 验证：界面变粉 = client 生效；任意会话聊两句 = host 全局人格生效。

## 结构说明

| 文件 | 作用 |
| --- | --- |
| `package.json` | 包清单：`type: module`；`exports["."]`→host 入口；`exports["./client"]`→客户端 bundle（client-modules 按此定位）；`dsh.client` 声明 web 平台 |
| `lib/index.js` | host：`apply(ctx)` 在**全局**（无 scope）注册 `elysia-persona` section（order 10，唯一名，不与部署人格冲突）→ 所有会话生效 |
| `lib/client.js` | client：`__ModuleLoader__.load()` 包装；粉色主题 override + 输入框 Dock 标语/粉色开关 |

## 卸载 / 回滚

- 删掉 patch 里那段 `- insert` 并重启；或直接删除 `profiles/node_modules/@local` 目录。
- 编辑前系统如有备份习惯，patch 目录下会自动留 `.bak-*`。

## 设计要点（为什么这样能"常驻"）

- 动态 Cordis 插件 = 进程内存，重启必失，只适合会话内试用。
- 常驻能力必须落在**组合文件**（cordis.patch.yml 的 loader 行）里；
- 人格 section 若挂在预设层会被"预设人格行遮蔽"规则限制，挂在 **host 组合行（无 scope）且用独立 section 名** 则每个会话都组装，且不碰部署人格的 `deployment:persona` 槽位。
- 客户端 UI（主题/插槽）必须以预打包 `__ModuleLoader__` bundle + `exports["./client"]` 形式提供。
