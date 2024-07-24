import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useMemo, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { getLanguageFromPath } from "../../utilities/getLanguageFromPath"
import { SyntaxHighlighterStyle } from "../../utilities/getSyntaxHighlighterStyleFromTheme"

/*
const vscodeSyntaxStyle: React.CSSProperties = {
	backgroundColor: "var(--vscode-editor-background)",
	color: "var(--vscode-editor-foreground)",
	fontFamily: "var(--vscode-editor-font-family)",
	fontSize: "var(--vscode-editor-font-size)",
	lineHeight: "var(--vscode-editor-line-height)",
	textAlign: "left",
	whiteSpace: "pre",
	wordSpacing: "normal",
	wordBreak: "normal",
	wordWrap: "normal",
	tabSize: 4,
	hyphens: "none",
	padding: "1em",
	margin: "0.5em 0",
	overflow: "auto",
	borderRadius: "6px",
}

const tokenStyles = {
	comment: { color: "var(--vscode-editor-foreground)" },
	prolog: { color: "var(--vscode-editor-foreground)" },
	doctype: { color: "var(--vscode-editor-foreground)" },
	cdata: { color: "var(--vscode-editor-foreground)" },
	punctuation: { color: "var(--vscode-editor-foreground)" },
	property: { color: "var(--vscode-symbolIcon-propertyForeground)" },
	tag: { color: "var(--vscode-symbolIcon-colorForeground)" },
	boolean: { color: "var(--vscode-symbolIcon-booleanForeground)" },
	number: { color: "var(--vscode-symbolIcon-numberForeground)" },
	constant: { color: "var(--vscode-symbolIcon-constantForeground)" },
	symbol: { color: "var(--vscode-symbolIcon-colorForeground)" },
	selector: { color: "var(--vscode-symbolIcon-colorForeground)" },
	"attr-name": { color: "var(--vscode-symbolIcon-propertyForeground)" },
	string: { color: "var(--vscode-symbolIcon-stringForeground)" },
	char: { color: "var(--vscode-symbolIcon-stringForeground)" },
	builtin: { color: "var(--vscode-symbolIcon-keywordForeground)" },
	inserted: { color: "var(--vscode-gitDecoration-addedResourceForeground)" },
	operator: { color: "var(--vscode-symbolIcon-operatorForeground)" },
	entity: { color: "var(--vscode-symbolIcon-snippetForeground)", cursor: "help" },
	url: { color: "var(--vscode-textLink-foreground)" },
	variable: { color: "var(--vscode-symbolIcon-variableForeground)" },
	atrule: { color: "var(--vscode-symbolIcon-keywordForeground)" },
	"attr-value": { color: "var(--vscode-symbolIcon-stringForeground)" },
	keyword: { color: "var(--vscode-symbolIcon-keywordForeground)" },
	function: { color: "var(--vscode-symbolIcon-functionForeground)" },
	regex: { color: "var(--vscode-symbolIcon-regexForeground)" },
	important: { color: "var(--vscode-editorWarning-foreground)", fontWeight: "bold" },
	bold: { fontWeight: "bold" },
	italic: { fontStyle: "italic" },
	deleted: { color: "var(--vscode-gitDecoration-deletedResourceForeground)" },
}
*/

interface CodeBlockProps {
	code?: string
	diff?: string
	language?: string | undefined
	path?: string
	syntaxHighlighterStyle: SyntaxHighlighterStyle
}

const CodeBlock = ({ code, diff, language, path, syntaxHighlighterStyle }: CodeBlockProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	/*
    We need to remove leading non-alphanumeric characters from the path in order for our leading ellipses trick to work.

    ^: Anchors the match to the start of the string.
    [^a-zA-Z0-9]+: Matches one or more characters that are not alphanumeric.
    The replace method removes these matched characters, effectively trimming the string up to the first alphanumeric character.
    */
	const removeLeadingNonAlphanumeric = (path: string): string => path.replace(/^[^a-zA-Z0-9]+/, "")

	const inferredLanguage = useMemo(
		() => code && (language ?? (path ? getLanguageFromPath(path) : undefined)),
		[path, language, code]
	)

	return (
		<div
			style={{
				borderRadius: "3px",
				backgroundColor: "var(--vscode-editor-background)",
				overflow: "hidden", // This ensures the inner scrollable area doesn't overflow the rounded corners
				border: "1px solid var(--vscode-sideBar-border)",
			}}>
			{path && (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "6px 10px",
						cursor: "pointer",
					}}
					onClick={() => setIsExpanded(!isExpanded)}>
					<span
						style={{
							color: "#BABCC3",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							marginRight: "8px",
							fontSize: "11px",
							// trick to get ellipsis at beginning of string
							direction: "rtl",
							textAlign: "left",
						}}>
						{removeLeadingNonAlphanumeric(path) + "\u200E"}
					</span>
					<VSCodeButton appearance="icon" aria-label="Toggle Code" onClick={() => setIsExpanded(!isExpanded)}>
						<span className={`codicon codicon-chevron-${isExpanded ? "up" : "down"}`}></span>
					</VSCodeButton>
				</div>
			)}
			{(!path || isExpanded) && (
				<div
					className="code-block-scrollable"
					style={{
						overflowX: "auto",
						overflowY: "hidden",
						maxWidth: "100%",
					}}>
					<SyntaxHighlighter
						wrapLines={false}
						language={diff ? "diff" : inferredLanguage} // "diff" automatically colors changed lines in green/red
						style={{
							...syntaxHighlighterStyle,
							// Our syntax highlighter style doesn't always match the vscode theme 1:1, so we'll apply sensible styles here that vscode exposes to us
							'code[class*="language-"]': {
								background: "var(--vscode-editor-background)",
							},
							'pre[class*="language-"]': {
								background: "var(--vscode-editor-background)",
							},
						}}
						customStyle={{
							margin: 0,
							padding: "6px 10px",
							borderRadius: 0,
							fontSize: "var(--vscode-editor-font-size)",
							lineHeight: "var(--vscode-editor-line-height)",
							fontFamily: "var(--vscode-editor-font-family)",
						}}>
						{code ?? diff ?? ""}
					</SyntaxHighlighter>
				</div>
			)}
		</div>
	)
}

export default CodeBlock