import { GetStaticPaths, GetStaticProps } from "next";
import type { Trip } from "../types"
import api from "../api";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, useTheme } from "@mui/material";
import React from "react";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

type Props = {
    trips: Trip[];
}

type Params = ParsedUrlQuery & {
    origin: string
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

export const getStaticProps: GetStaticProps<Props, Params> = async ({params}) => {
    const trips = await api.trips.list(params?.origin!)

    trips.sort((a,b) => a.price - b.price)
  
    return {
      props: {
        trips: trips.slice(0, 100),
      }
    }
  }

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: 'blocking' }
} 

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }


const OriginPage:React.FC<Props> = ({trips}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sort, setSort] = useState<"price" | "days">("price");
    const checkpoint = useRef<HTMLDivElement>(null);
    const matches = useMemo(() => { return [...trips].sort((a, b) => a[sort] - b[sort]) }, [trips, sort])

    

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - matches.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


    return (
        <>
            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
                <Table sx={{ maxWidth: 500 }} aria-label="simple table">
                    <TableHead>
                        <TableRow >
                            <TableCell >Destino</TableCell>
                            <TableCell align="center" onClick={() => setSort("days")} style={{ color: sort === "days" ? "yellow" : "inherit", cursor: 'pointer' }}>Días</TableCell>
                            <TableCell align="right" onClick={() => setSort("price")} style={{ color: sort === "price" ? "yellow" : "inherit", cursor: 'pointer' }}>Precio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? matches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : matches
                        ).map((trip) => (
                            <TableRow
                                key={trip.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {trip.origin.destination}
                                </TableCell>

                                <TableCell align="center">{trip.days}</TableCell>
                                <TableCell align="right">{Number(trip.price).toLocaleString("es-AR", { style: "currency", currency: 'ARS', })}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={3}
                                count={matches.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )

}

export default OriginPage