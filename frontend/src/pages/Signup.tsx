import Quote from "../components/Quote";
import SignupForm from "../components/SignupForm";

export default function Signup(){
    return (
        <>
            <div className="md:grid grid-cols-2">
                <div className="">
                    <SignupForm/>
                </div>
                <div className="invisible md:visible">
                    <Quote/>
                </div>
                
            </div>
        </>
    )
}