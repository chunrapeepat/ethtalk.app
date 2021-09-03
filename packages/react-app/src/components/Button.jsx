import styled from "styled-components";

const Button = styled.button`
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  color: #ddd;
  padding: 5px 12px;
  background-color: rgb(18, 18, 18);

  ${props =>
    props.loading
      ? `
  background-color: rgb(50, 50, 50);
  cursor: not-allowed;
  `
      : `
  &:hover {
    color: white;
  }
      `}
`;

export default Button;
