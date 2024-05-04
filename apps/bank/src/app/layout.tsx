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
          <Nav appName="Bank3 App" />
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 w-11/12 max-w-2xl mt-10">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
