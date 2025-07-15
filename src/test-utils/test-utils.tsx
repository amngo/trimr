import React, { ReactElement } from 'react';
import {
    render,
    RenderOptions,
    RenderResult,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock providers for isolated testing
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });

interface AllProvidersProps {
    children: React.ReactNode;
    queryClient?: QueryClient;
}

function AllProviders({
    children,
    queryClient = createTestQueryClient(),
}: AllProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    queryClient?: QueryClient;
}

function customRender(
    ui: ReactElement,
    options: CustomRenderOptions = {},
): RenderResult & { queryClient: QueryClient } {
    const { queryClient = createTestQueryClient(), ...renderOptions } = options;

    const result = render(ui, {
        wrapper: ({ children }) => (
            <AllProviders queryClient={queryClient}>{children}</AllProviders>
        ),
        ...renderOptions,
    });

    return {
        ...result,
        queryClient,
    };
}

export * from '@testing-library/react';
export { customRender as render };
export { createTestQueryClient };
export { screen, fireEvent, waitFor };
