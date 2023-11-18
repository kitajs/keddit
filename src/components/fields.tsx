import { Html } from '@kitajs/html';

export interface FieldProps extends JSX.HtmlInputTag {
  value?: string;
  id: string;
  small?: string;
  of?: 'input' | 'textarea';
}

export function SimpleField({ of = 'input', value, id, small, ...props }: FieldProps) {
  return (
    <div>
      <label for={id} safe>
        {props.placeholder || id}
      </label>
      <tag
        {...props}
        of={of}
        type={props.type || 'text'}
        id={id}
        name={id}
        required
        value={value}
      />
      {!!small && <small safe>{small}</small>}
    </div>
  );
}
