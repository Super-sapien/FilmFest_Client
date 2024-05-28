import {create} from 'zustand';
interface AuthState {
    userAuth: UserAuth;
    setAuth: (userAuth: UserAuth) => void
    removeAuth: () => void
}

const getLocalStorage = (key: string): UserAuth => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: UserAuth) => window.localStorage.setItem(key, JSON.stringify(value));
const removeLocalStorage = (key: string) => window.localStorage.removeItem(key)

const useStore = create<AuthState>((set) =>  ({
    userAuth: getLocalStorage('userAuth') || {userId: -1, token: ''},
    setAuth: (userAuth: UserAuth) => set(state => {
        setLocalStorage('userAuth', userAuth)
        return {userAuth: userAuth}
    }),
    removeAuth: () => set(state => {
        removeLocalStorage('userAuth')
        return {userAuth: {userId: -1, token: ''}}
    }),
}))

export const useAuthStore = useStore;


// import create from 'zustand';

// interface GenreState {
//     genres: Genre[];
//     setGenres: (genres: Genre[]) => void
// }
//
// const getLocalStorage = (key: string): GenreState => JSON.parse(window.localStorage.getItem(key) as string);
// const setLocalStorage = (key: string, value: GenreState) => window.localStorage.setItem(key, JSON.stringify(value));
//
//
// const useStore = create<GenreState>((set) =>  ({
//     genres: getLocalStorage('genres') || {genreId: -1, name: ''},
//     setGenres: (genres: Genre[]) => set(state => {
//         setLocalStorage('genres', genres)
//         return {genres: genres}
//     }),
// }))
//
// export const useGenreStore = useStore;

