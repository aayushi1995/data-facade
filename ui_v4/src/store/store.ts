import { configureStore } from '@reduxjs/toolkit'
import {chatReducer} from '../reducer/chatReducer'

export const store = configureStore({ reducer: chatReducer })

