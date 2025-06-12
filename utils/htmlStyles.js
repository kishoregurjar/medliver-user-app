// utils/htmlStyles.ts
import { StyleSheet } from "react-native";

export const defaultHTMLTagsStyles = StyleSheet.create({
  body: {
    color: "#333",
    fontSize: 16,
    lineHeight: 24,
  },
  p: {
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  b: { fontWeight: "bold" },
  strong: { fontWeight: "bold" },
  i: { fontStyle: "italic" },
  em: { fontStyle: "italic" },
  u: { textDecorationLine: "underline" },
  a: {
    color: "#5C59FF",
    textDecorationLine: "underline",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  h2: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  h4: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ul: {
    paddingLeft: 20,
    marginBottom: 12,
  },
  ol: {
    paddingLeft: 20,
    marginBottom: 12,
  },
  li: {
    marginBottom: 8,
    lineHeight: 22,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#ccc",
    paddingLeft: 12,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 12,
  },
  code: {
    fontFamily: "monospace",
    backgroundColor: "#f4f4f4",
    padding: 4,
    borderRadius: 4,
    color: "#d63384",
  },
  pre: {
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderCollapse: "collapse",
    width: "100%",
    marginBottom: 12,
  },
  th: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontWeight: "bold",
  },
  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
