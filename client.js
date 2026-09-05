// 爱莉希雅 · Elysia Companion — Client 半身
// 作用：粉色爱莉主题 + 输入框小标语（点按换句）+ 运行卡片控制条。
// 用法：作为动态 Cordis 插件的 code.client（一个函数体，返回 Cordis Plugin）。
'use strict'

return {
  inject: ['theme', 'slots'],
  apply(ctx) {
    const tokens = {
      '--dsw-alias-bg-base': { light: '#FDF2F7', dark: '#231319' },
      '--dsw-alias-bg-layer-1': { light: '#FFF9FC', dark: '#2E1A25' },
      '--dsw-alias-bg-layer-2': { light: '#FAE6F0', dark: '#3A2230' },
      '--dsw-alias-bg-overlay': { light: '#FFF9FC', dark: '#33202C' },
      '--dsw-alias-border-l1': { light: '#F4D6E3', dark: '#4A2B3B' },
      '--dsw-alias-border-l2': { light: '#EAC2D6', dark: '#5C3A4D' },
      '--dsw-alias-brand-primary': { light: '#C8457E', dark: '#FF87B9' },
      '--dsw-alias-label-primary': { light: '#41212F', dark: '#FCE4EE' },
      '--dsw-alias-label-secondary': { light: '#8C5A72', dark: '#CBA3B7' },
      '--dsw-alias-state-business-primary': { light: '#C8457E', dark: '#FF87B9' },
      '--dsw-specific-bubble': { light: '#FFE8F2', dark: '#412134' },
      '--dsw-specific-bubble-highlight': { light: '#FF9EC4', dark: '#FF9EC4' },
      '--dsw-specific-sidebar-fill': { light: '#FAE8F1', dark: '#281720' }
    }

    let themeDisposer = null
    const setThemeOn = (on) => {
      if (on && !themeDisposer) themeDisposer = ctx.theme.overrideTokens('elysia-pink', tokens)
      else if (!on && themeDisposer) { themeDisposer(); themeDisposer = null }
    }
    setThemeOn(true)
    ctx.effect(() => () => {
      if (themeDisposer) { themeDisposer(); themeDisposer = null }
    })

    ctx.effect(() => styles.insert([
      '.elysia-presence{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;line-height:1.8;color:var(--dsw-alias-label-secondary);cursor:pointer;user-select:none;background:transparent;border:none;transition:color .2s,transform .2s;}',
      '.elysia-presence:hover{color:var(--dsw-alias-brand-primary);}',
      '.elysia-heart{color:var(--dsw-alias-brand-primary);display:inline-block;animation:elysiaBeat 1.6s ease-in-out infinite;transform-origin:center;}',
      '@keyframes elysiaBeat{0%,100%{transform:scale(1)}10%{transform:scale(1.25)}20%{transform:scale(1)}30%{transform:scale(1.15)}45%{transform:scale(1)}}',
      '.elysia-ctrl{display:flex;align-items:center;gap:8px;padding:6px 2px;flex-wrap:wrap;}',
      '.elysia-pill{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border-radius:999px;font-size:12px;padding:5px 10px;cursor:pointer;transition:all .2s;}',
      '.elysia-pill:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);}'
    ].join('\n')))

    const lines = [
      '爱莉希雅正在陪你哦～',
      '♪ 今天也要元气满满呀！',
      '想我了就点一下这颗心 ♡',
      '加油！爱莉会一直看着你的～',
      '温酒，今天也要闪闪发光哦 ✧'
    ]

    function PresenceLine() {
      const [i, setI] = React.useState(0)
      return React.createElement('button', {
        type: 'button',
        className: 'elysia-presence',
        title: '点一下换一句 ♡',
        onClick: () => setI((i + 1) % lines.length)
      },
        React.createElement('span', { className: 'elysia-heart' }, '♥'),
        React.createElement('span', null, lines[i])
      )
    }

    function ElysiaControl() {
      const [personaOn, setPersonaOn] = React.useState(true)
      const [themeOn, setThemeOnState] = React.useState(true)
      const togglePersona = () => {
        const next = !personaOn
        setPersonaOn(next)
        host.call('elysia.persona', { on: next }).then((r) => {
          if (r && typeof r.on === 'boolean') setPersonaOn(r.on)
        }).catch(() => setPersonaOn(!next))
      }
      const toggleTheme = () => {
        const next = !themeOn
        setThemeOnState(next)
        setThemeOn(next)
      }
      return React.createElement('div', { className: 'elysia-ctrl' },
        React.createElement('span', { className: 'elysia-heart' }, '♥'),
        React.createElement('span', { style: { fontSize: '13px', color: 'var(--dsw-alias-label-primary)' } },
          personaOn ? '爱莉希雅陪伴中' : '爱莉先休息啦…'),
        React.createElement('button', { type: 'button', className: 'elysia-pill', onClick: togglePersona },
          personaOn ? '关人设' : '开人设'),
        React.createElement('button', { type: 'button', className: 'elysia-pill', onClick: toggleTheme },
          themeOn ? '关粉色' : '开粉色')
      )
    }

    ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register(
      { name: 'conversation.composer.dock', id: 'elysia-presence', order: 1 },
      () => React.createElement(PresenceLine)
    )))
    ctx.effect(() => ctx.slots.inject('tool.view.cordis', () => ctx.slots.register(
      { name: 'tool.view.cordis', key: 'self' },
      () => React.createElement(ElysiaControl)
    )))
  }
}
