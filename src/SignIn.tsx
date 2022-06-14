import axios from "axios";
import { useState } from "react";
import {idChecker, pwdChecker, pwdSameChecker, nameChecker, defalutValidState} from "./ValidModule";
import {idOverlapChecker} from "./async_module";

interface Props {
    onSignIn:(form: { id: string; password: string; name: string; })=>void;
}

const SignIn = ({ onSignIn }: Props) => {
    const [form, setForm] = useState({
        idState: '',
        pwdState: '',
        pwdSameState: '',
        nameState: '',
    });

    const [valid, setValid] = useState({
        idValid: defalutValidState,
        pwdValid: defalutValidState,
        pwdSameValid: defalutValidState,
        nameValid: defalutValidState
    });

    const {idState,pwdState,pwdSameState,nameState } = form;
    const { idValid, pwdValid, pwdSameValid, nameValid } = valid;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'idState':
                const idFormValid = idChecker.validCheck(value);
                if(idFormValid.isAvailable) {
                    await idOverlapChecker.validCheck(value);
                    setValid({ ...valid, idValid: idOverlapChecker.fields });
                } else {
                    setValid({ ...valid, idValid: idFormValid});
                }
                break;
            case 'pwdState':
                setValid({ ...valid, pwdValid: pwdChecker.validCheck(value) });
                break;
            case 'pwdSameState':
                setValid({ ...valid, pwdSameValid: pwdSameChecker.validCheck(value,pwdState) });
                break;
            case 'nameState':
                setValid({ ...valid, nameValid: nameChecker.validCheck(value) });
                break;
        }
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
        // e.preventDefault();
        const form = { id: idState, password: pwdState, name: nameState };
        if(idValid.isAvailable === true && pwdValid.isAvailable === true && pwdSameValid.isAvailable === true && nameValid.isAvailable === true) {
            onSignIn(form);
        } else {
            alert('입력 값이 유효하지 않습니다.');
        }

        // setForm({
        //     name: '',
        //     id: '',
        //     password: '',
        //     pwdCheck: ''
        // });
    };

    return (
        <div>
            <div>
                <div>
                    <h3>아이디</h3>
                    <input type="text" placeholder="아이디" name="idState" value={idState} onChange={onChange} onBlur={onBlur} />
                    <div>{idValid.message}</div>
                </div>
                <div>
                    <h3>비밀번호</h3>
                    <input type="text" placeholder="비밀번호" name="pwdState" value={pwdState} onChange={onChange} onBlur={onBlur} />
                    <div>{pwdValid.message}</div>
                </div>
                <div>
                    <h3>비밀번호 확인</h3>
                    <input type="text" placeholder="비밀번호 확인" name="pwdSameState" value={pwdSameState} onChange={onChange} onBlur={onBlur} />
                </div>
                <div>{pwdSameValid.message}</div>
                <div>
                    <h3>이름</h3>
                    <input type="text" placeholder="이름" name="nameState" value={nameState} onChange={onChange} onBlur={onBlur} />
                    <div>{nameValid.message}</div>
                </div>
                <button onClick={handleSubmit}>회원가입</button>
            </div>
        </div>
    );
};

export default SignIn;
