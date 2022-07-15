import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

const clientID = `?client_id=${process.env.REACT_APP_CLIENT_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    let url;
    url = `${mainUrl}${clientID}${urlPage}`;
    if (query) {
      // setLoading(true);
      // setPhotos([]);
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
      console.log("hello");
    }
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      console.log(data);
      // setPhotos([...photos, ...data]);
      setPhotos((prev) => {
        if (query) {
          return [...prev, ...data.results];
        } else {
          return [...prev, ...data];
        }
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [page]);
  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      // console.log(`innerHeight: ${window.innerHeight}`);
      // console.log(`scrollY:' ${window.scrollY}`);
      // console.log(`body height: ${document.body.scrollHeight}`);
      if (
        !loading &&
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 3
      ) {
        // console.log("hello");
        setPage((old) => {
          return old + 1;
        });
      }
      return () => window.removeEventListener(event);
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    // so the function wont be called when search input is empty
    setLoading(true);
    setPhotos([]);
    fetchImages();
    // setQuery("");
  };
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="submit-btn" type="submit" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={index} {...photo} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
