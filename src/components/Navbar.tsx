import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TheatersTwoToneIcon from '@mui/icons-material/TheatersTwoTone';
import {useAuthStore} from "../store";
import {useLocation, useNavigate} from "react-router-dom";
import {useSnackStore} from "../store/snack";
import {BASE_URL} from "../config";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const userAuth = useAuthStore(state => state.userAuth)
    const removeAuth = useAuthStore(state => state.removeAuth)

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const handleLogOut = () => {
        removeAuth()
        setMessage("You have logged out")
        setStatus('success')
        setSnackOpen(true)
        navigate('../login')
    }

    const settings = [
        {text: 'Manage Account', action: () => navigate("/manageAccount")},
        // {text: 'Manage Films', action: () => navigate("/manageFilms")},
        // {text: 'Manage Reviews', action: () => navigate("/manageReviews")},
        {text: 'Logout', action: () => handleLogOut()}];

    // const pages = [
    //     {text: 'films', action: () => location.pathname == '/films' ? null : navigate('/films?page=1')},
    //     // {text: 'top 10', action: () => navigate('/topTen')},
    //     // {text: 'gallery', action: () => navigate('/myFilms')}
    // ];

    // const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorElNav(event.currentTarget);
    // };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    // const handleCloseNavMenu = () => {
    //     setAnchorElNav(null);
    // };
    //
    // const handleClickNavMenu = (option: any) => {
    //     option.action()
    //     setAnchorElUser(null);
    // }

    const handleCloseUserMenu = (option: any) => {
        setAnchorElUser(null);
    };

    const handleClickUserMenu = (option: any) => {
        option.action()
        setAnchorElUser(null);
    }

    // const goToHome = () => {
    //     navigate("")
    // }

    const goToLogin = () => {
        navigate("/login")
    }
    const goToRegister = () => {
        navigate("/register")
    }

    const imgErrorHandler = (e: any) => {
        e.preventDefault();
        e.target.onerror = null;
        // random image placeholder from internet
        e.target.src = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
    }

    return (
        <AppBar position="sticky" sx={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)` }}>
            <Container maxWidth="xl" sx={{ '@media (max-width:380px)': { pr: 1, pl: 1 },
                '@media (max-width:300px)': { pr: 0, pl: 0 }
            }}>
                <Toolbar disableGutters>
                    <TheatersTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={ () => location.pathname == '/films' ? null : navigate('/films?page=1')}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.25rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {cursor: 'pointer'},
                            '@media (max-width:380px)': { letterSpacing: '0rem' }
                        }}
                    >
                        FilmFest
                    </Typography>

                    {/*<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>*/}
                    {/*    <IconButton*/}
                    {/*        size="large"*/}
                    {/*        aria-label="account of current user"*/}
                    {/*        aria-controls="menu-appbar"*/}
                    {/*        aria-haspopup="true"*/}
                    {/*        onClick={handleOpenNavMenu}*/}
                    {/*        color="inherit"*/}
                    {/*    >*/}
                    {/*        <MenuIcon />*/}
                    {/*    </IconButton>*/}
                    {/*    <Menu*/}
                    {/*        id="menu-appbar"*/}
                    {/*        anchorEl={anchorElNav}*/}
                    {/*        anchorOrigin={{*/}
                    {/*            vertical: 'bottom',*/}
                    {/*            horizontal: 'left',*/}
                    {/*        }}*/}
                    {/*        keepMounted*/}
                    {/*        transformOrigin={{*/}
                    {/*            vertical: 'top',*/}
                    {/*            horizontal: 'left',*/}
                    {/*        }}*/}
                    {/*        open={Boolean(anchorElNav)}*/}
                    {/*        onClose={handleCloseNavMenu}*/}
                    {/*        sx={{*/}
                    {/*            display: { xs: 'block', md: 'none' },*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        {pages.map((page) => (*/}
                    {/*            <MenuItem key={page.text} onClick={ () => handleClickNavMenu(page)}>*/}
                    {/*                <Typography textAlign="center">{page.text}</Typography>*/}
                    {/*            </MenuItem>*/}
                    {/*        ))}*/}
                    {/*    </Menu>*/}
                    {/*</Box>*/}
                    <TheatersTwoToneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, '@media (max-width:380px)': { mr: 0 }  }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() => location.pathname == '/films' ? null : navigate('/films?page=1')}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.25rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {cursor: 'pointer'},
                            '@media (max-width:380px)': { letterSpacing: '0rem' }
                        }}
                    >
                        FilmFest
                    </Typography>
                    {/*<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>*/}
                    {/*    {pages.map((page) => (*/}
                    {/*        <Button*/}
                    {/*            key={page.text}*/}
                    {/*            onClick={ () => handleClickNavMenu(page)}*/}
                    {/*            sx={{ my: 2, color: 'white', display: 'block' }}*/}
                    {/*        >*/}
                    {/*            {page.text}*/}
                    {/*        </Button>*/}
                    {/*    ))}*/}
                    {/*</Box>*/}

                    <Box sx={{ flexGrow: 0, ml: 'auto', '@media (max-width:600px)': { '& > button': { padding: '6px 8px', fontSize: '0.75rem' } } }}>
                        {userAuth.userId !== -1 && userAuth.token !== '' &&
                            <><Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar src={`${BASE_URL}/users/${userAuth.userId}/image`}
                                    onError={imgErrorHandler}/>
                                </IconButton>
                            </Tooltip>
                            {/*    <Menu*/}
                            {/*    sx={{mt: '45px'}}*/}
                            {/*    id="menu-appbar"*/}
                            {/*    anchorEl={anchorElUser}*/}
                            {/*    anchorOrigin={{*/}
                            {/*        vertical: 'top',*/}
                            {/*        horizontal: 'right',*/}
                            {/*    }}*/}
                            {/*    keepMounted*/}
                            {/*    transformOrigin={{*/}
                            {/*        vertical: 'top',*/}
                            {/*        horizontal: 'right',*/}
                            {/*    }}*/}
                            {/*    open={Boolean(anchorElUser)}*/}
                            {/*    onClose={handleCloseUserMenu}*/}
                            {/*>*/}
                            {/*    {settings.map((setting) => (*/}
                            {/*        <MenuItem key={setting.text} onClick={() => handleClickUserMenu(setting)}>*/}
                            {/*            <Typography textAlign="center">{setting.text}</Typography>*/}
                            {/*        </MenuItem>*/}
                            {/*    ))}*/}
                            {/*</Menu>*/}
                                <Menu
                                    sx={{
                                        mt: '45px',
                                        '& .MuiPaper-root': {
                                            borderRadius: '10px',
                                            backgroundColor: '#03a9f4',
                                            color: 'white',
                                        },
                                    }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting.text} onClick={() => handleClickUserMenu(setting)}>
                                            <Typography textAlign="center">{setting.text}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                    } {userAuth.token.length === 0 &&
                            <>
                            {/*<Button variant='outlined' sx={{color: 'white', borderColor: 'white', mr: 2 }}*/}
                            {/*onClick={goToLogin}>*/}
                            {/*    Login*/}
                            {/*</Button>*/}
                            {/*<Button variant='outlined' sx={{color: 'white', borderColor: 'white'}}*/}
                            {/*onClick={goToRegister}>*/}
                            {/*    Register*/}
                            {/*</Button>*/}
                                <Button
                                    variant='outlined'
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        mr: 2,
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#03a9f4',
                                        },
                                        '@media (max-width:380px)': { mr: 1 },
                                        '@media (max-width:350px)': { mr: 0.5 },
                                        '@media (max-width:300px)': { mr: 0.25 },
                                    }}
                                    onClick={goToLogin}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant='outlined'
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#03a9f4',
                                        },
                                    }}
                                    onClick={goToRegister}
                                >
                                    Register
                                </Button>
                            </>
                    }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;