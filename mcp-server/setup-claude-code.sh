#!/bin/bash

# Setup script for adding Resume MCP server to Claude Code

echo "Resume MCP Server - Claude Code Setup"
echo "======================================"

# Detect OS and set config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_code_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CONFIG_PATH="$HOME/.config/Claude/claude_code_config.json"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    CONFIG_PATH="$APPDATA/Claude/claude_code_config.json"
else
    echo "Unknown OS type: $OSTYPE"
    exit 1
fi

echo "Config location: $CONFIG_PATH"

# Get absolute path to MCP server
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_SERVER_PATH="$SCRIPT_DIR/dist/index.js"

echo ""
echo "Building MCP server..."
cd "$SCRIPT_DIR"
npm install
npm run build

echo ""
echo "Add this to your Claude Code config at:"
echo "$CONFIG_PATH"
echo ""
echo "----------------------------------------"
cat << EOF
{
  "mcpServers": {
    "resume": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"],
      "env": {
        "RESUME_API_URL": "https://api.resume.michaelborck.dev"
      }
    }
  }
}
EOF
echo "----------------------------------------"
echo ""
echo "If you already have other MCP servers, add the 'resume' entry to your existing mcpServers object."
echo ""
echo "After updating the config, restart Claude Code for changes to take effect."