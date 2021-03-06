import { cleanup, getByText, render, wait } from '@testing-library/react';
import React from 'react';
import SimulatePage from './simulate-page';

describe('Info page', () => {
  afterEach(() => {
    delete global['fetch'];
    cleanup();
  });

  it('should render successfully', async () => {
    const message = 'my message';
    global['fetch'] = jest.fn().mockResolvedValueOnce({
      json: () => ({
        message,
      }),
    });

    const { baseElement } = render(<SimulatePage />);
    await wait(() => getByText(baseElement, message));
  });
});
