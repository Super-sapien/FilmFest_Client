import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {Card} from "@mui/material";
import Typography from "@mui/material/Typography";

const FilmPagination = (props: any) => {

    return (
        <Card sx={{ display: 'flex', justifyContent: 'center', margin: 'auto', boxShadow: 0, mt: 4, mb: 4 }}>
            <Stack spacing={2}>
                <Pagination
                    count={props.count}
                    page={props.page}
                    onChange={props.onChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                />
            </Stack>
            <Typography sx={{position: 'absolute', mt: 5, pb: 2 }}>
                {props.filmCount} matching film{props.filmCount !== 1 ? 's' : ''} {props.filmCount > props.pageSize ?
                (props.filmCount > 1 ? ' - showing ' + ((props.page - 1) * props.pageSize + 1) + ' to '
                + (props.filmCount >= props.pageSize + (props.page - 1) * props.pageSize ? props.pageSize +
                (props.page - 1) * props.pageSize : props.filmCount) : '') : ' - showing all'}
            </Typography>
        </Card>
    );
}

export default FilmPagination;