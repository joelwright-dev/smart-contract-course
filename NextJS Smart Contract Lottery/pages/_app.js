import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { AppShell, Header, Group } from "@mantine/core"
import Logo from "../components/Logo"
import Connection from "../components/Connection"
import ManualHeader from "../components/ManualHeader"

function MyApp({ Component, pageProps }) {
	return (
		<MoralisProvider initializeOnMount={false}>
			<AppShell
				padding="md"
				header={
					<Header height={60} p="xs">
						<Group position="apart">
							<Logo />
							<ManualHeader />
						</Group>
					</Header>
				}
			>
				<Component {...pageProps} />
			</AppShell>
		</MoralisProvider>
	)
}

export default MyApp
