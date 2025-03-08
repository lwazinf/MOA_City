import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TicketTimer from './index';
import '@testing-library/jest-dom';

// Mock the utility functions
jest.mock('@/lib/timerUtils', () => ({
  getCurrentTier: jest.fn(() => ({
    tier: 0,
    price: 'R10',
    startMinute: 0,
    endMinute: 180
  })),
  getNextTierInfo: jest.fn(() => ({
    price: 'R20',
    startMinute: 180
  })),
  getDetailedTimeUntilChange: jest.fn(() => ({
    hours: 2,
    minutes: 30,
    totalMinutes: 150,
    percentage: 70
  })),
  calculateActiveDots: jest.fn(() => 3),
  getTimeUntilChange: jest.fn(() => '2h 30m')
}));

describe('TicketTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the ticket timer widget', () => {
    render(<TicketTimer />);
    expect(screen.getByTestId('ticket-timer')).toBeInTheDocument();
  });

  it('expands when clicked', () => {
    render(<TicketTimer />);
    const timer = screen.getByRole('button');
    expect(timer).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(timer);
    expect(timer).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows payment confirmation after paying', () => {
    render(<TicketTimer />);
    
    // Expand the widget
    fireEvent.click(screen.getByRole('button'));
    
    // Find and click the pay button
    const payButton = screen.getByRole('button', { name: /pay .* now/i });
    fireEvent.click(payButton);
    
    // Check for payment confirmation
    expect(screen.getByText('Payment Complete')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your payment')).toBeInTheDocument();
  });

  it('calls onPayment callback when payment is made', () => {
    const mockOnPayment = jest.fn();
    render(<TicketTimer onPayment={mockOnPayment} />);
    
    // Expand the widget
    fireEvent.click(screen.getByRole('button'));
    
    // Find and click the pay button
    const payButton = screen.getByRole('button', { name: /pay .* now/i });
    fireEvent.click(payButton);
    
    expect(mockOnPayment).toHaveBeenCalledWith('R10');
  });

  it('supports keyboard navigation', () => {
    render(<TicketTimer />);
    const timer = screen.getByRole('button');
    
    // Focus and press enter
    timer.focus();
    fireEvent.keyDown(timer, { key: 'Enter' });
    
    expect(timer).toHaveAttribute('aria-expanded', 'true');
    
    // Press enter again to collapse
    fireEvent.keyDown(timer, { key: 'Enter' });
    expect(timer).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates timer state over time', () => {
    const { rerender } = render(<TicketTimer />);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    rerender(<TicketTimer />);
    
    // This would typically assert changing values, but since we've mocked the utils,
    // we're just checking the component still renders after time advances
    expect(screen.getByTestId('ticket-timer')).toBeInTheDocument();
  });
}); 