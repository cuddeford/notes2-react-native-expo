import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from 'react-native'

export default function RootLayout() {
	const colorScheme = useColorScheme()

	return (
		<>
			<StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
			<Stack
				screenOptions={{
					headerShown: false,
					headerTintColor: colorScheme === 'dark' ? 'white' : 'black',
					headerStyle: {
						backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
					},
				}}
			/>
		</>
	)
}
