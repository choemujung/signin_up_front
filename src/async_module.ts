import axios from "axios";

interface IAsyncValidation {
    isAvailable:boolean;
    message?:string;


    validCheck:(str:string)=>void;
    get fields():{isAvailable:boolean, message:string|undefined};
}

class IdOverlapChecker implements IAsyncValidation {
    isAvailable: boolean;
    message?: string;

    constructor() {
        this.isAvailable = false;
    }

    validCheck = async(str:string) => {
        try {
            const res = (await axios.get('/api/Users/getOne/' + str)).data;
            console.log(res);
            this.isAvailable = false;
            this.message = "이미 사용중인 아이디입니다.";
            
        } catch (error) {
            this.isAvailable = true;
            this.message = undefined;
        }
    }

    get fields() {
        return {isAvailable: this.isAvailable, message: this.message};
    }
}

const idOverlapChecker = new IdOverlapChecker();
export {idOverlapChecker};