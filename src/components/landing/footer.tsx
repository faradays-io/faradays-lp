import { CopyEmail } from '@/components/landing/copy-email'

export function Footer() {
	return (
		<footer className="bg-background text-foreground">
			<div className="text-h4 grid items-end gap-2 bg-[#f4f4f4] p-7 text-[#0f0f0e] sm:grid-cols-3">
				<p>
					São Paulo, SP
					<br />
					CNPJ 65.590.441/0001-36
				</p>
				<p className="sm:text-center">
					<CopyEmail className="transition-opacity hover:opacity-70" />
				</p>
				<p className="sm:text-right">© 2026 Faradays Consulting LTDA</p>
			</div>
		</footer>
	)
}
