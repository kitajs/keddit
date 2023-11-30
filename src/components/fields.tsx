import { Html } from '@kitajs/html';

export interface FieldProps extends JSX.HtmlInputTag {
  id: string;
  subtitle?: string;
  defaultValue?: string;
  inputType?: 'input' | 'textarea';
  error?: string;
}

/** Simple field with a label, input and small text. */
export function SimpleField(props: FieldProps) {
  // If there is an error, show it as the subtitle.
  if (props.error) {
    props.subtitle = props.error;
  }

  return (
    <div>
      <label for={props.id} safe>
        {props.placeholder || props.id}
      </label>

      <tag
        {...props}
        of={props.inputType || 'input'}
        type={props.type || 'text'}
        id={props.id}
        name={props.id}
        value={props.defaultValue}
      />

      {props.subtitle && (
        <small style={{ color: props.error ? 'crimson' : undefined }} safe>
          {props.subtitle}
        </small>
      )}
    </div>
  );
}
