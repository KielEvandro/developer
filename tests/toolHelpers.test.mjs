import { jest } from '@jest/globals';
import * as toolHelpers from '../src/toolHelpers.mjs';

describe('toolHelpers', () => {
  describe('buildResponse', () => {
    it('wraps data in content array', () => {
      const data = { foo: 'bar' };
      const res = toolHelpers.buildResponse(data);
      expect(res).toEqual({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
    });
  });
});
