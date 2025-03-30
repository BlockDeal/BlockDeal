# BlockDeal

A decentralized marketplace built on the Pi Network ecosystem with support for Ethereum and Solana.

## Features

- User authentication with Pi Network
- Web3 wallet integration (MetaMask, WalletConnect)
- Marketplace for buying and selling items
- Real-time chat for negotiations
- Rating and reporting system
- Profile management
- Responsive design for all devices

## Tech Stack

- Next.js 13 with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- Ethers.js for Web3 integration
- Pi Network SDK
- IPFS for decentralized storage

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- MetaMask or another Web3 wallet
- Pi Network account

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockdeal.git
   cd blockdeal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your values.

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
blockdeal/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Next.js pages
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   └── config/        # Configuration files
├── public/            # Static files
├── contracts/         # Smart contracts
└── scripts/          # Build and deployment scripts
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Pi Network team for their support
- Ethereum community for their tools and documentation
- Next.js team for the amazing framework
- All contributors and supporters

Last updated: 2024-03-28 12:30 