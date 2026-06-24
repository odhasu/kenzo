import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // For now just acknowledge the save — templates are hardcoded.
  // In future this persists to DB.
  console.log(`Template "${id}" updated:`, body.name)
  return NextResponse.json({ id, ...body })
}
