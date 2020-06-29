import { createContext, useContext } from 'react';

export const AuthenticationContext = createContext();

export function useAuthentication()
{
    return useContext(AuthenticationContext);
}