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
  const [error, setError] = useState("");

  /* A hook that is called when the component is mounted and when `categoria` or `pagina` change. */
  useEffect(() => {
    const controller = new AbortController();

    const consultarAPI = async () => {
      try {
        const { data } = await axios.get("/api/news", {
          params: { category: categoria, page: pagina },
          signal: controller.signal,
        });
        setNoticias(data.articles.filter((noticia) => noticia.title !== "[Removed]"));
        setTotalNoticias(data.totalResults);
        setError("");
      } catch (err) {
        if (axios.isCancel(err)) return;
        setNoticias([]);
        setTotalNoticias(0);
        setError(err.response?.data?.message ?? "No se pudieron cargar las noticias");
      }
    };
    consultarAPI();

    return () => controller.abort();
  }, [categoria, pagina]);

  const handleChangeCategoria = (e) => {
    setCategoria(e.target.value);
    setPagina(1);
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
        error,
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
