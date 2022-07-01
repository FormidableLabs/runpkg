import * as React from 'react';
import { SearchIcon } from './SearchIcon';
import styled from 'styled-components';

type SearchInputProps = {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
};

export const SearchInput = ({
  placeholder,
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <Wrapper>
      <Input
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <SearchIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  > svg {
    width: 2.8rem;
    height: 2.8rem;
    fill: rgba(255, 255, 255, 0.2);
    margin: 0 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1.38rem;
  border: 0;
  font-size: 1.38rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.62);
`;
