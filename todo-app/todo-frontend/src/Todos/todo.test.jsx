import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import TodoList from './List';

test('A single todo can be viewed', () => {
  const deleteTodo = vi.fn();
  const completeTodo = vi.fn();
  const todos = [
    {
      id: '1',
      text: 'test',
      done: false,
    },
  ];

  render(
    <TodoList
      todos={todos}
      deleteTodo={deleteTodo}
      completeTodo={completeTodo}
    />
  );
  expect(screen.getByText('test'));
});
