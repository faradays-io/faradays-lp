// Husky hook installer, run by the `prepare` lifecycle script.
//
// Why a script instead of `"prepare": "husky"`: this project's standalone
// pnpm setup fails when the husky *bin shim* runs inside the `pnpm install`
// lifecycle (it exits non-zero with no output, breaking every install).
// Calling husky's API directly via `node` sidesteps the shim and is also the
// pattern husky documents for guarding CI/production.
//
// Skipped in CI / production — dev git hooks aren't wanted there.
if (process.env.CI || process.env.NODE_ENV === 'production') {
	process.exit(0)
}
const husky = (await import('husky')).default
husky()
