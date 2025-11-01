import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import type { SignupInput } from "@mubashir2910/medium-common";
// import { stringify } from "postcss";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function SignupForm(){
    const [postInput,setPostInput] = useState<SignupInput>({
        email:"",
        password:"",
    })
    const [name,setName] = useState("");
    const navigate = useNavigate();

    async function sendRequest(){
        const user = {name,email:postInput.email,password:postInput.password};
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,user);
            const jwt = response.data.jwt;
            localStorage.setItem('token',jwt);
            setPostInput({ email: "", password: "" });
            setName("");
            navigate('/blogs');
        }catch(err){
                console.log(err);
        }
    }
    

    return(
        <div className="h-screen flex justify-center flex-col">
                    {/* {JSON.stringify(postInput)} */}
           <div className="flex justify-center bg-white p-10 m-10 rounded-lg shadow-lg">
            <div>
                <div>
                <div className="font-bold text-2xl">
                    Create an account
                </div>
                <div className="text-slate-400 text-sm text-center mb-4">
                    Already have an account?                  
                    <Link className="underline ml-1" to="/sigin">Login</Link>
                </div>
                
            </div>

            <LabelledInput label="Name" value={name} placeholder="Enter your Name"
            onChange={(e)=>{
                setName(e.target.value)
            }} />
            <LabelledInput label="Email" value={postInput.email} placeholder="Enter your Email"
            onChange={(e)=>{
                setPostInput({
                    ...postInput,
                    email:e.target.value
                })
            }} />
            <LabelledInput type="password" value={postInput.password}label="Password" placeholder="Enter your Password"
            onChange={(e)=>{
                setPostInput({
                    ...postInput,
                    password:e.target.value
                })
            }} />
            <button onClick={sendRequest} type="button" className="text-white bg-black   font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  dark:hover:bg-gray-800 focus:outline-none w-full ">Submit</button>

           </div>
            </div>
        </div>
    )
}

interface LabelledInputChange {
    label:string;
    placeholder:string;
    onChange: (e:ChangeEvent<HTMLInputElement>)=>void;
    type?: string
    value:string
}

function LabelledInput({type,value,label,placeholder,onChange}:LabelledInputChange){
        return <div>
            <label className="block mb-2 font-medium ">{label}</label>
            <input type={type || "text"} value={value} className=" border border-gray-300 text-sm rounded-lg  block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 mb-4 " placeholder={placeholder} onChange={onChange} required />
        </div>
}