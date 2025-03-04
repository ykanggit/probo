import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  Point,
  RangeSelection,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import { useCallback, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [, setSelectedElementKey] = useState<string | null>(null);
  const [textAlignment, setTextAlignment] = useState<
    "left" | "center" | "right" | "justify"
  >("left");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Check for links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      // Get text alignment
      const alignment = $getSelectionStyleValueForProperty(
        selection,
        "text-align",
        "left"
      ) as "left" | "center" | "right" | "justify";
      setTextAlignment(alignment);

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setSelectedElementKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          const tag = element.getTag();
          setBlockType(tag);
        } else if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const listType = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(listType);
        } else {
          setBlockType("paragraph");
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
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

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
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
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatLink = () => {
    if (!isLink) {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const url = prompt("Enter URL", "https://");
        if (url) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const formatTextAlignment = (
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "text-align": alignment,
        });
      }
    });
  };

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo"
        type="button"
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo"
        type="button"
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      <div className="divider" />

      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
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
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
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
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={isUnderline ? "active" : ""}
        title="Underline"
        type="button"
        aria-label="Format text to underlined"
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={isStrikethrough ? "active" : ""}
        title="Strikethrough"
        type="button"
        aria-label="Format text with a strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        onClick={formatLink}
        className={isLink ? "active" : ""}
        title="Link"
        type="button"
        aria-label="Insert link"
      >
        <Link className="h-4 w-4" />
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
      <button
        onClick={() => formatHeading("h3")}
        className={blockType === "h3" ? "active" : ""}
        title="Heading 3"
        type="button"
        aria-label="Format as heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>
      <button
        onClick={formatBulletList}
        className={blockType === "ul" ? "active" : ""}
        title="Bullet List"
        type="button"
        aria-label="Format as bullet list"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={formatNumberedList}
        className={blockType === "ol" ? "active" : ""}
        title="Numbered List"
        type="button"
        aria-label="Format as numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        onClick={formatQuote}
        className={blockType === "quote" ? "active" : ""}
        title="Quote"
        type="button"
        aria-label="Format as blockquote"
      >
        <Quote className="h-4 w-4" />
      </button>

      <div className="divider" />

      <button
        onClick={() => formatTextAlignment("left")}
        className={textAlignment === "left" ? "active" : ""}
        title="Align Left"
        type="button"
        aria-label="Align text left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => formatTextAlignment("center")}
        className={textAlignment === "center" ? "active" : ""}
        title="Align Center"
        type="button"
        aria-label="Align text center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        onClick={() => formatTextAlignment("right")}
        className={textAlignment === "right" ? "active" : ""}
        title="Align Right"
        type="button"
        aria-label="Align text right"
      >
        <AlignRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => formatTextAlignment("justify")}
        className={textAlignment === "justify" ? "active" : ""}
        title="Justify"
        type="button"
        aria-label="Justify text"
      >
        <AlignJustify className="h-4 w-4" />
      </button>
    </div>
  );
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function $isAtNodeEnd(point: Point) {
  return point.offset === point.getNode().getTextContentSize();
}
