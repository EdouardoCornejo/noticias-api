import axios from "axios";
import { useState, useEffect, createContext } from "react";

/* Creating a context object. */
const NoticiasContext = createContext();

const NoticiasProvider = ({ children }) => {
  /* Creating a state variable and a function to change the state variable. */
  const [categoria, setCategoria] = useState("general");
  const [noticias, setNoticias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalNoticias, setTotalNoticias] = useState(0);

  /* A hook that is called when the component is mounted and when the value of the variable `categoria`
changes. */
  useEffect(() => {
    const consultarAPI = async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=mx&category=${categoria}&apiKey=${
        import.meta.env.VITE_API_KEY
      }`;

      const { data } = await axios(url);
      setNoticias(data.articles);
      setTotalNoticias(data.totalResults);
      setPagina(1);
    };
    consultarAPI();
  }, [categoria]);

  /* A hook that is called when the component is mounted and when the value of the variable `pagina`
changes. */
  useEffect(() => {
    const consultarAPI = async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=mx&page=${pagina}&category=${categoria}&apiKey=${
        import.meta.env.VITE_API_KEY
      }`;

      const { data } = await axios(url);
      setNoticias(data.articles);
      setTotalNoticias(data.totalResults);
    };
    consultarAPI();
  }, [pagina]);

  const handleChangeCategoria = (e) => {
    setCategoria(e.target.value);
  };

  const handleOnchangePagina = (e, valor) => {
    setPagina(valor);
  };

  return (
    /* Creating a context object. */
    <NoticiasContext.Provider
      value={{
        categoria,
        handleChangeCategoria,
        noticias,
        totalNoticias,
        handleOnchangePagina,
        pagina,
      }}
    >
      {children}
    </NoticiasContext.Provider>
  );
};

/* Exporting the `NoticiasProvider` component. */
export { NoticiasProvider };

/* Exporting the `NoticiasContext` object. */
export default NoticiasContext;
