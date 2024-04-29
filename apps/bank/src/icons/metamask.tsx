import Image from 'next/image';
import imageSrc from './assets/metamask.png';

export function MetaMask(props: { width?: number }) {
  const { width = 32 } = props;

  return <Image src={imageSrc} width={width} height={width} alt="" />;
}

export const metamaskImageSrc = imageSrc;
