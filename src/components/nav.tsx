import Html from '@kitajs/html';
import { User } from '@prisma/client';

export interface NavProps {
  user?: Pick<User, 'name'>;
}

export function Nav({ user }: NavProps) {
  return (
    <nav>
      <ul>
        <li>
          <a
            href="https://kita.js.org"
            class="contrast"
            target="_blank"
            title="Powered by kita.js.org"
          >
            <img src="https://kita.js.org/logo.svg" width="64" />
          </a>
        </li>

        <li>
          <a href="/" class="contrast">
            <h1 style={{ marginBottom: 0 }}>Keddit</h1>
          </a>
        </li>
      </ul>

      <ul>
        {user ? (
          <>
            <li>
              <a href="/profile" class="contrast" safe>
                {user.name}
              </a>
            </li>
            <li>
              <a href="/logout">Logout</a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/register">Register</a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
