'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Sparkles, Trash2, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LLM_PRESETS, callLlmChat, useLlmConfig } from '@/components/content-studio/llm-config'

const fieldClass =
  'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600'

export function LlmSettingsDialog({ open, onOpenChange }) {
  const { config, save, clear, isConfigured } = useLlmConfig()
  const [draft, setDraft] = useState(config)
  const [test, setTest] = useState({ state: 'idle', message: '' })

  useEffect(() => {
    if (open) {
      setDraft(config)
      setTest({ state: 'idle', message: '' })
    }
  }, [open, config])

  const applyPreset = (presetId) => {
    const preset = LLM_PRESETS.find((item) => item.id === presetId)
    if (!preset) return
    setDraft((prev) => ({
      ...prev,
      provider: preset.id,
      baseUrl: preset.id === 'custom' ? prev.baseUrl : preset.baseUrl,
      model: preset.id === 'custom' ? prev.model : preset.model,
    }))
  }

  const update = (key) => (event) => {
    const value = event?.target ? event.target.value : event
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const runTest = async () => {
    setTest({ state: 'loading', message: '' })
    try {
      await callLlmChat({
        config: draft,
        temperature: 0,
        messages: [
          { role: 'system', content: 'You are a connection test. Reply with the single word: ok.' },
          { role: 'user', content: 'ping' },
        ],
      })
      setTest({ state: 'ok', message: 'Connection successful.' })
    } catch (error) {
      setTest({ state: 'error', message: error.message || 'Connection failed.' })
    }
  }

  const handleSave = () => {
    save(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            AI Model Settings
          </DialogTitle>
          <DialogDescription>
            Connect any OpenAI-compatible endpoint. Keys are stored only in this browser and sent
            directly with each request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Provider</Label>
            <Select value={draft.provider} onValueChange={applyPreset}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Choose a provider" />
              </SelectTrigger>
              <SelectContent>
                {LLM_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Base URL</Label>
            <Input
              value={draft.baseUrl}
              onChange={update('baseUrl')}
              placeholder="https://api.openai.com/v1"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">API Key</Label>
              <Input
                type="password"
                value={draft.apiKey}
                onChange={update('apiKey')}
                placeholder="sk-..."
                autoComplete="off"
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Model</Label>
              <Input
                value={draft.model}
                onChange={update('model')}
                placeholder="gpt-4o-mini"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={runTest}
              disabled={test.state === 'loading' || !draft.baseUrl || !draft.apiKey || !draft.model}
            >
              {test.state === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Test connection'
              )}
            </Button>
            {test.state === 'ok' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {test.message}
              </span>
            )}
            {test.state === 'error' && (
              <span className="flex items-center gap-1.5 text-xs text-red-400">
                <XCircle className="h-4 w-4" /> {test.message}
              </span>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            disabled={!isConfigured}
            className="text-zinc-400 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Disconnect
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!draft.baseUrl || !draft.apiKey || !draft.model}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
