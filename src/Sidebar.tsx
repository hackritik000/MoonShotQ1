import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { isActive, isFavorites } from "./emailSlice";
export const Sidebar = () => {
  const allEmails = useSelector((state: RootState) => state.emails);
  const dispatch = useDispatch();
  const openEmail = (id: string) => {
    dispatch(isActive({ id }));
  };
  let listEmail = allEmails.list;

  const markFavorite = (id: string, favorite: boolean) => {
    dispatch(isFavorites({ id, isFavorites: !favorite }));
  };

  if (allEmails.read) {
    listEmail = allEmails.list.filter((item) => item.isRead);
  }
  if (allEmails.favorite) {
    listEmail = allEmails.list.filter((item) => item.isFavorites);
  }
  if (allEmails.unread) {
    listEmail = allEmails.list.filter((item) => !item.isRead);
  }
  return (
    <>
      {listEmail.map((email) => {
        return (
          <button
            key={email.id}
            onClick={() => openEmail(email.id)}
            className={`listpart ${email.isRead && "read"}`}
          >
            <div className="logo">
              {email.from.name.charAt(0).toUpperCase()}
            </div>
            <div className="rightside">
              <div className="from">
                From:{" "}
                <span>
                  {email.from.name} &lt;{email.from.email}&gt;{" "}
                </span>
              </div>
              <div className="subject">
                Subject: <span>{email.subject}</span>
              </div>
              <div className="short_description">{email.short_description}</div>
              <div className="date">
                {(() => {
                  const date = new Date(email.date);

                  const datePart = date.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  const timePart = date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  });

                  const formattedTime = timePart.replace(
                    /\s?(AM|PM)/i,
                    (_, period) => period.toLowerCase(),
                  );

                  const finalFormattedDate = `${datePart} ${formattedTime}`;
                  return finalFormattedDate;
                })()}
                {email.isRead && (
                  <span
                    role="button"
                    onClick={() => markFavorite(email.id, email.isFavorites)}
                    className="favorite"
                  >
                    {email.isFavorites ? "Unfavorite" : "Favorite"}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
};
