import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const appSlice = buildCreateSlice({
    creators: {
        asyncThunk: asyncThunkCreator
    }
});