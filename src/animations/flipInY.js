import styled, { keyframes } from "styled-components";
import { flipInY } from "react-animations";
const zoomInAnimation = keyframes`${flipInY}`;
const FlipyDiv = styled.div`
  animation: 0.7s ${zoomInAnimation};
`;
export { FlipyDiv };
