import { NextResponse } from 'next/server'

import { getPostBySlug } from '@/components/blog/blog-data'
import { viewsStore } from '@/lib/views'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params
	if (!getPostBySlug(slug)) {
		return NextResponse.json({ error: 'not found' }, { status: 404 })
	}
	return NextResponse.json({ views: await viewsStore.get(slug) })
}

export async function POST(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params
	if (!getPostBySlug(slug)) {
		return NextResponse.json({ error: 'not found' }, { status: 404 })
	}
	return NextResponse.json({ views: await viewsStore.increment(slug) })
}
