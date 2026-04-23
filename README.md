# ⚡ BlitzGuard

**AI-powered fair-drop platform that protects limited releases from bots.**

BlitzGuard verifies human buyers using GitHub activity analysis and on-chain proof, then lets verified agents compete in a real-time battle queue to secure limited-edition products fairly.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Ethereum](https://img.shields.io/badge/Ethereum-dApp-6F42C1?logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

- **Human Verification** — GitHub-based identity analysis to distinguish real users from bots
- **Agent Arming** — Verified users deploy AI agents that compete fairly in the drop queue
- **Real-Time Battle** — Live visualization of agents vs bots with transaction streaming
- **On-Chain Proof** — Blockchain-backed verification for transparent and trustless drops
- **Animated UI** — Premium dark-themed interface with smooth animations powered by Motion

## 🏗️ Architecture

```
packages/
├── nextjs/          # Frontend — Next.js 15, React, Motion, Zustand
├── hardhat/         # Smart Contracts — Solidity, Hardhat
└── backend/         # API Server — Express, Socket.IO, GitHub Analysis
```

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start local blockchain
yarn chain

# Deploy contracts
yarn deploy

# Start frontend
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔄 How It Works

1. **Connect** — User connects their Ethereum wallet
2. **Verify** — GitHub account is analyzed for human activity patterns
3. **Arm** — Verified user activates their AI agent for the drop
4. **Battle** — Agents compete against bots in a fair, real-time queue
5. **Result** — Winners secure the product; bots are filtered out

## 👥 Team

- [arzu01k](https://github.com/arzu01k) — Project setup, layout & navigation
- [bilgekucukcakmak](https://github.com/bilgekucukcakmak) — Backend services & battle engine
- [niisakonur](https://github.com/niisakonur) — UI components & animations
- [euzghe](https://github.com/euzghe) — Verification, results & state management

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, DaisyUI |
| Animations | Motion (Framer Motion) |
| State | Zustand |
| Smart Contracts | Solidity, Hardhat |
| Backend | Express, Socket.IO |
| Blockchain | Ethereum, Wagmi, Viem, RainbowKit |

## 📄 License

MIT