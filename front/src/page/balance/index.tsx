import "./index.scss";

import React, { lazy, Fragment, Suspense, useContext, useReducer, useCallback, useEffect  } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../App";

import { HeaderButton } from "../../component/header-button";
import { Alert, Loader, LoaderTop, Skeleton } from "../../component/load";

import { getDate } from "../../container/util/getDate";
import { splitNumber } from "../../container/util/splitNumber";

const ListItem = lazy(() => import("../../component/list-item"));

export enum REQUEST_ACTION_TYPE {
  PROGRESS = "progress",
  SUCCESS = "success",
  ERROR = "error",
};

type Action = {
  type: REQUEST_ACTION_TYPE,
  payload?: any,
}

type State = {
  status: REQUEST_ACTION_TYPE | null,
  message?: string | null,
  data?: any | null,
}

export const requestInitialState = {
  status: null,
  message: null,
  data: null,
};

export const requestReducer  = (state: State, action: Action) => {
  switch (action.type) {
    case REQUEST_ACTION_TYPE.PROGRESS:
      return {
        ...state,
        status: action.type,
      };

    case REQUEST_ACTION_TYPE.SUCCESS:
      console.log("success from requestReducer")
      return {
        ...state,
        status: action.type,
        data: action.payload,
      };

    case REQUEST_ACTION_TYPE.ERROR:
      return { 
        ...state,
        status: action.type,
        message: action.payload
    };

    default:
      return { ...state };
  }
};

export const BalancePage: React.FC = () => {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const auth=useContext(AuthContext);

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
  
    try {
      const res = await fetch(`http://localhost:4000/balance?id=${auth?.state.user?.id}`);
  
      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(data),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: data.message,
        });
      }
    } catch (error: any) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: error.message,
      });
    }
  }, [auth?.state.user?.id]);
  
  const convertData = (raw: any) => {
    return {
      list: raw.list.map((item: any) => ({
        ...item,
        date: getDate(item.date),
        alt: item.type === 'Sending' ? "User" : item.name,
        image: item.paymentSystemId === null ? "user" : item.name.toLowerCase(),
      })),
      balance: {...splitNumber(Number(raw.balance))},
      isEmpty: raw.list.length === 0,
      message: raw.message,
  }};
  
  useEffect(() => {
    getData();
  }, []);

  return (      
    <div className="page page-balance text--light">
    
      { state.status === REQUEST_ACTION_TYPE.PROGRESS && 
        <Fragment>
          <LoaderTop />
          <div className="border-balance">
            <div className="header-balance">
              <Loader />
              <div className="header-balance__top">
                <Link to="/settings">
                  <button>
                    <img className="header__icon" src="/svg/settings.svg" alt="Icon"></img>
                  </button>
                </Link>
                <span className="top__text">Main wallet</span>
                <Link to="/notifications">
                  <button>
                    <img className="header__icon" src="/svg/notifications.svg" alt="Ring icon"></img>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="header__actions">
                <HeaderButton link="/receive" image="/svg/receive.svg" label="Receive" alt="Receive" />

                <HeaderButton link="/send" image="/svg/send.svg" label="Send" alt="Send" />
          </div>
        </Fragment>
      }

      { state.status === REQUEST_ACTION_TYPE.ERROR && (
          <Fragment>
            <div className="border-balance">
              <div className="header-balance">
                <div className="header-balance__top">
                  <Link to="/settings">
                    <button>
                      <img className="header__icon" src="/svg/settings.svg" alt="Icon"></img>
                    </button>
                  </Link>
                  <span className="top__text">Main wallet</span>
                  <Link to="/notifications">
                    <button>
                      <img className="header__icon" src="/svg/notifications.svg" alt="Ring icon"></img>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <Alert status={state.status} message={state.message} />
          </Fragment>
        )
      }

      { state.status === REQUEST_ACTION_TYPE.SUCCESS && 
        (
          <Fragment>
            {state.data.isEmpty ? 
              (
                <Fragment>
                  <div className="border-balance">  
                    <div className="header-balance">
                      <div className="header-balance__top">
                        <Link to="/settings">
                          <button>
                            <img className="header__icon" src="/svg/settings.svg" alt="Icon"></img>
                          </button>
                        </Link>
                        <span className="top__text">Main wallet</span>
                        <Link to="/notifications">
                          <button>
                            <img className="header__icon" src="/svg/notifications.svg" alt="Ring icon"></img>
                          </button>
                        </Link>
                      </div>

                      <div className="main-info">
                        <span>$</span>
                        <span>0<span className="text--light">.00</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="header__actions">
                    <HeaderButton link="/receive" image="/svg/receive.svg" label="Receive" alt="Receive" />

                    <HeaderButton link="/send" image="/svg/send.svg" label="Send" alt="Send" />
                  </div>

                  <div className="transaction-list">
                    <div className="transaction-list__content">
                      <Alert message="No transactions yet" status="default" />
                    </div>
                  </div>
                </Fragment>
              )
            
              : (
                <Fragment>
                  <div className="border-balance">
                    <div className="header-balance">
                      <div className="header-balance__top">
                      <Link to="/settings">
                          <button>
                            <img className="header__icon" src="/svg/settings.svg" alt="Icon"></img>
                          </button>
                        </Link>
                        <span className="top__text">Main wallet</span>
                        <Link to="/notifications">
                          <button>
                            <img className="header__icon" src="/svg/notifications.svg" alt="Ring icon"></img>
                          </button>
                        </Link>
                      </div>

                      <div className="main-info">
                        <span>{state.data.balance.prefix}$</span>
                        <span>{state.data.balance.intPart}<span className="text--light">.{state.data.balance.decPart}</span></span>
                      </div>
                    </div>
                  </div>  

                  <div className="header__actions">
                    <HeaderButton link="/receive" image="/svg/receive.svg" label="Receive" alt="Receive" />

                    <HeaderButton link="/send" image="/svg/send.svg" label="Send" alt="Send" />
                  </div>

                  <div className="transaction-list">
                    <div className="container">
                      <div className="transaction-list__content">
                        {state.data.list.map((item: any) => (
                          <Fragment key={item.id}>
                            <Suspense fallback={
                              <Skeleton /> } >
                                <Link className="item__link" to={`/transaction/${item.id}`}>
                                  <ListItem image={`/svg/${item.image}.svg`} alt={item.alt} name={item.name} time={item.date} type={item.type} amount={item.amount} />
                                </Link>
                            </Suspense>
                          </Fragment>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Fragment> 
              )
            }
          </Fragment>
        )
      }

    </div>
  );
}
