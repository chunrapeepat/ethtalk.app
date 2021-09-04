import styled from "styled-components";

export const OutlineButton = styled.button`
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  color: black;
  padding: 5px 12px;
  border: 1px solid rgb(18, 18, 18);
  background: rgb(251, 251, 251);
`;

export const Button = styled.button`
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  color: #ddd;
  padding: 5px 12px;
  background-color: rgb(18, 18, 18);
  border: 1px solid transparent;

  ${props =>
    props.loading
      ? `
  background-color: rgb(50, 50, 50);
  cursor: wait;
  `
      : `
  &:hover {
    color: white;
  }
      `}
`;
