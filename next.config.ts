// Validate environment variables at build time (throws on missing/invalid).
import './src/env'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// A landing do produto de distribuição nasceu como /importacoes,
			// passou por /distribuicao e hoje é /fs1 (nome do agente); 301
			// preserva links já compartilhados.
			{
				source: '/importacoes',
				destination: '/fs1',
				permanent: true
			},
			{
				source: '/distribuicao/:path*',
				destination: '/fs1/:path*',
				permanent: true
			}
		]
	}
}

export default nextConfig
