// Mock better-auth
export const authClient = {
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    getSession: jest.fn(),
};

export const useSession = jest.fn(() => ({ data: null, isPending: false }));

export default authClient;
