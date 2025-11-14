//import type { Config } from '@react-router/dev/config';

// Local Config type to avoid relying on an unavailable '@react-router/dev/config' package
type Config = {
	appDirectory?: string;
	ssr?: boolean;
	prerender?: string[];
};

export default {
	appDirectory: './src/app',
	ssr: true,
	prerender: ['/*?'],
} satisfies Config;
