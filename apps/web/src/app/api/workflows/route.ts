import { NextResponse } from 'next/server'
import { apiClient } from '@/lib/api-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await apiClient.post('/workflows', body)
    return NextResponse.json(result)
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || 'Failed to create workflow' },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { message: 'An unknown error occurred' },
      { status: 500 },
    )
  }
}
