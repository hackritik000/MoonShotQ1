import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { useFetchEmailBody } from "./api";
import DOMPurify from "dompurify";
import { ExtendedList, isFavorites } from "./emailSlice";

export const Body = () => {
  const activeEmail = useSelector((state: RootState) =>
    state.emails.list.find((item) => item.isActive === true),
  );

  if (!activeEmail) {
    return <div className="noEmail"></div>;
  }
  return <EmailBody activeEmail={activeEmail} />;
};

export const EmailBody = ({ activeEmail }: { activeEmail: ExtendedList }) => {
  const { data, isError, isLoading } = useFetchEmailBody(activeEmail.id);
  const dispatch = useDispatch();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading email body.</div>;
  }

  const markFavorite = () => {
    dispatch(
      isFavorites({
        id: activeEmail.id,
        isFavorites: !activeEmail.isFavorites,
      }),
    );
  };
  const sanitizedHTML = DOMPurify.sanitize(
    data?.body || "No content available.",
  );
  return (
    <>
      <div className="logo">
        {activeEmail.from.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="emailbodyhead">
          <div>
            <div className="subject">{activeEmail.subject}</div>
            <div className="date">
              {(() => {
                const date = new Date(activeEmail.date);

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
            </div>
          </div>
          <button onClick={() => markFavorite()}>
            {activeEmail.isFavorites
              ? "Mark as unfavorite"
              : "Mark as favorite"}
          </button>
        </div>
        <div
          className="body"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        ></div>
      </div>
    </>
  );
};
