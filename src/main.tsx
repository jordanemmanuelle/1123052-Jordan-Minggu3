import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import  TestUI  from './TestUI.tsx';
import { PostList } from './PostList.tsx';
import { LearningHooks } from './LearningHooks.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <PostList />
  // </StrictMode>,
)
