// import dayjs, {Dayjs} from "dayjs";

const removeEmptyFields = (obj: any) => {
    const newJSON: any = {}
    // let key: string | Dayjs;
    for (let key in obj) {
        if (obj[key] !== '' && obj[key] !== -1) {
            newJSON[key] = obj[key];
        }
    }
    return newJSON
}

export default removeEmptyFields;