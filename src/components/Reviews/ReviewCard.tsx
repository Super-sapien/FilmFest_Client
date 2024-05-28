import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import * as React from "react";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import {BASE_URL} from "../../config";
import {useEffect, useRef, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const ReviewCard = ({review, film}: { review: Review, film: Film }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
    const [open, setOpen] = useState(false);
    const textRef =  useRef<HTMLParagraphElement | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const textElement = textRef.current as HTMLElement;
        setIsOverflowing(textElement.scrollHeight !== textElement.clientHeight);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const handleOpen = () => {
        isOverflowing && setOpen(!open);
    };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    const reviewDate = new Date(review.timestamp)
    // const imgErrorHandler = (e: any) => {
    //     e.preventDefault();
    //     e.target.onerror = null;
    //     // random image placeholder from internet
    //     e.target.src = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
    // }

    // const reviewText = review.review
    return (
        <><Card sx={{
            display: 'flex',
            height: 'auto',
            width: 900,
            direction: 'row', gap: 0.5, mt: 3, mb: 3, ml: 1, mr: 1,
            border: 'double 3px transparent',
            borderRadius: 3,
            backgroundImage: `linear-gradient(white, white),
                linear-gradient(65deg, #03a9f4, #00a0b2, #00a0b2)`,
            backgroundOrigin: "border-box",
            backgroundClip: 'content-box, border-box',
            '@media (max-width: 1000px)': {width: '85vw'},
            '@media (max-width: 400px)': {width: '80vw'}
        }}>
            <Box sx={{ m: 1 }}>
                {isMobile &&
                    <Typography variant={'caption'} sx={{mt: 0}}>
                        {reviewDate.toLocaleDateString('en-US') + ' '}
                    </Typography>}
                <CardMedia
                    component="img"
                    sx={{
                        width: 75, height: 75, borderRadius: '50%', mt: 'auto', mb: 'auto',
                        '@media (max-width: 700px)': {width: 50, height: 50, m: 'auto', pt: 0, mb: 0.5}
                    }}
                    src={`${BASE_URL}/users/${review.reviewerId}/image` || 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'}
                    // onError={imgErrorHandler}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.preventDefault();
                        const target = e.target as HTMLImageElement;
                        target.src = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
                    }}
                    alt={review.reviewerFirstName + "'s image"}
                />
            </Box>
            {!isMobile &&
                <>
                <Box sx={{m: 1 }}>
                    <Typography variant={'caption'} sx={{
                        display: 'flex', alignItems: 'center',
                        '@media (max-width: 700px)': {display: 'hidden'}
                    }}>
                        {reviewDate.toLocaleDateString('en-US') + ' '}
                    </Typography>

                    <Typography sx={{display: 'flex', alignItems: 'center', color: '#00a0b2', fontWeight: 'bold'}}>
                        {review.reviewerFirstName}
                    </Typography>
                    <Typography sx={{display: 'flex', alignItems: 'center', color: '#00a0b2', fontWeight: 'bold'}}>
                        {review.reviewerLastName}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'column', mt: 1, mb: 1, whiteSpace: 'pre-wrap', overflow: 'visible'}}>
                    {/*<Typography ref={textRef} onClick={handleOpen} display="inline"*/}
                    <Typography ref={textRef} display="inline"
                                style={{
                                    position: 'relative',
                                    maxHeight: open ? '1000px' : '3.6em',
                                    lineHeight: '1.2em',
                                    display: '-webkit-box',
                                    overflow: open ? 'visible' : 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: open ? 'unset' : 3,
                                    textAlign: 'left'
                                }}
                                sx={{mt: 0, mb: 'auto', ml: 1}}>
                                {/*sx={{mt: 0, mb: 'auto', ml: 1, '&:hover': isOverflowing ? { cursor: 'pointer' } : {}}}>*/}
                        {review.review !== null ? review.review : ''}
                    </Typography>
                    {/*{(review.review !== null && review.review.length >= charLimit) &&*/}
                    {isOverflowing &&
                        <Typography display="inline" onClick={handleOpen}
                                     sx={{position: 'relative', fontSize: 14, textDecoration: 'underline', color: 'blue', '&:hover': {cursor: 'pointer', color: '#00a0b2'} }}>
                            { open ? 'See Less' : 'See More'}
                        </Typography>
                    }
                </Box>
                </>
            }
            {isMobile &&
                <Box sx={{display: 'flex', flexDirection: 'row', mt: 1, mb: 1, maxWidth: 650, whiteSpace: 'pre-wrap'}}>
                    <Typography display="inline" sx={{color: '#00a0b2', fontWeight: 'bold'}}>
                        {review.reviewerFirstName + ' ' + review.reviewerLastName}
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography ref={textRef} onClick={handleOpen} display="inline"
                                style={{
                                    position: 'relative',
                                    maxHeight: open ? '1000px' : '3.6em',
                                    lineHeight: '1.2em',
                                    display: '-webkit-box',
                                    overflow: open ? 'visible' : 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: open ? 'unset' : 3,
                                    textAlign: 'left'
                                }}
                                sx={{mt: 0, mb: 'auto', ml: 1, '&:hover': isOverflowing ? { cursor: 'pointer' } : {} }}>
                        {review.review !== null ? review.review : ''}
                    </Typography>
                    {isOverflowing &&
                        <Typography display="inline" onClick={handleOpen}
                                    sx={{position: 'relative',
                                        fontSize: 14,
                                        textDecoration: 'underline',
                                        color: 'blue',
                                        '&:hover': {cursor: 'pointer', color: '#00a0b2'}
                        }}>
                            { open ? 'See Less' : 'See More'}
                        </Typography>
                    }
                    </Box>
                </Box>}
            <Box sx={{mt: 'auto', mb: 2, ml: 'auto', mr: 2, display: 'flex'}}>
                <StarIcon sx={{color: '#00a0b2'}}/>
                <Typography sx={{color: '#00a0b2', fontWeight: 'bold'}}>
                    {review.rating !== null ? review.rating + '/10' : 'No rating'}
                </Typography>
            </Box>
        </Card>

        {/*{open &&*/}
        {/*<Dialog open={open} onClose={handleClose}>*/}
        {/*    <DialogContent>*/}
        {/*        <Box sx={{mt: 'auto', mr: 'auto', display: 'flex', justifyContent: 'space-between' }}>*/}
        {/*            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1 }}>*/}
        {/*                <Typography variant={'caption'} sx={{*/}
        {/*                    display: 'flex', alignItems: 'center',*/}
        {/*                    '@media (max-width: 700px)': {display: 'hidden'}*/}
        {/*                }}>*/}
        {/*                    {reviewDate.toLocaleDateString('en-US') + ' '}*/}
        {/*                </Typography>*/}

        {/*                <Typography sx={{color: '#00a0b2', fontWeight: 'bold'}}>*/}
        {/*                    {review.reviewerFirstName + ' ' + review.reviewerLastName}*/}
        {/*                </Typography>*/}
        {/*            </Box>*/}
        {/*            <Box  sx={{display: 'flex', flexDirection: 'row', gap: 1 }}>*/}
        {/*                <StarIcon sx={{color: '#00a0b2'}}/>*/}
        {/*                <Typography sx={{color: '#00a0b2', fontWeight: 'bold'}}>*/}
        {/*                    {review.rating !== null ? review.rating + '/10' : 'No rating'}*/}
        {/*                </Typography>*/}
        {/*            </Box>*/}

        {/*        </Box>*/}
        {/*        <Typography sx={{textAlign: 'left', mt: 1, mb: 1, maxWidth: 650, whiteSpace: 'pre-wrap'}}>*/}
        {/*            {review.review !== null ? review.review : 'No review text'}*/}
        {/*        </Typography>*/}
        {/*    </DialogContent>*/}
        {/*    <DialogActions>*/}
        {/*        <Button onClick={handleClose}>Close</Button>*/}
        {/*    </DialogActions>*/}
        {/*</Dialog>*/}
        {/*}*/}
        </>
    )
}

export default ReviewCard;