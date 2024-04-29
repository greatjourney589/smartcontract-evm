import { stringShorten } from './string-shorten';

describe('stringShorten', () => {
  it('should work', () => {
    expect(stringShorten('1234567890', 2)).toEqual('12..90');
  });
});
