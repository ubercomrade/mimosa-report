import { defineConfig } from 'vite'

// Suppress the spurious `INVALID_ANNOTATION` warnings emitted by Rolldown for
// the misplaced `/* #__PURE__ */` annotations shipped in @vueuse/core@14.3.0.
//
// Upstream bug: https://github.com/vueuse/vueuse/issues/5387
// Fix merged (not yet released): https://github.com/vueuse/vueuse/pull/5388
//
// TODO: remove this file once @vueuse/core publishes a release past 14.3.0.
export default defineConfig({
  plugins: [
    {
      name: 'normalize-github-pages-slidev-hash-routes',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            injectTo: 'head-prepend',
            children: `
;(function () {
  var base = '/mimosa-report/'
  function normalizeHashRoute() {
    var hashPath = window.location.hash.slice(1)
    if (hashPath.indexOf(base) === 0) {
      window.location.replace(base + hashPath.slice(base.length))
    } else if (hashPath.indexOf('/') === 0) {
      window.location.replace(base + hashPath.slice(1))
    }
  }
  normalizeHashRoute()
  window.addEventListener('hashchange', normalizeHashRoute)
})()
`,
          },
        ]
      },
    },
  ],
  build: {
    rolldownOptions: {
      onLog(level, log, defaultHandler) {
        if (log.code === 'INVALID_ANNOTATION') return
        defaultHandler(level, log)
      },
    },
  },
})
