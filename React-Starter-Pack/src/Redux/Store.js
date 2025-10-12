import {configureStore} from '@reduxjs/toolkit';
import usersReducer from './usersclice';
const store=configureStore({
    reducer:{
        user:usersReducer,
    }
});
export default store;