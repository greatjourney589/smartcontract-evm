declare global {
  interface Window {
    ethereum?: {
      enable: () => Promise<void>;
    };
  }
}
