def save_markdown(data, output_path="raw_markdown.md"):
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(data)
