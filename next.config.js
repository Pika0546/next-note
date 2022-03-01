/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		MONGO_URI: 'mongodb+srv://note-admin:note-admin@cluster0.m8dbh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
	}
}	

module.exports = nextConfig
