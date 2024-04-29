import { stringShorten } from '@app/utils';
import { Bank } from '../icons/bank';
import { MetaMask } from '../icons/metamask';

type Props = {
  appName: string;
  onConnect?: () => void;
  address?: string | null | undefined;
};

export function Nav({ appName, address, onConnect }: Props) {
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
                {address == null ? (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="bg-gray-900 flex items-center text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <span className="mr-2">
                      <MetaMask width={20} />
                    </span>
                    Connect wallet
                  </button>
                ) : (
                  <div className="flex items-center bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">
                    <span className="mr-2">
                      <MetaMask width={20} />
                    </span>
                    {stringShorten(address)}
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
