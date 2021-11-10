import clsx from "clsx";
import {
  ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styled from "styled-components";
import Breakpoints from "../ui/Breakpoints";

declare var window: any;

interface CustomHubspotFormProps extends React.HTMLAttributes<HTMLDivElement> {
  formId?: string;
  portalId?: string;
  goToWebinarKey?: string;
  ajax?: boolean;
  submitArrow?: boolean;
  submitText?: string;
  buttonPosition?: "start" | "center" | "end";
  onFormReady?: () => any;
}

const HubspotForm = (
  {
    formId,
    portalId = "3776657",
    goToWebinarKey,
    ajax = false,
    submitArrow = false,
    submitText,
    buttonPosition,
    onFormReady,
    ...props
  },
  ref
) => {
  const el = useRef<HTMLDivElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Need to trick hubspot to thinking jQuery is available
    window.jQuery =
      window.jQuery ||
      (() => ({
        // these are all methods required by HubSpot
        change: () => {},
        trigger: () => {},
      }));
  }, []);

  const getFormElementId = useCallback(() => `hbspt-form-${formId}`, [formId]);

  const handleScriptLoad = useCallback(() => {
    requestAnimationFrame(() => {
      window.hbspt.forms.create({
        portalId: "3776657",
        formId: formId,

        target: `#${getFormElementId()}`,
        goToWebinarWebinarKey: goToWebinarKey || "",
        css: "",
        onFormReady: handleFormReady,
        translations: {
          en: {
            submitText: submitText,
          },
        },
      });
    });
  }, [formId, goToWebinarKey]);

  const handleFormReady = useCallback((_e: any, _c: any) => {
    onFormReady && onFormReady();

    // Don't override the form if not using the ajax method
    if (!ajax) {
      return;
    }

    const formEl = el.current?.querySelector(
      `#${getFormElementId()} form`
    ) as HTMLFormElement;
    if (!formEl) {
      return;
    }

    formEl.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    formEl
      .querySelector('input[type="submit"]')
      ?.addEventListener("click", (e) => {
        submitForm(formEl);
        e.preventDefault();
      });
  }, []);

  const submitForm = useCallback(async (form: HTMLFormElement) => {
    const data = new FormData(form);

    try {
      const ret = await fetch(form.getAttribute("action")!, {
        method: "POST",
        body: data,
      });

      if (ret.status !== 200) {
        setError("Error submitting form");
      } else {
        // The response from hubspot is a script tag. I know, it's truly magnificent
        const frame = document.createElement("iframe");
        frame.srcdoc = await ret.text();
        document.body.appendChild(frame);
      }
    } catch (e) {
      setError("Unable to submit form");
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//js.hsforms.net/forms/v2.js";
    script.addEventListener("load", handleScriptLoad);
    scriptRef.current = script;
    document.body.appendChild(script);
    return () => {
      scriptRef.current?.parentNode?.removeChild(scriptRef.current);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("message", (e: MessageEvent<any>) => {
      if (e.data && e.data.formGuid && ajax) {
        // Don't let hubspot do anything
        e.preventDefault();
        e.stopImmediatePropagation();

        if (e.data.accepted === true) {
          // TODO: Probably emit a custom event on the ref for this element
          // this.formSubmitted?.emit();
        } else if (e.data.accepted === false) {
          setError(
            "Unable to submit. Please check your information and try again."
          );
        } else {
          setError("");
        }
      }
    });
  }, [ajax]);
  return (
    <HubspotFormStyles
      {...props}
      className={clsx({
        "hubspot-form": true,
        [props.className || ""]: true,
      })}
      ref={ref}
    >
      <div
        className={`
          hubspot-override
          ${submitArrow ? "submit-arrow" : ""}
          ${buttonPosition ? `button-position--${buttonPosition}` : ""}
        `}
      >
        <div id={getFormElementId()} />
      </div>
      {error ? <div className="hs-error-msgs">{error}</div> : null}
    </HubspotFormStyles>
  );
};

const HubspotFormStyles: any = styled.div`
  --c-label: var(--c-carbon-90);
  --arrow-size: 1em;

  max-width: 26.25rem;
  display: block;
  margin: 0 auto;
  font-weight: 400;

  .hs-form-required {
    display: none;
  }

  form {
    fieldset.form-columns-2 .input {
      margin-right: 12px;
    }

    &.stacked .field {
      margin-bottom: 4px;
    }
  }

  .hs-input,
  input.hs-input,
  select.hs-input {
    border: 1px solid #e1e5ed;
    // padding: 15px 5px 15px 18px;
    border-radius: 4px;
    transition: border-color 0.2s;
    box-shadow: none;
    outline: none;
    height: 30px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.428571429;

    &:placeholder {
      color: var(--c-carbon-60);
    }

    &:valid {
      // border-color: #B4BBC5;
    }

    &:hover,
    &:focus,
    &:active {
      outline: none;
      border-color: var(--c-ionic-brand);
      box-shadow: none;
    }

    &.hs-input.error {
      border-color: var(--c-red-60);
    }
  }

  select.hs-input {
    height: 44px;
    width: 100% !important;
  }

  textarea.hs-input {
    padding: 12px;
    width: 100% !important;
    min-height: 192px;
    font-family: var(--f-family-text);
    color: var(--c-carbon-90);
  }

  .hs_submit input.hs-button {
    display: block;
    margin: auto;
    cursor: pointer;
    font-size: 13px;
    padding: 10px 18px 10px;
    margin-right: -14px;
    margin-top: -36px;
    margin-left: auto;
    margin-right: auto;
    line-height: 23px;
    float: right;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    text-shadow: none;
    background: var(--c-ionic-brand);
    border: 0;
    outline: 0;
    transition: all 0.2s linear;

    &:hover {
      border: 0;
      background: #5995fc;
      color: #fff;
      outline: 0;
    }

    &:active,
    &:active:not(.inactive):not(.link),
    &:focus:not(.inactive) {
      border: 0;
      color: #fff;
      box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.2);
      background: #5995fc;
      outline: 0;
    }
  }

  .submitted-message {
    &:before {
      content: "";
      display: block;
      background-image: url("/img/checkmark-light-green.svg");
      background-repeat: no-repeat;
      background-size: 100%;
      width: 42px;
      height: 42px;
      margin-bottom: 12px;
    }

    font-size: 18px;
    padding: 34px 0 78px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 400;
    color: #35af55;
    max-width: 25.625rem;
    background-color: white;
    margin: 0 auto;
  }

  .hubspot-override .hs-form {
    .input {
      margin: 0 !important;
    }

    font-family: var(--f-family-system);
    // TODO these styles are only used on contributors landing,
    // need to be applied to all hubspot forms

    &,
    & fieldset,
    & iframe {
      max-width: 100%;
    }

    // fieldset + fieldset,
    // form.stacked .hs-form-field + .hs-form-field,
    // fieldset .hs-form-field + .hs-form-field,
    // form.stacked .hs-form-field + .hs-dependent-field {
    //   margin-top: 26px;
    // }
    .hs-form-field {
      margin-top: 16px;
    }

    label {
      display: block;
      font-family: var(--f-family-text);
      margin-bottom: 8px;
      color: var(--c-label);
      font-weight: 500;
      font-size: 14px;
      line-height: 112%;
      letter-spacing: -0.02em;
    }

    .hs-richtext {
      margin-top: 8px;
    }

    .hs-input,
    input.hs-input {
      height: 56px;
      transition: border 0.3s;
      background-color: #fff;
      background-image: none;
      border: 1px solid #ced6e0;
      line-height: 1.12;
      border-radius: 8px;
      padding: 17px 16px;
      font-size: 16px;
      margin-bottom: 0;
      color: var(--c-carbon-90);
      letter-spacing: -0.01em;
    }

    input.hs-input[type="number"] {
      float: none;
    }

    input.hs-input[type="text"],
    input.hs-input[type="email"],
    input.hs-input[type="tel"] {
      width: 100% !important;
      float: none;

      &:focus {
        border-color: #629eff;
      }
    }

    input.hs-input[type="radio"],
    input.hs-input[type="checkbox"] {
      height: auto;
      margin-right: 8px;
    }

    .hs-form-booleancheckbox-display {
      display: flex;
    }

    select.hs-input {
      height: 54px;
      padding-left: 16px;
      padding-inline-end: 48px;
      position: relative;

      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;

      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNTEyJyB2aWV3Qm94PScwIDAgNTEyIDUxMic+PHBvbHlsaW5lIHBvaW50cz0nMTEyIDE4NCAyNTYgMzI4IDQwMCAxODQnIHN0eWxlPSdmaWxsOm5vbmU7c3Ryb2tlOiM0NDVCNzg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDo0OHB4Jy8+PC9zdmc+");
      background-size: 1.2em;
      background-position: calc(100% - 0.9em) center;
      background-repeat: no-repeat;

      &:active {
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNTEyJyB2aWV3Qm94PScwIDAgNTEyIDUxMic+PHRpdGxlPmlvbmljb25zLXY1LWE8L3RpdGxlPjxwb2x5bGluZSBwb2ludHM9JzExMiAzMjggMjU2IDE4NCA0MDAgMzI4JyBzdHlsZT0nZmlsbDpub25lO3N0cm9rZTojNDQ1Qjc4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6NDhweCcvPjwvc3ZnPg==");
      }

      &:hover {
        cursor: pointer;
      }
    }
    fieldset:first-of-type .hs-form-field {
      margin-block-start: 0px;
    }

    fieldset.form-columns-2 .input {
      margin: 0;
    }

    fieldset.form-columns-2 .hs-form-field {
      padding: 0 10px;

      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        padding-right: 0;
      }
    }

    .inputs-list,
    .hs-error-msgs {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    .inputs-list.multi-container {
      overflow: hidden;

      li:nth-last-child(n + 6):first-child,
      li:nth-last-child(n + 6):first-child ~ li {
        width: 50%;
        float: left;
        padding-right: 11px;
      }
      li:nth-last-child(n + 6):first-child ~ li:nth-child(even) {
        padding-right: 0;
        padding-left: 11px;
      }
    }

    .hs-form-checkbox-display {
      margin-top: 4px;
      display: flex;
    }

    .hs-form-checkbox-display .hs-input[type="checkbox"] {
      margin-right: 10px;
    }

    .hs-form-checkbox-display span {
      font-size: 15px;
      color: #505863;
    }

    .hs-error-msg {
      margin: 10px 0;
      display: inline-block;
      padding: 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--c-red-100);
    }

    .hs_submit {
      margin-top: 30px;
    }

    .hs_submit input.hs-button {
      transition: all 0.3s ease-out;
      margin: 0;
      float: none;
      margin: auto;
      font-family: var(--f-family-text);
      font-size: 16px;
      font-weight: 600;
      padding: 19px 20px;
      vertical-align: middle;
      color: white;
      background: var(--c-blue-80);
      border-radius: 1000px;
      line-height: 112%;
      letter-spacing: -0.02em;

      &:hover {
        background: var(--c-blue-70);
        color: #fff;
        outline: none;
      }
    }

    legend.hs-field-desc {
      font-family: var(--f-family-text);
      font-size: 0.875rem;
      line-height: 1.2;

      margin-block-end: 1.25rem;

      a {
        color: var(--c-blue-80);

        transition: opacity 0.2s ease-out;

        &:hover,
        &:focus {
          opacity: 0.7;
        }
      }
    }

    @media (max-width: ${Breakpoints.screenMdMax}) {
      fieldset.form-columns-2 .hs-form-field {
        width: 100%;
        float: none;
        padding: 0;

        & + .hs-form-field {
          margin-top: 24px;
        }
      }
      .inputs-list.multi-container {
        li:nth-last-child(n + 6):first-child,
        li:nth-last-child(n + 6):first-child ~ li {
          width: 100%;
          float: none;
          padding-right: 0;
        }
        li:nth-last-child(n + 6):first-child ~ li:nth-child(even) {
          padding-left: 0;
        }
      }
      .hs_submit input.hs-button {
        width: 100%;
      }
    }
  }

  .hubspot-override.submit-arrow .hs-form {
    .hs_submit input.hs-button {
      padding: 19px 20px;
      padding-inline-end: calc(var(--arrow-size) + 24px);
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1MTInIGhlaWdodD0nNTEyJyB2aWV3Qm94PScwIDAgNTEyIDUxMic+PHBvbHlsaW5lIHBvaW50cz0nMjY4IDExMiA0MTIgMjU2IDI2OCA0MDAnIHN0eWxlPSdmaWxsOm5vbmU7c3Ryb2tlOiNmZmY7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo0OHB4Jy8+PGxpbmUgeDE9JzM5MicgeTE9JzI1NicgeDI9JzEwMCcgeTI9JzI1Nicgc3R5bGU9J2ZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjQ4cHgnLz48L3N2Zz4=");
      background-size: var(--arrow-size);
      background-position: calc(100% - 20px) center;
      background-repeat: no-repeat;
    }
  }

  .hubspot-override.button-position--start .hs-form {
    .hs_submit input.hs-button {
      float: left;
    }
  }
  .hubspot-override.button-position--end .hs-form {
    .hs_submit input.hs-button {
      float: right;
    }
  }
  .hubspot-override.button-position--center .hs-form {
    .hs_submit input.hs-button {
      margin-inline-start: auto;
      margin-inline-end: auto;
    }
  }

  .hubspot-override--large .hs-form {
    label:not(.hs-form-booleancheckbox-display) {
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .hs-form-booleancheckbox-display {
      font-size: 15px;
    }

    .hs-richtext {
      p span,
      p a {
        font-size: 15px;
      }
    }

    .hs-input,
    input.hs-input {
      padding: 16px 20px 18px;
      font-size: 18px;
    }

    select.hs-input {
      text-indent: 10px;
      height: 60px;
    }
    @-moz-document url-prefix() {
      select.hs-input {
        text-indent: 0;
      }
    }

    .hs-error-msgs label {
      font-size: 11px;
      letter-spacing: 0;
      text-transform: none;
    }

    fieldset.form-columns-2 .hs-form-field {
      padding: 0 20px;
    }

    .hs_submit {
      text-align: center;
      padding-top: 18px;
    }

    .hs_submit input.hs-button {
      padding: 22px 27px 24px;
      border-radius: 6px;
    }

    @media (max-width: ${Breakpoints.screenMdMin}) {
      fieldset.form-columns-2 .hs-form-field {
        padding: 0;
      }
    }
  }

  .hubspot-override--measure {
    max-width: 46.75rem;
    margin-left: auto;
    margin-right: auto;
  }
`;

export default forwardRef<HTMLDivElement, CustomHubspotFormProps>(
  HubspotForm
) as typeof HubspotForm;
