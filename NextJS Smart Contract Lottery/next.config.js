/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
	},

	images: { loader: "custom" },
}

module.exports = nextConfig
