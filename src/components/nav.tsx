import Html from '@kitajs/html';
import { UserWithoutPassword } from '../db';

export function Nav({ user }: { user?: UserWithoutPassword }) {
  return (
    <nav>
      <ul>
        <li>
          <a href='/'>
            <strong>Keddit</strong>
          </a>
        </li>
      </ul>
      <ul>
        {user ? (
          <li>
            <div safe>Logged in as {user.name}</div>{' '}
          </li>
        ) : (
          <>
            <li>
              <a href='/login'>Login</a>
            </li>
            <li>
              <a href='/register'>Register</a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
