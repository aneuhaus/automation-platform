'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateWorkflowInputSchema,
  CreateWorkflowInput,
} from '@automation-platform/contracts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CreateWorkflowPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkflowInput>({
    resolver: zodResolver(CreateWorkflowInputSchema),
    defaultValues: {
      name: '',
      description: '',
      definition: {}, // Default empty object for workflow definition
    },
  })

  const onSubmit = async (data: CreateWorkflowInput) => {
    setLoading(true)
    setError(null)
    try {
      const proxyResponse = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!proxyResponse.ok) {
        const errorData = await proxyResponse.json()
        throw new Error(errorData.message || 'Failed to create workflow')
      }

      router.push('/workflows')
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/workflows">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Workflow</h1>
          <p className="text-slate-500 mt-1">
            Define your automation logic and triggers.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              placeholder="e.g., Customer Onboarding"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What does this workflow do?"
              className="min-h-[100px]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="definition">Workflow Definition (JSON)</Label>
            <p className="text-xs text-slate-400 mb-2">
              For now, please provide a valid JSON object.
            </p>
            <Textarea
              id="definition"
              placeholder='{ "steps": [] }'
              className="font-mono text-xs min-h-[150px]"
              defaultValue="{}"
              onChange={(e) => {
                try {
                  const val = JSON.parse(e.target.value)
                  console.log(val)
                } catch (err: unknown) {
                  if (err instanceof Error) {
                    setError(err.message)
                  } else {
                    setError('An unknown error occurred')
                  }
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Workflow
            </Button>
            <Button variant="outline" asChild>
              <Link href="/workflows">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
