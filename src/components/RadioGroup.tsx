import * as React from 'react';
import styled from 'styled-components';

type RadioGroupProps<Key extends string> = {
  options: Record<Key, boolean>;
  onClick: (key: Key) => void;
};

export const RadioGroup = <Key extends string>({
  options,
  onClick,
}: RadioGroupProps<Key>) => {
  return (
    <Wrapper>
      {Object.entries(options).map(([key, selected]) => (
        <button
          onMouseDown={() => onClick(key as Key)}
          onClick={() => onClick(key as Key)}
          disabled={selected as boolean}
          key={key}
        >
          {key}
        </button>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.38rem;
  overflow: hidden;
  > button {
    padding: 1.38rem 1rem;
    font-size: 1rem;
    flex: 1 1 100%;
    border: 0;
    color: #fff;
    text-transform: capitalize;
    background: rgba(0, 0, 0, 0.1);
    &:not(:disabled) {
      opacity: 0.38;
      background: transparent;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  > * + * {
    border-left: 1px solid rgba(0, 0, 0, 0.2) !important;
  }
`;
