import Html from '@kitajs/html';
import { UpdateUser } from '../features/user/model';
import { SimpleField } from './fields';

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
        autocomplete="username"
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
