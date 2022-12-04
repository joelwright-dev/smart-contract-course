import { Group, Title, ThemeIcon } from "@mantine/core"
import { Dice5 } from "tabler-icons-react"

export default function Logo() {
	return (
		<Group>
			<ThemeIcon size="lg" color="blue.5">
				<Dice5 />
			</ThemeIcon>
			<Title color="blue.5" size="h3">
				ETH Raffle
			</Title>
		</Group>
	)
}
