import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react'
import { Button, NativeSyntheticEvent, ScrollView, StyleProp, Text, TextInput, TextInputChangeEventData, TextInputKeyPressEventData, TextStyle, View } from "react-native"

// ------------------------------------------------------------------------------Paragraph
interface IParagraph {
	id: string
	text: string
	style?: StyleProp<TextStyle>
	isFocused?: boolean
}
type ParagraphProps = IParagraph & {
	index: number
	paragraphs: IParagraph[]
	setParagraphs: (paragraphs: IParagraph[]) => void
}
const Paragraph = (props: ParagraphProps) => {
	const { id, text, style, index, paragraphs, setParagraphs, isFocused } = props

	const ref = useRef<TextInput>(null)

	const handleChangeText = async (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		let newText = e.nativeEvent.text.replace(/\n/g, '') // Strip newlines
		// Update current paragraph's text
		let updatedParagraphs = paragraphs.map(p => p.id === id ? { ...p, text: newText } : p)
		setParagraphs(updatedParagraphs)
	}

	const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
		// Handle backspace to remove empty paragraphs and move the cursor to the previous paragraph
		if (e.nativeEvent.key === 'Backspace') {
			// Prevent default behavior of adding a newline
			e.preventDefault()
			if (text.trim() === '' && (index > 0 || paragraphs.length > 1)) {
				if (index === 0) {
					paragraphs[1].isFocused = true // Focus the next paragraph
				} else {
					paragraphs[index - 1].isFocused = true // Focus the previous paragraph
				}

				const updatedParagraphs = paragraphs
					.filter((_, i) => i !== index)

				setParagraphs(updatedParagraphs)
			}
		} else if (e.nativeEvent.key === 'Enter') {
            // Prevent default behavior of adding a newline
            e.preventDefault()

            // Strip any lingering newlines from the current text and update state
            const updatedParagraphsForEnter = paragraphs.map(p => p.id === id ? { ...p, text } : p)
            setParagraphs(updatedParagraphsForEnter)

            const newParagraph: IParagraph = {
                id: `${Date.now()}`,
                text: '',
                style: style || {},
                isFocused: false,
            }

			const updatedParagraphs = paragraphs.map(p => ({ ...p, isFocused: false })) // Unfocus all paragraphs
			const newParagraphs = [
				...updatedParagraphs.slice(0, index + 1),
				newParagraph,
				...updatedParagraphs.slice(index + 1),
			]
			setParagraphs(newParagraphs)
		}
	}

	useEffect(() => {
		// Focus the TextInput when the component mounts or when isFocused changes
		if (isFocused && ref.current) {
			setTimeout(() => {
				ref?.current?.focus()
			}, 0)
		}
	}, [isFocused, ref.current])

	return (
		<TextInput
			ref={ref}
			style={{
				backgroundColor: 'rgba(255, 0, 0, 0.25)',
				borderRadius: '6%',
				width: "100%",
				padding: 16,
				margin: 8,
			}}
			onChange={handleChangeText}
			onKeyPress={handleKeyPress}
			placeholder=""
			multiline
			scrollEnabled={false}

			// selection={selection}
			// onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
		>
			<Text style={[style, { fontWeight: 'bold', fontSize: 25 }]}>
				{text}
			</Text>
		</TextInput>
	)
}

// ------------------------------------------------------------------------------Notes2
export default function Notes2() {
	const [paragraphs, setParagraphs] = useState<IParagraph[]>([])

	useEffect(() => {
		const loadParagraphs = async () => {
			try {
				const keys = await AsyncStorage.getAllKeys()
				const paragraphKeys = keys.filter(key => key.startsWith('paragraph-')).sort((a, b) => {
					const first = parseInt(a.split('-')[1])
					const second = parseInt(b.split('-')[1])
					return first - second
				})
				const values = await Promise.all(paragraphKeys.map(key => AsyncStorage.getItem(key)))
				const loadedParagraphs = values
					.map(value => value ? JSON.parse(value) : null)
					.filter(Boolean)
					.map(obj => ({
						id: obj.id as string,
						text: obj.text as string,
						style: obj.style as StyleProp<TextStyle>,
					}))

				if (loadedParagraphs.length === 0) {
					// If no paragraphs are loaded, create an initial paragraph
					const initialParagraph: IParagraph = {
						id: `${Date.now()}`,
						text: '',
						style: {},
						isFocused: true,
					}
					setParagraphs([initialParagraph])
				} else {
					setParagraphs(loadedParagraphs)
				}
			} catch (error) {
				console.error("Error loading paragraphs from AsyncStorage:", error)
			}
		}
		loadParagraphs()
	}, [])

	useEffect(() => {
		const saveParagraphs = async () => {
			try {
				await AsyncStorage.clear()
				await AsyncStorage.multiSet(paragraphs.map(p => [`paragraph-${p.id}`, JSON.stringify(p)]))
			} catch (error) {
				console.error("Error saving paragraphs to AsyncStorage:", error)
			}
		}
		saveParagraphs()
	}, [paragraphs])

	console.log(paragraphs)

	return (
		<ScrollView
			style={{
				flex: 1,
			}}
			contentContainerStyle={{}}
		>
			<View style={{
				padding: 16,
				justifyContent: "center",
				alignItems: "center",
			}}>
				{paragraphs.map((paragraph, index) => (
					<Paragraph
						key={paragraph.id}
						index={index}
						id={paragraph.id}
						text={paragraph.text}
						style={paragraph.style}
						paragraphs={paragraphs}
						setParagraphs={setParagraphs}
						isFocused={paragraph.isFocused}
					/>
				))}

				<Button title="Clear all paragraphs" onPress={() => {
					setParagraphs([{
						id: `${Date.now()}`,
						text: '',
						style: {},
						isFocused: true,
					}])
				}} />
			</View>
		</ScrollView>
	)
}
