import "./index.scss";

import React, { lazy, Fragment, Suspense, useContext, useReducer, useCallback, useEffect } from "react";

import { AuthContext } from "../../App";

import { requestInitialState, REQUEST_ACTION_TYPE, requestReducer } from "../../container/util/requestReducer";

import { calculateElapsedTime } from "../../container/util/calculateElapsedTime"

import { Alert, LoaderTop, NotificationSkeleton } from "../../component/load";
import { BackButton } from "../../component/back-button";

const NotificationItem = lazy(() => import("../../component/notification-item"));

export const NotificationsPage: React.FC = () => {

  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const auth=useContext(AuthContext);

  console.log(auth, "auth");

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
  
    try {
      const res = await fetch(`http://localhost:4000/notifications?id=${auth?.state.user?.id}`);
  
      const data = await res.json();

      if (res.ok) {
        console.log("ok", convertData(data));

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
  }, []);

  const convertData = (raw: any) => {
    let { list } = raw;

    list = list.map((item: any) => 
       ({ 
        icon: `/svg/${item.type.toLowerCase()}.svg`,
        name: item.name,
        type: item.type,
        date: calculateElapsedTime(item.date),
      }
    ))

    return list
  };
  
  useEffect(() => {
    getData();
  }, []);

  return (      
    <div className="page page-base page--grey page-transaction">
    
      { state.status === REQUEST_ACTION_TYPE.PROGRESS && 
        <Fragment>
          <LoaderTop />

          <div className="page-transaction__content">
                <div className="page-transaction__header">
                    <span className="header__action">
                      <BackButton />
                    </span>
                    <span className="header__text">Notifications</span>
                </div>
                            
                <NotificationSkeleton />

          </div>
        </Fragment>
      }

      { state.status === REQUEST_ACTION_TYPE.ERROR && (
          <Fragment>
              <div className="page-transaction__content">
                <div className="page-transaction__header">
                    <span className="header__action">
                      <BackButton />
                    </span>
                    <span className="header__text">Notifications</span>
                </div>
              </div>

            <Alert status={state.status} message={state.message} />
          </Fragment>
        )
      }       

      { state.status === REQUEST_ACTION_TYPE.SUCCESS && 
        (
          <Fragment>
            {
              <div className="page-transaction__content">
                <div className="page-transaction__header">
                    <span className="header__action">
                      <BackButton />
                    </span>
                    <span className="header__text">Notifications</span>
                </div>

                { state.data.length === 0 ?
                  (
                    <div className="transaction-list__content">
                      <Alert message="No notifications yet" status="default" />
                    </div>
                  )

                  :

                  (
                    <div className="container container--grey">
                      <div className="notifications-list">
                        {state.data.map((item: any) => (
                          <Fragment key={item.id}>
                            <Suspense fallback={<></> } >
                              <NotificationItem icon={item.icon}  name={item.name} time={item.date} type={item.type}/>
                            </Suspense>
                          </Fragment>
                          )
                        )}
                      </div>
                    </div> 
                  )
                }         
              </div>
            }
          </Fragment>
        )
      } 
    </div>
  );
}