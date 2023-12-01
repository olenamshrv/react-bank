import React, { lazy, Fragment, Suspense, useContext, useReducer, useCallback, useEffect  } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../App";

import { getDate } from "../../container/util/getDate";
import { splitNumber } from "../../container/util/splitNumber";
import { requestInitialState, REQUEST_ACTION_TYPE, requestReducer } from "../../container/util/requestReducer";

import { Alert, LoaderTop, ItemFieldSkeleton, TransactionSkeleton } from "../../component/load";
import { BackButton } from "../../component/back-button";

const ItemField = lazy(() => import("../../component/item-field"));

export const TransactionPage: React.FC = () => {
  const { transactionId } = useParams();

  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const auth=useContext(AuthContext);

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
  
    try {
      const res = await fetch(`http://localhost:4000/transaction?userId=${auth?.state.user?.id}&transactionId=${transactionId}`);
  
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
  }, [auth?.state.user?.id, transactionId]);
  
  const convertData = (raw: any) => {
    const { id, amount, date, address, type } =  raw.transaction

    return {
      transaction: {
        id: id,
        amount: {...splitNumber(Number(amount), type)},
        date: getDate(date, true),
        address: address,
        type: type,
      },
  }};
  
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
                  <span className="header__text">Transaction</span>
              </div>
              
              <div className="page-transaction__heading">
                <TransactionSkeleton />
              </div>

              <div className="transaction-item">
                <ItemFieldSkeleton/>
                <ItemFieldSkeleton/>
                <ItemFieldSkeleton/>
              </div>
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
                  <span className="header__text">Transaction</span>
              </div>
            </div>
            <Alert status={state.status} message={state.message} />
          </Fragment>
        )
      }         

      { state.status === REQUEST_ACTION_TYPE.SUCCESS && 
        (
            <div className="page-transaction__content">
              <div className="page-transaction__header">
                  <span className="header__action">
                    <BackButton />
                  </span>
                  <span className="header__text">Transaction</span>
              </div>

              <Suspense fallback={<TransactionSkeleton/>}>
                <Fragment>
                  { state.data.transaction.amount.intPart[0] === "+" && 
                  <div className="page-transaction__heading">
                    {state.data.transaction.amount.intPart}
                    <span className="page-transaction__heading--normal">{state.data.transaction.amount.decPart}</span>
                  </div>
                  }

                  { state.data.transaction.amount.intPart[0] === "-" && 
                  <div className="page-transaction__heading page-transaction__heading--black">
                    {state.data.transaction.amount.intPart}
                    <span className="page-transaction__heading--normal">{state.data.transaction.amount.decPart}</span>
                  </div>
                  }
               </Fragment>
              </Suspense>

              <div className="transaction-item">   
                <Suspense fallback={
                  <ItemFieldSkeleton />
                } >
                  <ItemField name="Date" value=   {state.data.transaction.date} />
                </Suspense>

                <Suspense fallback={
                  <ItemFieldSkeleton />
                } >
                  <ItemField name="Address" value={state.data.transaction.address} />
                </Suspense>

                <Suspense fallback={
                  <ItemFieldSkeleton />
                } >
                  <ItemField name="Type" value={state.data.transaction.type} />
                </Suspense>
              </div>
            </div>
        )
      }
    </div>
  );
}