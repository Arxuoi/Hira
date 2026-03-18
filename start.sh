#!/bin/bash

# Hira Bot Startup Script for Termux
# Author: Hira

clear

echo "╭━━━━━━━━━━━━━━━━━━━━━━╮"
echo "┃   🤖 HIRA BOT 🤖     ┃"
echo "┃   Starting Up...      ┃"
echo "╰━━━━━━━━━━━━━━━━━━━━━━╯"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js belum terinstall!"
    echo "📦 Installing Node.js..."
    pkg update -y
    pkg install nodejs -y
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    pkg install git -y
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create necessary directories
mkdir -p database temp

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  File .env belum ada!"
    echo "📝 Copy dari .env.example..."
    cp .env.example .env
    echo "✅ Silakan edit file .env sesuai kebutuhan"
fi

echo ""
echo "🚀 Starting Hira Bot..."
echo ""

# Start the bot
npm start
