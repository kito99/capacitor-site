import styled from "styled-components";

const SiteFooterStyles = styled.div`
  display: block;
  border-block-start: 1px solid var(--c-indigo-20);
  padding-block-start: 64px;
  padding-block-end: 72px;
  position: relative;

  background: #fff;
  border-block-start: 1px solid var(--c-indigo-20);

  ul {
    padding: 0;
  }

  .newsletter {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-block-end: 4rem;
    margin-block-start: -1rem;

    @media (max-width: $screen-xs-max) {
      margin-block-end: 2rem;
    }

    --h4-color: var(--c-carbon-100);
    --p4-color: var(--c-indigo-70);

    > * {
      margin-block-start: 16px;
    }
  }

  .routes-group {
    display: flex;
    justify-content: space-between;
  }

  a.link {
    color: var(--c-indigo-70);
    font-weight: normal;
  }

  .copyright {
    p {
      font-family: "Inter";
      color: var(--c-indigo-70);
      font-size: 14px;
      letter-spacing: -0.02em;
      line-height: 1.6em;
      margin: 0;
    }
  }

  img.logo {
    width: 106px;
    margin-bottom: 7px;
  }

  .ui-heading {
    color: var(--c-carbon-80);
    margin-bottom: 11px;
  }

  .routes {
    li {
      list-style-type: none;
      margin-top: 7px;
      letter-spacing: 0;
    }
  }

  .form-group {
    flex-basis: 479px;
  }

  form.hs-form {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    position: relative;
    margin-block-start: -16px;

    > * {
      margin-block-start: 16px;
    }

    li {
      list-style-type: none;
    }

    .hs-email {
      flex-grow: 1;
      max-width: 276px;

      label {
        position: absolute;
        opacity: 0;
      }
    }

    .input {
      width: 100%;
      position: relative;

      input {
        padding-inline-start: 16px;
        width: calc(100% - 12px);
        height: 48px;
        border: 1px solid #dee3ea;
        border-radius: var(--radius-2);

        transition: border 0.2s ease-out, box-shadow 0.2s ease-out;

        &::placeholder {
          color: #6d6c82;
          opacity: 0.4;
        }

        &:focus {
          outline: 1px solid rgba(0, 0, 0, 0);
          border: 1px solid #3880ff;
          box-shadow: 0px 0px 0px 3px #c2d8ff;
        }
      }
    }

    .hs-submit {
      input {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        height: 48px;
        border: none;
        background: var(--c-capacitor-blue);
        color: #fff;
        border-radius: var(--radius-2);

        font-family: var(--f-family-text);
        letter-spacing: -0.02em;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;

        margin-block-start: 0;
        margin-block-end: 0;

        padding: 15px 18px 16px 18px;
        transition: box-shadow 0.2s ease-out, background-color 0.2s ease-out;

        &:hover {
          background: #24a7ff;
          box-shadow: none;
        }
        &:active {
          background: #0090f0;
        }
        &:focus {
          outline: 1px solid rgba(0, 0, 0, 0);
          box-shadow: 0px 0px 0px 3px #c2d8ff;
        }
      }
    }

    .hs_error_rollup {
      position: absolute;
      top: 100%;
      left: 12px;
      font-size: 14px;
      color: var(--c-red-100);
      margin-block-start: 4px;
    }
  }
`;

export default SiteFooterStyles;
