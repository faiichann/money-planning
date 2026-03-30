// import GraphemeSplitter from "grapheme-splitter";

interface HighlightProps {
  text: string;
  highlight: string;
}

const HighlightText = ({ text, highlight }: HighlightProps) => {
  // trim white space
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  // Use RegExp
  // const regex = new RegExp(`(${highlight})`, "gi");
  // const parts = text.split(regex);

  // Use GraphemeSplitter to split graphemes
  // const splitter = new GraphemeSplitter();
  // const regex = new RegExp(`(${highlight})`, "gi");
  // const parts = splitter.splitGraphemes(text);

  // fix highlight -
  // const regex = new RegExp(
  //   `(${highlight.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
  //   "gi"
  // );
  const regex = new RegExp(`(${highlight.split("").join("-?")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} style={{ fontWeight: "bold", color: "red" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightText;
