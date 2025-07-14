// Mock auth-client
export const signIn = {
    email: jest.fn(),
    github: jest.fn(),
    google: jest.fn(),
};

export const signUp = {
    email: jest.fn(),
};

export const signOut = jest.fn();

export const useSession = jest.fn(() => ({
    data: null,
    isPending: false,
    error: null,
}));

export const authClient = {
    signIn,
    signUp,
    signOut,
    useSession,
};
