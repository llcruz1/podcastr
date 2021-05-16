import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export function convertMillisecondsToDateString(dateInMilliseconds: number) {
  const dateISO = new Date(dateInMilliseconds).toISOString();
  const formattedDate = format(parseISO(dateISO), "d MMM yy", {
    locale: ptBR,
  });

  return formattedDate;
}
