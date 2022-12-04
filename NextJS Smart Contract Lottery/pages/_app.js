import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { AppShell, Header, Group } from "@mantine/core"
import Logo from "../components/Logo"
import Connection from "../components/Connection"
import ManualHeader from "../components/ManualHeader"
import { useEffect } from "react"
import { NotificationProvider } from "web3uikit"

function MyApp({ Component, pageProps }) {
	return (
		<MoralisProvider initializeOnMount={false}>
			<NotificationProvider>
				<AppShell
					padding="md"
					header={
						<Header height={60} p="xs">
							<Group position="apart">
								<Logo />
								<Connection />
							</Group>
						</Header>
					}
				>
					<Component {...pageProps} />
				</AppShell>
			</NotificationProvider>
		</MoralisProvider>
	)
}

export default MyApp
