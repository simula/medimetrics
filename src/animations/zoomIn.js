import styled, { keyframes } from "styled-components";
import { zoomIn } from "react-animations";
const zoomInAnimation = keyframes`${zoomIn}`;
const ZoomyDiv = styled.div`
  animation: 0.5s ${zoomInAnimation};
`;
export { ZoomyDiv };
