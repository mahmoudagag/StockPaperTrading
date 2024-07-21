import { useContext } from "react";
import GlobalContext from "../ContextWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

export default function Activity() {
  const { activity, setStockSymbol, setPage, pages } = useContext(GlobalContext);

  function formatDate(date) {
    // to include the time: date.slice(11,16)
    return date.slice(5, 7) + "/" + date.slice(8, 10) + "/" + date.slice(2, 4);
  }

  function naviatgeStockPage(sym){
    setStockSymbol(sym)
    setPage(pages.stockPage)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Company Name</TableHeaderCell>
            <TableHeaderCell>Symbol</TableHeaderCell>
            <TableHeaderCell>Quantity</TableHeaderCell>
            <TableHeaderCell>Side</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activity.map((h) => {
            return (
              <TableRow key={h.initiated_on}>
                <TableCell>{formatDate(h.initiated_on)}</TableCell>
                <TableCell className="cursor-pointer" onClick={()=>naviatgeStockPage(h.symbol)}>{h.companyName}</TableCell>
                <TableCell className="cursor-pointer" onClick={()=>naviatgeStockPage(h.symbol)}>{h.symbol}</TableCell>
                <TableCell>{h.quantity}</TableCell>
                <TableCell>{h.side}</TableCell>
                <TableCell>{h.price}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
