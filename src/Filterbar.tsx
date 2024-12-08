import { useDispatch, useSelector } from "react-redux";
import { clickFavorite, clickRead, clickUnread } from "./emailSlice";
import { RootState } from "./store";

export const Filterbar = () => {
  const emailState = useSelector((state: RootState) => state.emails);
  const dispatch = useDispatch();
  const read = () => {
    dispatch(clickRead());
  };
  const unread = () => {
    dispatch(clickUnread());
  };
  const favorites = () => {
    dispatch(clickFavorite());
  };
  return (
    <>
      {" "}
      Filter By:{" "}
      <span
        className={`${emailState.unread && "active"}`}
        onClick={() => unread()}
      >
        {" "}
        Unread{" "}
      </span>{" "}
      <span className={`${emailState.read && "active"}`} onClick={() => read()}>
        Read
      </span>{" "}
      <span
        className={`${emailState.favorite && "active"}`}
        onClick={() => favorites()}
      >
        Favorites
      </span>
    </>
  );
};
