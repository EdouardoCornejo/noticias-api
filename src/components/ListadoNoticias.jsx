import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import useNoticias from "../hooks/useNoticias";
import Noticia from "./Noticia";

const ListadoNoticias = () => {
  /* Destructuring the object returned by the useNoticias hook. */
  const { noticias, totalNoticias, handleOnchangePagina, pagina, error } =
    useNoticias();

  /* NewsAPI (plan gratuito) solo permite consultar los primeros 100 resultados. */
  const totalPaginas = Math.ceil(Math.min(totalNoticias, 100) / 20);

  return (
    <>
      {/* A component that is used to display text. */}
      <Typography
        textAlign={"center"}
        marginY={5}
        variant="h3"
        component={"h2"}
      >
        Ultimas Noticias
      </Typography>

      {error && (
        <Typography textAlign={"center"} color="error">
          {error}
        </Typography>
      )}

      <Stack
        sx={{
          marginY: 3,
        }}
        spacing={2}
        direction={"row"}
        justifyContent="center"
        alignItems={"center"}
      >
        {/* A component that is used to display a pagination. */}
        <Pagination
          count={totalPaginas}
          color="primary"
          onChange={handleOnchangePagina}
          page={pagina}
        />
      </Stack>

      {/* A component that is used to display a grid. */}
      <Grid container spacing={2}>
        {noticias.map((noticia) => (
          <Noticia key={noticia.url} noticia={noticia} />
        ))}
      </Grid>

      <Stack
        sx={{
          marginY: 5,
        }}
        spacing={2}
        direction={"row"}
        justifyContent="center"
        alignItems={"center"}
      >
        {/* A component that is used to display a pagination. */}
        <Pagination
          count={totalPaginas}
          color="primary"
          onChange={handleOnchangePagina}
          page={pagina}
        />
      </Stack>
    </>
  );
};

export default ListadoNoticias;
