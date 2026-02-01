"use client"

import { useEffect } from "react"

export default function PlayGuard() {
  useEffect(() => {
    const orig = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function (...args: any[]) {
      const p = orig.apply(this as any, args)
      // swallow AbortError (common during HMR / fast refresh) to avoid uncaught promise
      p?.catch?.((err: any) => {
        if (err && err.name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error(err)
        }
      })
      return p
    }

    return () => {
      HTMLMediaElement.prototype.play = orig
    }
  }, [])

  return null
}
