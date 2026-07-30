import { onMounted, onUnmounted } from 'vue'

export function useReveal() {
  let intersectionObserver = null
  let mutationObserver = null

  function observeElement(el) {
    if (!el.classList.contains('active')) {
      intersectionObserver.observe(el)
    }
  }

  onMounted(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            intersectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal').forEach(observeElement)

    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue
          if (node.classList?.contains('reveal')) observeElement(node)
          node.querySelectorAll?.('.reveal').forEach(observeElement)
        }
      }
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    intersectionObserver?.disconnect()
    mutationObserver?.disconnect()
  })
}
