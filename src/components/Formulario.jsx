import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import useNoticias from "../hooks/useNoticias";

/* An array of objects. */
const CATEGORIAS = [
  { value: "general", label: "General" },
  { value: "business", label: "Negocios" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "health", label: "Salud" },
  { value: "science", label: "Ciencia" },
  { value: "sports", label: "Deportes" },
  { value: "technology", label: "Tecnología" },
];

const Formulario = () => {
  /* Destructuring the `useNoticias` hook. */
  const { categoria, handleChangeCategoria } = useNoticias();

  return (
    /* A dropdown menu. */
    <FormControl fullWidth>
      <InputLabel>Categoría</InputLabel>
      <Select
        label="Categoría"
        onChange={handleChangeCategoria}
        value={categoria}
      >
        {CATEGORIAS.map((categoria) => (
          <MenuItem key={categoria.value} value={categoria.value}>
            {categoria.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Formulario;
