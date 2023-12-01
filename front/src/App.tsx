import React, { createContext, useContext, useReducer }  from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { WelcomePage } from "./page/welcome/welcome";
import { SignupPage } from "../src/page/signup";
import { SigninPage } from "../src/page/signin";
import { SignupConfirmPage } from "../src/page/signup-confirm";
import { RecoveryPage } from "../src/page/recovery";
import { RecoveryConfirmPage } from "../src/page/recovery-confirm";
import { SettingsPage } from "../src/page/settings";
import { BalancePage } from "./page/balance";
import { TransactionPage } from "./page/transaction";
import { ReceivePage } from "./page/receive";
import { SendPage } from "./page/send";
import { NotificationsPage } from "./page/notifications"

//=========================================

const Error: React.FC = () => {
  return <div>Error</div>
}

//================================

type AuthContextType = {
  state: AuthState,
  dispatch: React.Dispatch<AuthAction>,
}

export const AuthContext = createContext<AuthContextType | null>(null);

//================================

const AuthRoute: React.FC<{children: React.ReactNode}> = ({children}) => {

  const auth = useContext(AuthContext);

  if (auth?.state.user?.isConfirm === true)  {
    return <Navigate to="/balance" replace />
  }

  return <>{children}</>;
}

//==================================

const PrivateRoute: React.FC<{children: React.ReactNode}> = ({children}) => {
  const auth = useContext(AuthContext);

  console.log("context from PrivateRoute", auth);

  if (auth?.state.user) {
    return <>{children}</>
  } else {
    return <Navigate to="/signin" replace />
  }
}

//==================================

export enum AUTH_ACTION_TYPE {
  LOGIN = "login",
  LOGOUT = "logout",
}

interface User {
  email: string,
  isConfirm: boolean,
  id: number,
}

type AuthState = {
  token: string | null,
  user: User | null,
}

type AuthAction = {
  type: AUTH_ACTION_TYPE.LOGIN,
  token: string,
  user: User,
} | {
  type: AUTH_ACTION_TYPE.LOGOUT,
}

const stateReducer: React.Reducer<AuthState, AuthAction> = (state: AuthState, action: AuthAction): AuthState => {

  switch (action.type) {
    case AUTH_ACTION_TYPE.LOGIN: 
      return { token: action.token, user: action.user };

    case AUTH_ACTION_TYPE.LOGOUT: 
      return { token: null, user: null };

    default: return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(stateReducer, { token: null, user: null });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route index 
            element={
              <AuthRoute>
                <WelcomePage />
              </AuthRoute>
            } 
          />

          <Route path="/signup" element = {
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
            }
          />

          <Route
            path="/signup-confirm"
            element={
              <PrivateRoute>
                <SignupConfirmPage />
              </PrivateRoute>
            }
          />

          <Route 
            path="/signin" 
            element={
              <AuthRoute>
                <SigninPage />
              </AuthRoute>
            }
          />

          <Route 
            path="/recovery"
            element={
              <AuthRoute>
                <RecoveryPage />
              </AuthRoute>
            }
          />

          <Route 
            path = "/recovery-confirm"
            element = {
              <AuthRoute>
                <RecoveryConfirmPage />
              </AuthRoute>
            }
          />

          <Route path="/balance"
            element = {
              <PrivateRoute>
                <BalancePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationsPage />
              </PrivateRoute>
            }
          />

          <Route 
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          <Route 
            path="/receive"
            element={
              <PrivateRoute>
                <ReceivePage/>
              </PrivateRoute>
            }
          />

          <Route 
            path="/send"
            element={
              <PrivateRoute>
                <SendPage />
              </PrivateRoute>
            }
          />

          <Route 
            path="/transaction/:transactionId"
            element={
              <PrivateRoute>
                <TransactionPage/>
              </PrivateRoute>
            }
          />

          <Route 
            path="*" Component={Error}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;
