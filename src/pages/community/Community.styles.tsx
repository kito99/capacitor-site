import styled from "styled-components";

const CommunityStyles = styled.div`
  display: block;

  --h1-color: var(--c-carbon-100);

  #top {
    margin-block-start: 120px;
    margin-block-end: 101px;

    .heading-group {
      margin-block-end: 116px;
      text-align: center;
      max-width: 704px;
      margin-inline-start: auto;
      margin-inline-end: auto;

      .ui-heading {
        font-size: clamp(52px, 15.5vw, 64px);
      }
      .ui-paragraph {
        font-size: clamp(18px, 4.5vw, 20px);
      }
    }

    .cards {
      display: grid;
      column-gap: 64px;
      row-gap: 64px;
      grid-template-columns: repeat(3, minmax(100px, 340px));
      justify-content: space-between;

      @media screen and (max-width: $screen-xs) {
        grid-template-columns: none;
        grid-template-row: repeat(3, minmax(100px, 340px));
      }

      @media screen and (max-width: $screen-sm-max) {
        column-gap: 32px;
      }

      .card {
        overflow: hidden;

        .image-wrapper {
          overflow: hidden;
          border-radius: var(--radius-2);
          margin-block-end: 24px;
          max-width: 340px;

          img {
            width: 100%;
            transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
          }
        }

        &:hover,
        &:active,
        &:focus {
          img {
            transform: scale(1.05);
          }
        }
      }
    }
  }

  #websites {
    margin-block-end: 160px;

    .ui-grid {
      column-gap: 32px;
      row-gap: 64px;
    }
    .ui-col {
      img {
        margin-block-end: 27px;
      }

      .link::after {
        content: " ->";
        letter-spacing: 0;
        white-space: nowrap;
        color: var(--c-capacitor-blue);

        transition: opacity 0.2s ease-out;
      }
      .link:hover::after,
      .link:active::after {
        opacity: 0.7;
      }
    }
  }

  #newsletter {
    margin-block-end: 160px;
  }
`;

export default CommunityStyles;
