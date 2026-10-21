import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

const FieldContext = createContext<{
  id: string;
  hintId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
} | null>(null);

export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  children,
  className = "",
}: {
  id?: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const generated = useId();
  const controlId = id ?? `field-${generated}`;
  const hintId = hint ? `${controlId}-hint` : undefined,
    errorId = error ? `${controlId}-error` : undefined;
  return (
    <FieldContext.Provider
      value={{
        id: controlId,
        hintId,
        errorId,
        invalid: Boolean(error),
        required,
      }}
    >
      <div className={`ui-field ${className}`}>
        <label htmlFor={controlId} className="ui-field__label">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        {hint && (
          <p id={hintId} className="ui-field__hint">
            {hint}
          </p>
        )}
        {children}
        {error && (
          <p id={errorId} className="ui-field__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

function useFieldControl(props: {
  id?: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: ComponentPropsWithRef<"input">["aria-invalid"];
}) {
  const field = useContext(FieldContext);
  return {
    id: field?.id ?? props.id,
    required: props.required ?? field?.required,
    "aria-describedby":
      [props["aria-describedby"], field?.hintId, field?.errorId]
        .filter(Boolean)
        .join(" ") || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
  };
}

export function Input({
  className = "",
  ...props
}: ComponentPropsWithRef<"input">) {
  const a11y = useFieldControl(props);
  return <input {...props} {...a11y} className={`ui-input ${className}`} />;
}
export function Textarea({
  className = "",
  ...props
}: ComponentPropsWithRef<"textarea">) {
  const a11y = useFieldControl(props);
  return (
    <textarea
      {...props}
      {...a11y}
      className={`ui-input ui-textarea ${className}`}
    />
  );
}
export function Select({
  className = "",
  ...props
}: ComponentPropsWithRef<"select">) {
  const a11y = useFieldControl(props);
  return (
    <select
      {...props}
      {...a11y}
      className={`ui-input ui-select ${className}`}
    />
  );
}
