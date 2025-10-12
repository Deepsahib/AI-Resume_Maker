import { createSlice } from "@reduxjs/toolkit";
const usersclice=createSlice({
    name:"user",
    initialState:{
        user:null,
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload;
        },
        clearUser:(state)=>{
            state.user=null;
        }
    }
});
export const {setUser,clearUser}=usersclice.actions;
export default usersclice.reducer;