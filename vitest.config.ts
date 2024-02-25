import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['*/test/**/*.test.ts'],
		reporters: ['basic'],
		coverage: {
			provider: 'istanbul',
			reportsDirectory: './coverage',
			reporter: ['text', 'html']
		}
	}
})
