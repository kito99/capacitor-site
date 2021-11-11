import styled from 'styled-components';

const DocsDropdownStyles = styled.div`
  &.Dropdown {
    display: inline-block;
    position: relative;
    z-index: 1;
    outline: none;
  }

  .Dropdown-button {
    appearance: none;
    background: none;
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    padding: initial;
    white-space: nowrap;
  }

  .Dropdown-button .Dropdown-icon {
    height: 14px;
    width: 22px;
    fill: #ced6e0;
  }

  .Dropdown-button .Dropdown-icon + .Dropdown-arrow {
    margin-left: 0px;
    fill: #ced6e0;
    vertical-align: 2px;
  }
  .Dropdown:focus,
  .Dropdown-button:focus {
    outline: none;
  }

  .Dropdown-button:hover {
    cursor: pointer;
  }

  .Dropdown-arrow {
    fill: currentColor;
    height: 0.8em;
    margin-bottom: -0.0875em;
    width: 0.8em;
    margin-left: 0.8em;
  }

  &.Dropdown.is-open .Dropdown-arrow {
    transform: rotate(180deg);
  }

  .Dropdown-panel {
    background-color: var(--color-white);
    border-radius: 6px;
    border: none;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
    display: none;
    min-width: 100%;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    top: 100%;
    visibility: hidden;
  }

  &.Dropdown.is-open .Dropdown-panel {
    display: initial;
    pointer-events: auto;
    visibility: visible;
  }

  &.Dropdown--left .Dropdown-panel {
    left: 0;
  }

  &.Dropdown--right .Dropdown-panel {
    right: 0;
  }

  &.Dropdown--center .Dropdown-panel {
    left: 50%;
    transform: translateX(-50%);
  }

  .Dropdown-panel a {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 1em;
  }

  &.Dropdown-panel svg {
    height: 1em;
    width: 1em;
    margin-left: 4px;
  }

  @media (hover: hover) {
    .Dropdown-panel a:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
  }

  .Dropdown-panel > section {
    padding: 0.5em 0;
  }

  .Dropdown-panel > section:not(:last-child) {
    border-bottom: solid 1px var(--line-rule-color);
  }

  &.Dropdown {
    align-self: center;
    color: var(--c-indigo-80);
  }

  .Dropdown-button {
    color: var(--c-indigo-80);
    padding: 10px;
    transition: border-color 100ms ease;
  }

  &.Dropdown.is-open .Dropdown-button {
    border-color: var(--line-rule-color);
  }

  .Dropdown-panel {
    min-width: 180px;
  }

  .Dropdown-panel a {
    display: flex;
    justify-content: space-between;
    color: var(--c-indigo-80);
  }

  .Dropdown-panel svg {
    height: 1em;
    width: 1em;
  }

  .Dropdown-panel .Nav-link {
    margin-left: 0;
    margin-right: 0;
  }
`;

export default DocsDropdownStyles;
