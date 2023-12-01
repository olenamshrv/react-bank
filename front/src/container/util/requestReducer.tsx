export enum REQUEST_ACTION_TYPE {
  PROGRESS = "progress",
  SUCCESS = "success",
  ERROR = "error",
};
  
export type Action = {
    type: REQUEST_ACTION_TYPE,
    payload?: any,
  }
  
export type State = {
  status: REQUEST_ACTION_TYPE | null,
  message?: string | null,
  data?: any | null,
}
  
export const requestInitialState = {
  status: null,
  message: null,
  data: null,
};

export const requestReducer = (state: State, action: Action) => {
  switch (action.type) {
    case REQUEST_ACTION_TYPE.PROGRESS:
      return {
        ...state,
        status: action.type,
      };

    case REQUEST_ACTION_TYPE.SUCCESS:    
      return {
        ...state,
        status: action.type,
        data: action.payload,
      };

    case REQUEST_ACTION_TYPE.ERROR:
      return {
        ...state,
        status: action.type,
        message: action.payload,
      };

    default:
      return { ...state };
  }
};
