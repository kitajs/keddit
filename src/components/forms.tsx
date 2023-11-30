import Html from '@kitajs/html';
import { UpdateUser } from '../features/user/model';
import { SimpleField } from './fields';

interface RegisterFormProps {
  nameError?: string;
  defaultName?: string;
  emailError?: string;
  defaultPassword?: string;
  passwordError?: string;
}

export function RegisterForm(props: RegisterFormProps) {
  return (
    <form method="post" hx-post="/register" hx-swap="outerHTML">
      <SimpleField
        id="email"
        required
        placeholder="Email address"
        autocomplete="email"
        type="email"
        error={props.emailError}
        subtitle="We'll never share your email with anyone else."
      />
      <SimpleField
        id="name"
        required
        placeholder="Username"
        autocomplete="name"
        type="text"
        minlength={3}
        error={props.nameError}
        defaultValue={props.defaultName}
      />
      <SimpleField
        id="password"
        required
        placeholder="Password"
        defaultValue={props.defaultPassword}
        type="password"
        error={props.passwordError}
        autocomplete="new-password"
        minlength={8}
      />
      <button type="submit">Register now</button>
    </form>
  );
}

interface LoginFormProps {
  next: string;
  emailError?: string;
  passwordError?: string;
  defaultEmail?: string;
}

export function LoginForm(props: LoginFormProps) {
  return (
    <form
      method="post"
      hx-post={`/login?next=${encodeURIComponent(props.next)}`}
      hx-swap="outerHTML"
    >
      <SimpleField
        id="email"
        autocomplete="email"
        required
        placeholder="Email address"
        type="email"
        defaultValue={props.defaultEmail}
        subtitle="We'll never share your email with anyone else."
        error={props.emailError}
      />
      <SimpleField
        id="password"
        autocomplete="current-password"
        required
        placeholder="Password"
        type="password"
        minlength={8}
        error={props.passwordError}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export interface UpdateUserForm {
  user: UpdateUser;
}

export function UpdateUserForm({ user }: UpdateUserForm) {
  return (
    <form hx-post="/profile" hx-swap="outerHTML">
      <SimpleField
        id="name"
        required
        placeholder="Username"
        autocomplete="name"
        type="text"
        defaultValue={user.name}
        minlength={3}
      />
      <SimpleField
        id="email"
        required
        autocomplete="email"
        placeholder="Email address"
        type="email"
        subtitle="We'll never share your email with anyone else."
        defaultValue={user.email}
      />
      <button type="submit">Update current user</button>
    </form>
  );
}
