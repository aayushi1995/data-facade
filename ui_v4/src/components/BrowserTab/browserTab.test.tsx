/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BrowserTab from './index';

describe('BrowserTab', () => {
  it('should render without errors', () => {
    const { container } = render(
      <BrowserTab>
        <div>Test</div>
      </BrowserTab>
    );
    expect(container).toBeTruthy();
  });

  it('should add a tab when adding a new tab is triggered', () => {
    const { getByText, getAllByTestId } = render(
      <BrowserTab>
        <div>Test</div>
      </BrowserTab>
    );
    fireEvent.click(getByText('Add'));
    const tabs = getAllByTestId('tab');
    expect(tabs).toHaveLength(2);
  });

  it('should remove a tab when removing a tab is triggered', () => {
    const { getByText, getAllByTestId } = render(
      <BrowserTab>
        <div>Test</div>
      </BrowserTab>
    );
    fireEvent.click(getByText('Add'));
    fireEvent.click(getByText('Remove'));
    const tabs = getAllByTestId('tab');
    expect(tabs).toHaveLength(1);
  });
});