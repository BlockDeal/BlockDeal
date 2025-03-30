const concurrently = require('concurrently');
const dotenv = require('dotenv');

dotenv.config();

const { result } = concurrently([
  {
    command: 'npx hardhat node',
    name: 'chain',
    prefixColor: 'yellow',
  },
  {
    command: 'sleep 5 && npx hardhat run scripts/deploy-all.ts --network localhost',
    name: 'deploy',
    prefixColor: 'blue',
  },
  {
    command: 'sleep 10 && npm run dev',
    name: 'next',
    prefixColor: 'green',
  },
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
});

result.then(
  () => {
    console.log('Development environment started successfully');
  },
  (err) => {
    console.error('Failed to start development environment:', err);
    process.exit(1);
  }
); 