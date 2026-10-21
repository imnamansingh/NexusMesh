/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Login() {
  return (
    
    <div className="flex h-[80svh] items-center justify-center bg-[#F8F8F8] font-poppins text-black">
        <div className="container mx-auto flex max-w-3xl flex-col items-center justify-center">
          <div className="flex flex-col text-left">
            <h1 className="text-[34px] text-[#181818]">Welcome back</h1>
            <h1 className="text-[14px] text-[#636364] ">
              Welcome back! Please enter your details.
            </h1>
          </div>
          <div>
            <div className="my-2 flex   flex-col text-[14px] py-4">
              <label htmlFor="email" className="text-left text-[#181818] ">
                Wallet Address
              </label>
              <input
                id="email"
                placeholder="Enter your wallet address"
                type="email"
                className="  rounded-xl border   border-[#C4C4C4] p-2 text-[#636364]"
              />
            </div>
            <div className="my-2 flex   flex-col text-[14px]">
              <label htmlFor="password" className="text-left text-[#181818] ">
                Private Key
              </label>
              <input
                id="password"
                placeholder="Enter your private key"
                type="password"
                className=" rounded-xl border   border-[#C4C4C4] p-2 text-[#636364]"
              />
            </div>
          </div>
          <button className="my-6 w-60 rounded-xl bg-[#EA454C] py-2 text-white">
            Log in
          </button>
        </div>
    </div>
    
  );
}
