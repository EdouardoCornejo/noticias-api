import { useContext } from "react";
import NoticiasContext from "../context/NoticiasProvider";

/**
 * UseNoticias() returns the useContext(NoticiasContext) value
 * @returns The context object.
 */
const useNoticias = () => {
  return useContext(NoticiasContext);
};

/* Exporting the function. */
export default useNoticias;
