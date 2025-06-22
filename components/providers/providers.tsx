"use client"

import { AuthProvider } from "./auth-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export const Providers = ({children}:{children: React.ReactNode}) => {
    return <ThemeProvider  
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
                <QueryProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </QueryProvider>
        </ThemeProvider>
}