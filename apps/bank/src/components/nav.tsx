'use client';

import { stringShorten } from '@app/utils';
import { Bank } from '../icons/bank';
import { MetaMask } from '../icons/metamask';

import { useWallet } from '../store/useWallet';

type Props = {
  appName: string;
};

export function Nav({ appName }: Props) {
  const { refetch: connect, data, isFetching } = useWallet();

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bank size={42} />
            </div>
            <h1 className="ml-1 text-white font-semibold text-lg">{appName}</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative ml-3">
                {data == null ? (
                  <button
                    type="button"
                    onClick={() => connect()}
                    disabled={isFetching}
                    className="bg-gray-900 flex items-center text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <span className="mr-2">
                      <MetaMask width={20} />
                    </span>
                    {isFetching ? 'Connecting...' : 'Connect wallet'}
                  </button>
                ) : (
                  <div className="flex items-center bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">
                    <span className="mr-2">
                      <MetaMask width={20} />
                    </span>
                    {stringShorten(data?.address || '0x')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
