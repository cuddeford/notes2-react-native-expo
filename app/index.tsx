import { useState } from 'react'
import { Dimensions, StyleProp, Text, TextInput, TextStyle, View } from "react-native"

// ------------------------------------------------------------------------------Paragraph
class Paragraph {
	constructor(text: string) {
		this.text = text
	}

	id: string = Math.random().toString(36).substring(7)
	text: string
	style: StyleProp<TextStyle> = {}
}

// ------------------------------------------------------------------------------RichTextEditor
class RichTextContext {
	constructor(paragraphs: Paragraph[] = [], setParagraphs: React.Dispatch<React.SetStateAction<Paragraph[]>>) {
		this.paragraphs = paragraphs
		this.setParagraphs = setParagraphs
	}

	paragraphs: Paragraph[]
	setParagraphs: React.Dispatch<React.SetStateAction<Paragraph[]>>

	addParagraph(text: string) {
		this.paragraphs.push(new Paragraph(text))
	}

	removeParagraph(id: string) {
		this.paragraphs = this.paragraphs.filter(p => p.id !== id)
	}

	getContentAsText() {
		const blocks = this.paragraphs.map((p, index) => (
			<Text
				key={p.id}
				style={p.style}
			>
				{p.text}
			</Text>
		))

		return (
			<VStack space={4} alignItems={"center"}>
				{blocks}
			</VStack>
		)
	}
}

const useRichTextEditor = () => {
	const initialParagraphs: Paragraph[] = [
		new Paragraph("This is the first paragraph."),
		new Paragraph("This is the second paragraph."),
		new Paragraph("This is the third paragraph."),
	]
	const [paragraphs, setParagraphs] = useState<Paragraph[]>(initialParagraphs)
	const [editor] = useState(new RichTextContext(paragraphs, setParagraphs))

	return {
		editor,
	}
}

const Editor = () => {
	const { editor } = useRichTextEditor()

	return (
		<View style={{ flex: 1 }}>
			{editor.getContentAsText()}
		</View>
	)
}

// ------------------------------------------------------------------------------Notes2
export default function Notes2() {
	const [selection, setSelection] = useState({
		start: 0,
		end: 0,
	})

	const { editor } = useRichTextEditor()

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<TextInput
				style={{
					height: Dimensions.get("window").height - 100,
					borderColor: "red",
					borderWidth: 2,
					width: "100%",
					paddingHorizontal: 10,
				}}
				onChange={(e) => console.log(e.nativeEvent.text)}
				placeholder=""
				multiline
				scrollEnabled
				selection={selection}
				onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
			>
				{editor.getContentAsText()}
			</TextInput>
		</View>
	)
}
