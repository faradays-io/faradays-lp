import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

/* ------------------------------------------------------------------ *
 * Type-safe environment variables (t3-env + zod).
 *
 * Import `env` from here instead of touching `process.env` directly —
 * values are validated once (parsed against the schemas below) and
 * fully typed. Accessing a `server` var on the client throws.
 *
 * Validation runs at import time. `next.config.ts` imports this file so
 * a missing/invalid var fails the BUILD loudly, not at runtime.
 *
 * To add a var: declare it in the matching block, then — for `client`
 * and `shared` only — map it in `experimental__runtimeEnv` (Next inlines
 * `NEXT_PUBLIC_*` at build, so those must be destructured explicitly;
 * server vars are read automatically). Document it in `.env.example`.
 * ------------------------------------------------------------------ */

export const env = createEnv({
	/** Available on both server and client. */
	shared: {
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development')
	},

	/** Server-only. Throws if accessed in client code. */
	server: {
		// DATABASE_URL: z.url(),
		// OPENAI_API_KEY: z.string().min(1),
	},

	/** Exposed to the client — MUST be prefixed with `NEXT_PUBLIC_`. */
	client: {
		// NEXT_PUBLIC_APP_URL: z.url(),
	},

	/**
	 * Destructure `client` + `shared` vars here so Next's build-time
	 * inlining sees them. Server vars are read from `process.env` directly.
	 */
	experimental__runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV
		// NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},

	/** Treat empty strings as undefined (so `FOO=` triggers the schema). */
	emptyStringAsUndefined: true,

	/** Skip validation when needed (e.g. Docker build, linting). */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION
})
