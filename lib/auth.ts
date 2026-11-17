import { loginSchema } from '@/schemas/admission/preadmission/masters';
import { getUserByEmail } from '@/server/user';
import NextAuth, { AuthError, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export class CustomAuthError extends AuthError {
    constructor(msg: string) {
        super();
        this.message = msg;
        this.stack = undefined;
    }
}

export const authConfig: NextAuthConfig = {
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in'
    },
    providers: [
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                try {
                    const { email, password } = await loginSchema.parseAsync(credentials);
                    const response = await getUserByEmail(email, password);

                    if (!response.success || !response.data) {
                        throw new CustomAuthError(response.message);
                    }

                    return response.data;
                } catch (error: any) {
                    throw new CustomAuthError(error.message);
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.mi_id = user.mi_id;
                token.name = user.name;
                token.email = user.email;
                token.token = user.token;
                token.role = user.role;
                token.roleId = user.roleId;
                token.designation = user.designation;
            }
            if (trigger === 'update' && session) {
                token = { ...token, ...session };
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                //@ts-ignore
                session = { ...session, ...token };
            }
            return session;
        }
    },
    cookies: {
        sessionToken: {
            name: 'ivrm-session-1.0',
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            }
        }
    }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
