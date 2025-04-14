import { useEffect, useState, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, EditorState, LexicalEditor } from "lexical";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";
import { $isRangeSelection, FORMAT_TEXT_COMMAND, $getSelection } from "lexical";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode } from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

import "./PolicyEditor.css";

// Custom plugin to preserve scroll position
function ScrollPlugin() {
  const [editor] = useLexicalComposerContext();
  const scrollRef = useRef<number>(0);
  const editorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, dirtyLeaves }) => {
      // Skip if there are no changes
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
        return;
      }

      // Only run after the DOM has been updated
      setTimeout(() => {
        if (!editorRef.current) {
          const rootElement = editor.getRootElement();
          if (rootElement) {
            // Find the actual contentEditable element
            const contentEditables = rootElement.getElementsByClassName(
              "policy-editor-input"
            );
            if (contentEditables.length > 0) {
              editorRef.current = contentEditables[0] as HTMLElement;
            }
          }
        }

        if (editorRef.current) {
          // After updates, restore the scroll position
          editorRef.current.scrollTop = scrollRef.current;
        }
      }, 0);
    });
  }, [editor]);

  useEffect(() => {
    if (!editorRef.current) {
      const rootElement = editor.getRootElement();
      if (rootElement) {
        const contentEditables = rootElement.getElementsByClassName(
          "policy-editor-input"
        );
        if (contentEditables.length > 0) {
          editorRef.current = contentEditables[0] as HTMLElement;
        }
      }
    }

    const saveScrollPosition = () => {
      if (editorRef.current) {
        scrollRef.current = editorRef.current.scrollTop;
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener("scroll", saveScrollPosition);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("scroll", saveScrollPosition);
      }
    };
  }, [editor]);

  return null;
}

// Theme for the editor
const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

// Simple Toolbar Plugin
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));

          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getTopLevelElementOrThrow();
          if ($isHeadingNode(element)) {
            setBlockType(element.getTag());
          } else {
            setBlockType("paragraph");
          }
        }
      });
    });
  }, [editor]);

  const formatHeading = (headingSize: "h1" | "h2") => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={isBold ? "active" : ""}
        title="Bold"
        type="button"
        aria-label="Format text as bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={isItalic ? "active" : ""}
        title="Italic"
        type="button"
        aria-label="Format text as italics"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={isUnderline ? "active" : ""}
        title="Underline"
        type="button"
        aria-label="Format text to underlined"
      >
        <Underline className="h-4 w-4" />
      </button>

      <div className="divider" />

      <button
        onClick={() => formatHeading("h1")}
        className={blockType === "h1" ? "active" : ""}
        title="Heading 1"
        type="button"
        aria-label="Format as heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => formatHeading("h2")}
        className={blockType === "h2" ? "active" : ""}
        title="Heading 2"
        type="button"
        aria-label="Format as heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <div className="divider" />

      <button
        onClick={formatBulletList}
        title="Bullet List"
        type="button"
        aria-label="Format as bullet list"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={formatNumberedList}
        title="Numbered List"
        type="button"
        aria-label="Format as numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
    </div>
  );
}

// Import HTML Plugin
function HtmlImportPlugin({
  initialHtml,
  setEditor,
}: {
  initialHtml: string;
  setEditor: (editor: LexicalEditor) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    console.log(
      "HtmlImportPlugin effect running, editor:",
      !!editor,
      "initialHtml:",
      initialHtml
        ? initialHtml.substring(0, 50) + (initialHtml.length > 50 ? "..." : "")
        : "empty"
    );

    if (editor && !isInitializedRef.current) {
      setEditor(editor);
      isInitializedRef.current = true;

      editor.update(() => {
        try {
          if (initialHtml && initialHtml.trim() !== "") {
            console.log("Importing HTML content into editor");
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialHtml, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);

            const root = $getRoot();
            root.clear();
            $insertNodes(nodes);
            console.log("HTML content imported successfully");
          } else {
            // If no initial content, ensure we have at least a paragraph
            const root = $getRoot();
            if (root.getChildrenSize() === 0) {
              const paragraph = $createParagraphNode();
              root.append(paragraph);
            }
          }
        } catch (error) {
          console.error("Error importing HTML content:", error);
          // Ensure we have at least a paragraph on error
          const root = $getRoot();
          if (root.getChildrenSize() === 0) {
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          }
        }
      });
    }
  }, [editor, initialHtml, setEditor]);

  return null;
}

export interface PolicyEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

export default function PolicyEditor({
  initialContent,
  onChange,
}: PolicyEditorProps) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const initialContentRef = useRef(initialContent);

  // Update reference if initialContent changes
  useEffect(() => {
    initialContentRef.current = initialContent;
  }, [initialContent]);

  console.log("PolicyEditor rendering with initialContent:", initialContent);

  // Function to handle editor changes
  const handleEditorChange = (editorState: EditorState) => {
    if (!editor) return;

    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      console.log(
        "Editor content changed:",
        htmlString.substring(0, 100) + (htmlString.length > 100 ? "..." : "")
      );
      onChange(htmlString);
    });
  };

  // Lexical Editor Configuration
  const initialConfig = {
    namespace: "PolicyEditor",
    theme,
    onError: (error: Error) => {
      console.error("Lexical Editor Error:", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <div className="policy-editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="policy-editor">
          <ToolbarPlugin />
          <div className="policy-editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="policy-editor-input" />
              }
              placeholder={
                <div className="policy-editor-placeholder">
                  Enter policy content...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <OnChangePlugin onChange={handleEditorChange} />
            <HtmlImportPlugin
              initialHtml={initialContentRef.current}
              setEditor={setEditor}
            />
            <ScrollPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
