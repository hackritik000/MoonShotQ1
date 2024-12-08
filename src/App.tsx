import { useEffect, useRef } from "react";
import "./App.css";
import { useFetchEmailList } from "./api";
import { Body } from "./Body";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "./emailSlice";
import { RootState } from "./store";
import { Sidebar } from "./Sidebar";
import { Filterbar } from "./Filterbar";

function App() {
  const {
    isLoading,
    isError,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchEmailList();
  const observerRef = useRef(null);

  const lastPage = useSelector((state: RootState) => state.emails.lastPage);
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    if (!isLoading && !isError) {
      if (data && data.pageParams && data.pageParams.length > lastPage) {
        console.log(data);
        if (data.pages[lastPage].list) {
          dispatch(addEntry(data.pages[lastPage].list));
        }
      }
    }
    return () => observer.disconnect();
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    dispatch,
    data,
    isError,
    isLoading,
    lastPage,
  ]);

  return (
    <>
      <main>
        <nav>
          <Filterbar />
        </nav>
        <section>
          <aside>
            <Sidebar />
            <div ref={observerRef} />
            {hasNextPage && <div>Loading...</div>}
          </aside>
          <article>
            {" "}
            <Body />
          </article>
        </section>
      </main>
    </>
  );
}

export default App;
