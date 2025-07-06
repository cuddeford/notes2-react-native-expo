'use dom'

import { ColorSchemeName } from 'react-native'
import './Editor-DOM.css'

const Paragraph = (props: {
    paragraph: any
    paragraphs: any[]
    setParagraphs: (paragraphs: any[]) => void
}) => {
    return (
        <div className="paragraph">
            <div
                className='textarea'
                contentEditable
                suppressContentEditableWarning
                onInput={e => {
                    const updatedParagraphs = props.paragraphs.map(p => {
                        if (p.id === props.paragraph.id) {
                            return {
                                ...p,
                                text: e.currentTarget.textContent || '',
                                isFocused: true,
                            }
                        }
                        return p
                    })

                    props.setParagraphs(updatedParagraphs)
                }}
                onKeyUp={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        const newParagraph = {
                            id: `${Date.now()}`,
                            text: '',
                            style: {},
                            isFocused: true,
                        }
                        const updatedParagraphs = [...props.paragraphs, newParagraph]
                        props.setParagraphs(updatedParagraphs)
                    }
                }}
            >
                {props.paragraph.text}
            </div>
        </div>
    )
}

const Editor = (props: {
    paragraphs: any[]
    setParagraphs: (paragraphs: any[]) => void
    colorScheme?: ColorSchemeName
    dom: import('expo/dom').DOMProps
}) => {
    return (
        <div id="editor" className={props.colorScheme === 'dark' ? 'dark' : ''}>
            {props.paragraphs.map(paragraph => (
                <Paragraph
                    key={paragraph.id}
                    paragraph={paragraph}
                    paragraphs={props.paragraphs}
                    setParagraphs={props.setParagraphs}
                />
            ))}
        </div>
    )
}

export default Editor
