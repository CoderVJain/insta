  import React, { useState } from "react";
  import { Label } from "./ui/label";
  import { Input } from "./ui/input";
  import { Button } from "./ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import axios from "axios";
  import { toast } from "sonner";
  import { Link, useNavigate } from "react-router-dom";
  import { Loader2 } from "lucide-react";
  import { useDispatch } from "react-redux";
  import { setAuthUser } from "@/redux/Slices/authSlice.js";

  const Login = () => {
    const [input, setInput] = useState({
      email: "",
      password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
      setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signupHandler = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/login",
          input,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setAuthUser(res.data.user)); 
          navigate("/");
          toast.success(res.data.message);
          setInput({
            email: "",
            password: "",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-slate-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-2 border-gray-100">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={signupHandler}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="Enter your password"
                  className="mt-1"
                />
              </div>
              {loading ? (
                <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </Button>
              ) : (
                <Button className="mt-2" type="submit">
                  Login
                </Button> 
              )}
              <p className="text-sm text-center text-muted-foreground">
                Create a Account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:underline hover:opacity-90"
                >
                  SignUp
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default Login;
