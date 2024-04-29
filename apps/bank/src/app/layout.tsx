import './global.css';
import { Provider } from './provider';

import { Nav } from '../components/nav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-100 overflow-hidden">
      <body className="h-full">
        <Provider>
          <Nav
            appName="Bank3 App"
            address="0xd82308cE12A1383e8380D522Cce61d414899E199"
          />
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
