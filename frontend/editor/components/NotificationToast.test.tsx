import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationToast } from './NotificationToast';
import { Notification } from '../hooks/useNotifications';

describe('NotificationToast', () => {
  it('should render success notification', () => {
    const notification: Notification = {
      id: '1',
      type: 'success',
      message: 'Saved successfully',
    };
    const onClose = jest.fn();

    render(<NotificationToast notification={notification} onClose={onClose} />);

    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByTestId('notification-success')).toBeInTheDocument();
  });

  it('should render error notification', () => {
    const notification: Notification = {
      id: '1',
      type: 'error',
      message: 'Save failed',
    };
    const onClose = jest.fn();

    render(<NotificationToast notification={notification} onClose={onClose} />);

    expect(screen.getByText('Save failed')).toBeInTheDocument();
    expect(screen.getByTestId('notification-error')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const notification: Notification = {
      id: '1',
      type: 'info',
      message: 'Test message',
    };
    const onClose = jest.fn();

    render(<NotificationToast notification={notification} onClose={onClose} />);

    const closeButton = screen.getByTestId('notification-close');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

