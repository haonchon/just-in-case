import { SignIn } from "@/components/SignIn";

export default function Page() {
    return (
        <div className="bg-gray-100">
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-center mt-8">
            Welcome to Worldchain
            </h1>
            <p className="text-center mt-4">
            This is a page in the Worldchain app.
            </p>
            <SignIn/>
        </div>
        </div>
    );
}