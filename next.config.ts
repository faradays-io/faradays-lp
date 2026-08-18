// Validate environment variables at build time (throws on missing/invalid).
import './src/env'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// A landing do produto de distribuição nasceu como /importacoes;
			// 301 preserva links já compartilhados.
			{
				source: '/importacoes',
				destination: '/distribuicao',
				permanent: true
			}
		]
	}
}

export default nextConfig
