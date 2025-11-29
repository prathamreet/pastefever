'use client'

import { useState, useEffect, useRef } from 'react'

export default function PasteFever() {
  const [count, setCount] = useState(0)
  const [history, setHistory] = useState([])
  const [status, setStatusText] = useState('Ready')
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const iconRef = useRef(null)

  // Initialize theme
  useEffect(() => {
    const initTheme = () => {
      const saved = localStorage.getItem('pf-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = saved || (prefersDark ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', theme)
    }

    // Load history
    const saved = localStorage.getItem('pf-history')
    if (saved) {
      const loadedHistory = JSON.parse(saved)
      setHistory(loadedHistory)
      setCount(loadedHistory.length)
    }

    initTheme()

    // System theme change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (!localStorage.getItem('pf-theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Paste handler
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items

      for (let item of items) {
        if (item.type.includes('image')) {
          processImage(item.getAsFile())
          return
        }
      }

      for (let item of items) {
        if (item.type === 'text/plain') {
          item.getAsString(processText)
          return
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [history])

  const processImage = (blob) => {
    setStatusText('Processing...')
    setIsLoading(true)

    const url = URL.createObjectURL(blob)
    const ext = blob.type.split('/')[1] || 'png'
    const name = `pastefever-${Date.now()}.${ext}`
    const size = (blob.size / 1024).toFixed(1)

    const img = new Image()
    img.onload = () => {
      complete({
        url,
        name,
        size: `${size}KB`,
        type: 'image',
        dim: `${img.width}×${img.height}`,
      })
    }
    img.src = url
  }

  const processText = (text) => {
    if (!text?.trim()) return

    setStatusText('Processing...')
    setIsLoading(true)

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const name = `pastefever-${Date.now()}.txt`
    const size = (blob.size / 1024).toFixed(1)

    complete({
      url,
      name,
      size: `${size}KB`,
      type: 'text',
      dim: `${text.length} chars`,
    })
  }

  const complete = (data) => {
    // Download
    const a = document.createElement('a')
    a.href = data.url
    a.download = data.name
    a.click()

    // Update history
    const newHistory = [data, ...history].slice(0, 50)
    setHistory(newHistory)
    setCount(newHistory.length)
    localStorage.setItem('pf-history', JSON.stringify(newHistory))

    // UI feedback
    setStatusText('Downloaded')
    setIsLoading(false)
    setShowToast(true)
    pulseIcon()

    setTimeout(() => {
      setStatusText('Ready')
      setShowToast(false)
    }, 2000)
  }

  const redownload = (data) => {
    const a = document.createElement('a')
    a.href = data.url
    a.download = data.name
    a.click()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const pulseIcon = () => {
    if (iconRef.current) {
      iconRef.current.style.transform = 'scale(0.95)'
      setTimeout(() => {
        iconRef.current.style.transform = 'scale(1)'
      }, 150)
    }
  }

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('pf-theme', next)
  }

  const clearHistory = () => {
    if (!confirm('Clear all history?')) return

    setHistory([])
    setCount(0)
    localStorage.removeItem('pf-history')
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Sidebar */}
      <aside 
        className="w-80 border-r border-main bg-alt flex flex-col transition-theme"
        aria-label="Download history sidebar"
      >
        <header className="p-6 border-b border-light transition-theme">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-muted uppercase tracking-wider">
              History
            </h2>
            <span className="text-xs text-faint" aria-label={`${count} items in history`}>
              {count}
            </span>
          </div>
        </header>

        <nav className="flex-1 overflow-y-auto" aria-label="Download history">
          {history.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-faint">No items yet</p>
            </div>
          ) : (
            <ul role="list">
              {history.map((item, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left p-4 border-b border-light transition-theme hover:opacity-70 ${
                      index === 0 ? 'fade-in' : ''
                    }`}
                    onClick={() => redownload(item)}
                    aria-label={`Re-download ${item.name}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-main truncate pr-4">{item.name}</span>
                      <span className="text-[10px] text-faint shrink-0">{item.size}</span>
                    </div>
                    <span className="text-[10px] text-muted">{item.dim}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <footer className="p-4 border-t border-light flex items-center justify-between transition-theme">
          <button
            onClick={clearHistory}
            className="text-xs text-muted hover:text-soft transition-colors"
            aria-label="Clear all history"
          >
            Clear all
          </button>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          />
        </footer>
      </aside>

      {/* Main */}
      <main 
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center relative bg-main transition-theme"
      >
        <div className="text-center space-y-8 max-w-md px-8">
          {/* Icon */}
          <div
            ref={iconRef}
            className="w-16 h-16 mx-auto rounded-2xl bg-alt border border-main flex items-center justify-center transition-theme"
            style={{ transition: 'transform 0.15s ease' }}
            aria-hidden="true"
          >
            <svg
              className="w-6 h-6 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-2xl font-light text-main">PasteFever</h1>
            <p className="text-sm text-muted font-light">
              Paste images or text to download instantly
            </p>
          </div>

          {/* Shortcut */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-alt border border-main transition-theme"
            role="note"
            aria-label="Keyboard shortcut instructions"
          >
            <kbd className="px-2 py-1 text-xs font-medium text-soft bg-main rounded transition-theme">
              ⌘ + V
            </kbd>
            <span className="text-xs text-muted">or</span>
            <kbd className="px-2 py-1 text-xs font-medium text-soft bg-main rounded transition-theme">
              Ctrl + V
            </kbd>
          </div>

          {/* Status */}
          <p 
            className={`text-xs font-light ${isLoading ? 'text-muted pulse-soft' : 'text-faint'}`}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        </div>

        {/* Formats */}
        <div 
          className="absolute bottom-8 flex gap-2 text-[10px] text-faint uppercase tracking-wide"
          aria-label="Supported formats"
        >
          <span>png</span>
          <span aria-hidden="true">•</span>
          <span>jpg</span>
          <span aria-hidden="true">•</span>
          <span>gif</span>
          <span aria-hidden="true">•</span>
          <span>txt</span>
        </div>
      </main>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
          showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'var(--toast-bg)', color: 'var(--toast-text)' }}
      >
        Downloaded
      </div>
    </div>
  )
}