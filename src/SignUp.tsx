import { format } from "path";
import { useState } from "react";

interface Props {
    onSignUp: (form: { id:string; pwd:string; }) => void;
}

const SignUp = ({onSignUp}:Props) => {
    const [form, setForm] = useState<{id:string, pwd:string}>({
        id:'',
        pwd:'',
    });

    const {id, pwd} = form;

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm({
            ...form,
            [name] : value
        })
    }

    const handleClickSignUp = (e:React.MouseEvent<HTMLButtonElement> ) => {
        e.preventDefault();
        onSignUp({id:id, pwd:pwd});
    }

    return (
        <form>
            <div>
                <input type="text" placeholder="아이디" name="id" value={id} onChange={onChange}/><br />
                <input type="text" placeholder="비밀번호" name="pwd" value={pwd} onChange={onChange}/>
            </div>
            <div>
                <button type="submit" onClick={handleClickSignUp}>로그인</button>
            </div>
        </form>
    );
};

export default SignUp;