import Html from '@kitajs/html';
import { Body } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginForm, RegisterForm } from '../components/forms';
import { Layout } from '../components/layout';
import { CreateUser } from '../features/user/model';
import { createUser } from '../features/user/service';

export async function get() {
  return (
    <Layout>
      <section>
        <RegisterForm />
      </section>
    </Layout>
  );
}

export async function post(
  { log }: FastifyRequest,
  reply: FastifyReply,
  prisma: PrismaClient,
  body: Body<CreateUser>
) {
  const [error, user] = await createUser(prisma, body);

  if (user) {
    return <LoginForm next="/" defaultEmail={user.email} />;
  }

  if (error.code === 'P2002') {
    return (
      <RegisterForm
        emailError="Email already registered."
        defaultName={body.name}
        defaultPassword={body.password}
      />
    );
  }

  log.error(error);
  reply.status(500); // Internal Server Error

  throw <RegisterForm nameError="Unknown error..." />;
}
