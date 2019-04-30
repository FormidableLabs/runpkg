import reducerFn from './reducerFn.js';
import { html, css } from 'https://unpkg.com/rplus';

const styles = css`/components/component.css`;

const ProjectBadge = ({ color, abbreviation, description, number }) => {
  const descriptionArr = description.split(' ').reduce(reducerFn, []);
  const descriptionText = descriptionArr.map(
    (word, idx, array) =>
      html`
        <text
          key=${word}
          x="39%"
          y=${`${array.length === 1 ? '66' : 65 + idx * 6}%`}
          fontFamily="Arial"
          fontWeight="Bold"
          fontSize=${`${array.length === 1 ? '24' : '18'}`}
          letterSpacing=${1.8}
          fill="#1D1E1F"
          textAnchor="middle"
        >
          ${word.toUpperCase()}
        </text>
      `
  );

  return html`
    <div className=${styles}>
      <svg viewBox="0 0 380 374" className="Svg">
        <defs>
          <filter
            x="-25.7%"
            y="-25.2%"
            width="151.3%"
            height="150.3%"
            filterUnits="objectBoundingBox"
            id="Badge_Copy_svg__a"
          >
            <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
            <feGaussianBlur
              stdDeviation=${20}
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
              in="shadowBlurOuter1"
              result="shadowMatrixOuter1"
            />
            <feMerge>
              <feMergeNode in="shadowMatrixOuter1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g
          filter="url(#Badge_Copy_svg__a)"
          transform="translate(40 34)"
          x="0"
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M170.918 9.364l97.823 43.419a52 52 0 0 1 30.904 47.528V205.69a52 52 0 0 1-30.904 47.528l-97.823 43.42a52 52 0 0 1-42.192 0l-97.822-43.42A52 52 0 0 1 0 205.689V100.31a52 52 0 0 1 30.904-47.528l97.822-43.42a52 52 0 0 1 42.192 0z"
            fill="#202020"
          />
          <path
            d="M7 220h286c-4.967 18.355-52.765 44.09-143.393 77.203C57.192 265.586 9.657 239.852 7 220z"
            fill=${color}
          />
          <path
            d="M149.822 39.175L45.223 85.501A15.5 15.5 0 0 0 36 99.673v106.543a15.5 15.5 0 0 0 9.314 14.212l104.508 45.485 104.508-45.485a15.5 15.5 0 0 0 9.315-14.212V99.673a15.5 15.5 0 0 0-9.223-14.172l-104.6-46.326zm0-13.124l109.476 48.401c9.717 4.378 16.347 14.34 16.347 25.221v106.543a27.5 27.5 0 0 1-16.526 25.215L149.822 279 40.526 231.431A27.5 27.5 0 0 1 24 206.216V99.673c0-10.88 6.826-21.025 16.364-25.22L149.822 26.05z"
            fill=${color}
            fillRule="nonzero"
            opacity=${0.4}
            className="InnerRing"
          />
          <path
            d="M149.822 26.118L40.691 74.3A28 28 0 0 0 24 99.914v106.172A28 28 0 0 0 40.691 231.7l109.131 48.182L258.954 231.7a28 28 0 0 0 16.69-25.614V99.914a28 28 0 0 0-16.69-25.614L149.822 26.118zM149.988 13l113.657 50.643c14.493 6.399 24 20.428 24 36.271v106.172a40 40 0 0 1-23.844 36.592L149.822 293 35.844 242.678A40 40 0 0 1 12 206.086V99.914c0-15.843 9.66-29.91 23.844-36.23L149.988 13z"
            fill=${color}
            fillRule="nonzero"
            opacity=${0.7}
            className="MiddleRing"
          />
          <path
            d="M166.05 20.332a40 40 0 0 0-32.455 0l-97.823 43.42A40 40 0 0 0 12 100.311v105.377a40 40 0 0 0 23.772 36.56l97.823 43.42a40 40 0 0 0 32.455 0l97.822-43.42a40 40 0 0 0 23.773-36.56V100.31a40 40 0 0 0-23.773-36.56l-97.822-43.42zm4.868-10.968l97.823 43.419a52 52 0 0 1 30.904 47.528V205.69a52 52 0 0 1-30.904 47.528l-97.823 43.42a52 52 0 0 1-42.192 0l-97.822-43.42A52 52 0 0 1 0 205.689V100.31a52 52 0 0 1 30.904-47.528l97.822-43.42a52 52 0 0 1 42.192 0z"
            fill=${color}
            fillRule="nonzero"
          />
          <text
            fill=${color}
            fontFamily="Orbitron"
            fontSize=${140}
            x="39%"
            y="52%"
            textAnchor="middle"
            letterSpacing="{-9}"
          >
            ${abbreviation}
          </text>
          <path
            d="M150.175 9l35.21 18.827c-4.524 15.062-18.576 26.044-35.21 26.044-16.556 0-30.554-10.878-35.146-25.831L150.175 9z"
            fill=${color}
          />
          <text
            fontFamily="Arial"
            fontWeight="Bold"
            fill="#1D1E1F"
            fontSize="24px"
            letterSpacing=${0.138}
            textAnchor="middle"
            x="39.5%"
            y="10%"
          >
            ${number}
          </text>
          ${descriptionText}
        </g>
      </svg>
    </div>
  `;
};

export default ProjectBadge;
