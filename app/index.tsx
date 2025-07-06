import { useState } from 'react'
import { Button, StyleProp, TextStyle, useColorScheme, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import Editor from './Editor-DOM'

interface IParagraph {
	id: string
	text: string
	style?: StyleProp<TextStyle>
	isFocused?: boolean
}

export default function Notes2() {
	const [paragraphs, setParagraphs] = useState<IParagraph[]>([])
	const colorScheme = useColorScheme()

	return (
		<SafeAreaView
			edges={[]}
			style={{
				flex: 1,
				width: "100%",
			}}
		>
			<Editor paragraphs={paragraphs} setParagraphs={setParagraphs} colorScheme={colorScheme} dom={{
				style: {
					backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
				}
			}} />

			<View style={{ padding: 16, paddingBottom: 32, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
				<Button
					title="Clear all paragraphs"
					onPress={() => {
						setParagraphs([{
							id: `${Date.now()}`,
							text: '',
							style: {},
							isFocused: true,
						}])
					}}
				/>
			</View>
		</SafeAreaView>
	)
}
