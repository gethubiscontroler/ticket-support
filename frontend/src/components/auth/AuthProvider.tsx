import { ReactNode, useEffect, useReducer } from "react";
import { AuthContextType, AuthState } from "../../types/auth";
import { tokenStorage } from "../../utils/tokenStorage";
import { apiService } from "../../api/services/apiService";
import { AuthContext, authReducer } from "../../context/auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const tokens = tokenStorage.getTokens();
        const user = tokenStorage.getUser();

        if (tokens && user) {
          // Verify token is still valid
          try {
            const currentUser = await apiService.getCurrentUser();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: currentUser, tokens },
            });
          } catch (error) {
            // Token invalid, clear storage
            tokenStorage.removeTokens();
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiService.login(email, password);
      const { user, tokens } = response;

      tokenStorage.setTokens(tokens);
      tokenStorage.setUser(user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
    }
  };

  const loginWithProvider = async (provider: string): Promise<void> => {
    const clientId = import.meta.env.VITE_OIDC_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_OIDC_REDIRECT_URI;
    const scope = import.meta.env.VITE_OIDC_SCOPE;
    
    const authUrl = `${import.meta.env.VITE_OIDC_ISSUER}/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri || '')}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${Math.random().toString(36)}`;

    window.location.href = authUrl;
  };

  const logout = async (): Promise<void> => {
    await apiService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const tokens = tokenStorage.getTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      // This will be handled by the API service interceptor
      await apiService.get('/auth/me');
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginWithProvider,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};