import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { useContext } from "react";
import GlobalContext from "../ContextWrapper.js";

export default function Holding({displayModal}) {
  const { holding, sides, pages, setPage, setStockSymbol } = useContext(GlobalContext);

  function naviatgeStockPage(sym){
    setStockSymbol(sym)
    setPage(pages.stockPage)
  }
  
  return (
    <div className="mx-auto max-w-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Company Name</TableHeaderCell>
            <TableHeaderCell>Symbol</TableHeaderCell>
            <TableHeaderCell>Quantity</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holding.map((h) => {
            return (
              <TableRow key={h.symbol}>
                <TableCell className="cursor-pointer" onClick={()=>naviatgeStockPage(h.symbol)}>{h.companyName}</TableCell>
                <TableCell className="cursor-pointer" onClick={()=>naviatgeStockPage(h.symbol)}>{h.symbol}</TableCell>
                <TableCell>{h.quantity}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button color="blue" variant="primary" onClick={() =>  displayModal(h.symbol, sides.buy)}>
                      Buy
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button color="rose" variant="primary" onClick={() => displayModal(h.symbol, sides.sell)}>
                      Sell
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
