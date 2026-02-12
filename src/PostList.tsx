import { useEffect, useState } from "react";
import {
    Container, Box, Typography, TextField, Button, Paper, Stack, Chip, type SxProps, type Theme
} from '@mui/material';

// --- TIPE DATA ---
type Post = {
    id: string;
    title: string;
    content: string;
}

// --- CONFIG WARNA & STYLE (Dark Neon) ---
const themeColors = {
    bgGradient: 'linear-gradient(to bottom right, #0f0c29, #302b63, #24243e)',
    cardBg: 'rgba(40, 40, 55, 0.7)',
    accent: '#7c4dff', // Ungu Neon
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    borderHighlight: '1px solid rgba(124, 77, 255, 0.3)',
};

const darkCardStyle: SxProps<Theme> = {
    backgroundColor: themeColors.cardBg,
    backdropFilter: 'blur(10px)',
    border: themeColors.borderHighlight,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        border: `1px solid ${themeColors.accent}`,
        boxShadow: `0 0 15px ${themeColors.accent}40`,
        transform: 'translateY(-2px)',
    }
};

// --- LOGIC SORTING (Simple JavaScript) ---

function sortMyPostsByTitle(dataAsli: Post[]) {
    const dataBaru = [...dataAsli];
    dataBaru.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
    return dataBaru;
}

function sortMyPostsById(dataAsli: Post[]) {
    const dataBaru = [...dataAsli];
    dataBaru.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });
    return dataBaru;
}


// --- COMPONENT UTAMA ---
export function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [titleInput, setTitleInput] = useState('');

    const reloadPost = async () => {
        try {
            const response = await fetch('http://localhost:5173/api/post');
            if (!response.ok) return;
            const data = await response.json();
            setPosts(data.records || []);
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => {
        reloadPost();
    }, []);

    const addPost = async () => {
        if (!titleInput) return;
        try {
            const response = await fetch('http://localhost:5173/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: titleInput, content: "New content created" })
            });
            if (response.status !== 200) {
                await reloadPost();
                setTitleInput('');
            }
        } catch (error) {
            console.error(error);
        }
    }

    // --- Action Handlers ---
    const clickSortTitle = () => {
        const hasilSort = sortMyPostsByTitle(posts);
        setPosts(hasilSort);
    }

    const clickSortId = () => {
        const hasilSort = sortMyPostsById(posts);
        setPosts(hasilSort);
    }

    return (
        <Box sx={{
            minHeight: '100vh', width: '100%', paddingY: 5,
            background: themeColors.bgGradient,
            color: themeColors.textPrimary,
            fontFamily: 'sans-serif'
        }}>
            <Container maxWidth="false">
                
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, background: `linear-gradient(45deg, #fff, ${themeColors.accent})`, backgroundClip: "text", textFillColor: "transparent" }}>
                            Simple Posts
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: themeColors.textSecondary, mt: 0.5 }}>
                            Total Data: {posts.length}
                        </Typography>
                    </Box>
                    
                    {/* Tombol Refresh Pakai Emoji */}
                    <Button 
                        onClick={reloadPost} 
                        variant="outlined"
                        sx={{ 
                            minWidth: '50px', height: '50px', borderRadius: '50%', 
                            fontSize: '1.5rem', borderColor: 'rgba(255,255,255,0.2)', color: 'white'
                        }}
                    >
                        🔄
                    </Button>
                </Box>

                {/* AREA INPUT & TOMBOL */}
                <Paper elevation={0} sx={{ ...darkCardStyle, padding: 3, marginBottom: 4 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        
                        <TextField 
                            variant="outlined" size="small" 
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            placeholder="✨ Tulis judul baru disini..."
                            sx={{
                                flexGrow: 1, 
                                backgroundColor: 'rgba(255,255,255,0.05)', 
                                borderRadius: 1,
                                input: { color: 'white' },
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                            }}
                        />

                        <Button variant="contained" onClick={addPost} sx={{ bgcolor: themeColors.accent, fontWeight: 'bold' }}>
                            ➕ Add
                        </Button>

                        <Box sx={{ width: '1px', height: '30px', bgcolor: 'rgba(255,255,255,0.2)', mx: 1 }}></Box>

                        {/* TOMBOL SORT (Tanpa Icon Library) */}
                        <Button 
                            variant="outlined" 
                            onClick={clickSortId} 
                            sx={{ color: '#b0b0b0', borderColor: 'rgba(255,255,255,0.2)' }}
                        >
                            🔢 Sort ID
                        </Button>

                        <Button 
                            variant="outlined" 
                            onClick={clickSortTitle} 
                            sx={{ color: '#b0b0b0', borderColor: 'rgba(255,255,255,0.2)' }}
                        >
                            🔤 Sort Title
                        </Button>

                    </Box>
                </Paper>

                {/* DAFTAR POSTS */}
                <Stack spacing={2}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Paper key={post.id} sx={{ ...darkCardStyle, padding: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                                {/* Chip ID */}
                                <Chip 
                                    label={"#" + post.id.substring(0, 6)} 
                                    sx={{ 
                                        bgcolor: 'rgba(124, 77, 255, 0.15)', 
                                        color: themeColors.accent, 
                                        fontWeight: 'bold', 
                                        fontFamily: 'monospace',
                                        border: `1px solid ${themeColors.accent}`
                                    }} 
                                />
                                
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                                        {post.content}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <Paper sx={{ ...darkCardStyle, padding: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                            <Typography variant="h6" color="gray">📭 Belum ada data post.</Typography>
                        </Paper>
                    )}
                </Stack>

            </Container>
        </Box>
    );
}