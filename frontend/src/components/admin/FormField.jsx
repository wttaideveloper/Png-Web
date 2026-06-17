export default function FormField({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}) {
  return (
    <div className={`admin-form-field ${className}`.trim()}>
      <label className="admin-form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {hint ? <p className="admin-form-hint">{hint}</p> : null}
      {children}
    </div>
  );
}
