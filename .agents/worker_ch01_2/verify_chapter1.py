import re
import json
import traceback
import sys

def verify_markdown_content():
    readme_path = "/Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/chapters/ch01-iot-introduction/README.md"
    print(f"Reading file: {readme_path}")
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Extract JSON code block
    json_pattern = re.compile(r"```json\n(.*?)\n```", re.DOTALL)
    json_matches = json_pattern.findall(content)
    if not json_matches:
        print("❌ Error: No JSON code block found!")
        sys.exit(1)
    
    for i, j_match in enumerate(json_matches):
        try:
            parsed = json.loads(j_match)
            print(f"✅ JSON block {i+1} is valid. Device ID: {parsed.get('device_id', 'N/A')}")
        except Exception as e:
            print(f"❌ Error: JSON block {i+1} failed to parse: {e}")
            traceback.print_exc()
            sys.exit(1)

    # 2. Extract Python code block
    py_pattern = re.compile(r"```python\n(.*?)\n```", re.DOTALL)
    py_matches = py_pattern.findall(content)
    if not py_matches:
        print("❌ Error: No Python code block found!")
        sys.exit(1)

    for i, py_match in enumerate(py_matches):
        try:
            print(f"Compiling Python block {i+1}...")
            # Compile to check for syntax errors
            compiled_code = compile(py_match, f"inline_py_block_{i+1}.py", "exec")
            print(f"✅ Python block {i+1} compiled successfully (No syntax errors).")
            
            # Execute in isolated scope to verify it runs and matches output rules
            print(f"Executing Python block {i+1}...")
            local_vars = {}
            # Capture stdout
            import io
            from contextlib import redirect_stdout
            f = io.StringIO()
            with redirect_stdout(f):
                exec(compiled_code, {}, local_vars)
            output = f.getvalue()
            print("Captured Output:")
            print(output)
            
            # Verify the output contains warnings/critical/status
            if "📊 ได้รับข้อมูลจากอุปกรณ์" not in output:
                print("❌ Error: Missing expected telemetry processing header")
                sys.exit(1)
            if "⚠️ [WARNING]" not in output and "🔥 [CRITICAL]" not in output and "✅ สถานะเครื่องจักร: ปกติ" not in output:
                print("❌ Error: Logic did not output status correctly")
                sys.exit(1)
            print(f"✅ Python block {i+1} executed successfully.")
        except Exception as e:
            print(f"❌ Error: Python block {i+1} failed execution: {e}")
            traceback.print_exc()
            sys.exit(1)

    # 3. Check for basic Markdown structural issues
    # Verify that all dollar signs for equations are balanced
    double_dollars = content.count("$$")
    if double_dollars % 2 != 0:
        print(f"❌ Error: Unbalanced double dollar signs ($$) found: count is {double_dollars}")
        sys.exit(1)
    else:
        print(f"✅ Double dollar signs ($$) are balanced: count is {double_dollars} ({double_dollars // 2} equations)")

    # Verify that all code blocks are closed
    code_ticks = content.count("```")
    if code_ticks % 2 != 0:
        print(f"❌ Error: Unbalanced triple backticks (```) found: count is {code_ticks}")
        sys.exit(1)
    else:
        print(f"✅ Triple backticks (```) are balanced: count is {code_ticks} ({code_ticks // 2} blocks)")

    print("🎉 All verification checks passed successfully!")

if __name__ == "__main__":
    verify_markdown_content()
