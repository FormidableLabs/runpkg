import styled, { keyframes, createGlobalStyle } from "styled-components";

import AlphavilleMedium from "../fonts/Alphaville Medium.woff";
import AkkuratBold from "../fonts/Akkurat Bold.woff";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "AlphaVille Medium";
    src: url(${AlphavilleMedium});
  }
  
  @font-face {
    font-family: "Akkurat Bold";
    src: url(${AkkuratBold});
  }
`;

export const MiddleRing = styled.path``;
export const InnerRing = styled.path``;

const innerKF = keyframes`
 
`;

@keyframes innerKf {
    0% {
        opacity: 0.4;
      }
      60% {
        opacity: 0.1;
      }
      75% {
        opacity: 0.1;
      }
      85% {
        opacity: 0.5;
      }
      100% {
        opacity: 0.4;
      }
}

@keyframes middleKF {
    0% {
        opacity: 0.7;
      }
      60% {
        opacity: 0.4;
      }
      75% {
        opacity: 0.4;
      }
      85% {
        opacity: 0.8;
      }
      100% {
        opacity: 0.7;
      }  
}

const middleKF = keyframes`
  0% {
    opacity: 0.7;
  }
  60% {
    opacity: 0.4;
  }
  75% {
    opacity: 0.4;
  }
  85% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.7;
  }
`;

export const Svg = styled.svg`
  &:hover ${MiddleRing} {
    animation: ${middleKF} 1s;
  }
  &:hover ${InnerRing} {
    animation: ${innerKF} 1s;
  }
`;