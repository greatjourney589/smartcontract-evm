'use client';

import { createWalletClient, createPublicClient, custom, http } from 'viem';
import { getContract } from 'viem';
import { sepolia } from 'viem/chains';

const abi = [
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function Index() {
  function onConnect() {
    async function processAsync() {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });

      const client = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum!),
      });

      const [address] = await client.requestAddresses();
      console.log({ address });

      const contract = getContract({
        address: '0x37C3E0343b0c5E23913eB3f4c346FAF336bf6408',
        abi,
        client: {
          public: publicClient,
          wallet: client,
        },
      });

      const balance = await contract.read.getBalance([address]);
      console.log({ balance });
    }

    processAsync();
  }

  function onDeposit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('deposit');
  }

  return (
    <div>
      <aside className="p-4 border rounded my-4">
        <h2>Account</h2>
        <dl>
          <dt className="inline font-semibold text-gray-900">Address</dt>
          <dd>0x1234567890abcdef</dd>
          <dt className="inline font-semibold text-gray-900">Chain</dt>
          <dd>ETH</dd>
          <dt className="inline font-semibold text-gray-900">Balance</dt>
          <dd>1000</dd>
        </dl>
        <div className="my-2">
          <button
            onClick={onConnect}
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Connect
          </button>
        </div>
      </aside>
      <section className="p-4 border rounded my-4">
        <h2>Bank</h2>
        <dl>
          <dt className="inline font-semibold text-gray-900">Balance</dt>
          <dd>1000</dd>
        </dl>
        <form onSubmit={onDeposit}>
          <div className="my-2">
            <div className="flex items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Amount
              </label>
              <div className="text-sm ml-4">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  ?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                name="amount"
                type="number"
                required
                className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="my-2">
            <button
              type="submit"
              className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Deposit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
