import axios from "axios";

export interface IValidation {
    isAvailable:boolean;
    message?:string;
}

export const defalutValidState:IValidation = {
    isAvailable : false,
    message : undefined,
}

interface IStringValidation {
    isAvailable:boolean;
    message?:string;

    validCheck:(str:string, str2?:string)=>void;
    get fields():{isAvailable:boolean, message:string|undefined};
}

interface IStringValidationBundle {
    checkers: Array<IStringValidation>;

    validCheck:(str:string, str2?:string)=>{isAvailable:boolean, message:string|undefined};
}

class StringEmptyChecker implements IStringValidation {
    isAvailable:boolean;
    message?: string;

    constructor() {
        this.isAvailable = false;
    }

    validCheck = (text:string) => {
        if(text === "") {
            this.isAvailable = false;
            this.message = "필수 정보입니다.";
        } else {
            this.isAvailable = true;
            this.message = undefined;
        }
    }

    get fields() {
        return {isAvailable: this.isAvailable, message: this.message};
    }
}

class StringFormChecker implements IStringValidation {
    isAvailable:boolean;
    message?: string;
    regexp:RegExp;
    errorMessage: string;

    constructor(regexp: RegExp, errorMessage:string) {
        this.isAvailable = false;
        this.regexp = regexp;
        this.errorMessage = errorMessage;
    }

    validCheck = (id:string) => {
        if(this.regexp.test(id)) {
            this.isAvailable = true;
            this.message = undefined;
        } else {
            this.isAvailable = false;
            this.message = this.errorMessage;
        }
    }

    get fields() {
        return {isAvailable: this.isAvailable, message: this.message};
    }
}

class IdOverlapChecker implements IStringValidation {
    isAvailable:boolean;
    message?: string;

    constructor() {
        this.isAvailable = false;
    }

    validCheck = async(id:string) => {
        try {
            const res = (await axios.get('/api/Users/getOne/' + id)).data;
            console.log(res);
            this.isAvailable = false;
            this.message = "이미 사용중인 아이디입니다.";
            
        } catch (error) {
            this.isAvailable = true;
            this.message = undefined;
        }
        console.log(this.fields);
    }

    get fields() {
        return {isAvailable: this.isAvailable, message: this.message};
    }
}

class StringSameChecker implements IStringValidation {
    isAvailable: boolean;
    message?: string;

    constructor() {
        this.isAvailable = false;
    }

    validCheck = (str:string, str2?:string) => {
        (str === str2) ? this.isAvailable = true : [this.isAvailable, this.message] = [false,"비밀번호가 일치하지 않습니다."];
        return this.fields;
    }

    get fields() {
        return {isAvailable: this.isAvailable, message: this.message};
    }
}

class IdChecker implements IStringValidationBundle {

    checkers: Array<IStringValidation> = [];

    constructor() {
        this.checkers.push(new StringEmptyChecker());
        this.checkers.push(new StringFormChecker(/^[a-z0-9_-]{4,21}$/,"5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다."));
    }

    validCheck =  (str:string) => {
        for (const checker of this.checkers){
             checker.validCheck(str);
        }
        for(const checker of this.checkers) {
            if(!checker.isAvailable) {
                return checker.fields;
            }
        }
        return this.checkers[0].fields;
    }
}

class PwdChecker implements IStringValidationBundle{

    checkers: Array<IStringValidation> = [];

    constructor() {
        this.checkers.push(new StringEmptyChecker());
        this.checkers.push(new StringFormChecker(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,17}$/,"8~16자 영문 대 소문자, 숫자, 한개 이상의 특수문자를 사용하세요."));
    }

    validCheck = (str:string) => {
        for(const checker of this.checkers) {
            checker.validCheck(str)
        }
        for(const checker of this.checkers) {
            if(!checker.isAvailable) {
                return checker.fields;
            }        
        }
        return this.checkers[0].fields;
    }
}

class PwdSameChecker implements IStringValidationBundle {
    checkers: Array<IStringValidation> = [];

    constructor() {
        this.checkers.push(new StringEmptyChecker());
        this.checkers.push(new StringSameChecker());
    }
    
    validCheck = (str:string, str2?:string) => {
        for(const checker of this.checkers) {
            if(checker.constructor.name === "StringSameChecker") {
                checker.validCheck(str,str2);
            } else {
                checker.validCheck(str);
            }
        }
        for(const checker of this.checkers) {
            if(!checker.isAvailable) {
                return checker.fields;
            }        
        }
        return this.checkers[0].fields;
    }

}  

class NameChecker implements IStringValidationBundle{

    checkers: Array<IStringValidation> = [];

    constructor() {
        this.checkers.push(new StringEmptyChecker());
        this.checkers.push(new StringFormChecker(/^[가-힣]{0,21}$/, "1~20자 한글 이름을 사용하세요."));
    }

    validCheck = (str:string) => {
        for(const checker of this.checkers) {
            checker.validCheck(str)
        }
        for(const checker of this.checkers) {
            if(!checker.isAvailable) {
                return checker.fields;
            }        
        }        
        return this.checkers[0].fields;
    }
}

const idChecker = new IdChecker();
const pwdChecker = new PwdChecker();
const pwdSameChecker = new PwdSameChecker();
const nameChecker = new NameChecker();

export { idChecker, pwdChecker, pwdSameChecker, nameChecker};

