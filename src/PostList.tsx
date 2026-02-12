import { useState, useEffect, useMemo } from "react";
// Import gaya UI Material (Style import satu per satu)
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

// --- TIPE DATA ---
type Post = {
    id?: string;      // Jaga-jaga kalau API pakai 'id'
    _id?: string;     // Jaga-jaga kalau API pakai '_id'
    title: string;
    content: string;
    createdAt: string;
    author?: {
        name: string;
    };
}

export function PostList() {
    
    // 1. State Management
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "title" | "user">("date");

    // 2. Fetch Data (Fixed: Menggunakan 'records')
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5173/api/post');
                const result = await response.json();
                
                // PERBAIKAN UTAMA: Cek 'records' dulu, baru 'data'
                setPosts(result.records || result.data || []);
                
            } catch (error) {
                console.error("Gagal ambil data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 3. Logic Filter & Sort (Menggunakan useMemo untuk efisiensi)
    const processedPosts = useMemo(() => {
        // A. Filtering (Search)
        let data = posts.filter((post) => {
            const keyword = search.toLowerCase();
            const titleMatch = (post.title || "").toLowerCase().includes(keyword);
            const contentMatch = (post.content || "").toLowerCase().includes(keyword);
            const authorMatch = (post.author?.name || "").toLowerCase().includes(keyword);
            return titleMatch || contentMatch || authorMatch;
        });

        // B. Sorting
        data.sort((a, b) => {
            if (sortBy === "title") {
                return (a.title || "").localeCompare(b.title || "");
            } else if (sortBy === "user") {
                const userA = a.author?.name || "z"; 
                const userB = b.author?.name || "z";
                return userA.localeCompare(userB);
            } else {
                // Default: Date (Newest first)
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            }
        });

        return data;
    }, [posts, search, sortBy]);

    // --- RENDER UI (Dark Minimalist) ---
    return (
        <Box sx={{ 
            bgcolor: '#000000', 
            minHeight: '100vh', 
            color: 'white', 
            py: 5,
            fontFamily: 'sans-serif'
        }}>
            <Container maxWidth="md">
                
                {/* Header */}
                <Box mb={4}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Forum Posts.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Total Posts: {processedPosts.length}
                    </Typography>
                </Box>

                {/* Controls: Search & Sort Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <TextField 
                        placeholder="Search topic..." 
                        variant="outlined" 
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ 
                            flexGrow: 1, 
                            bgcolor: '#121212', 
                            borderRadius: 1,
                            input: { color: 'white' },
                            '& fieldset': { borderColor: '#333' }
                        }}
                    />
                    
                    <Button 
                        variant={sortBy === 'date' ? "contained" : "outlined"} 
                        onClick={() => setSortBy('date')}
                        sx={{ borderColor: '#333', color: sortBy === 'date' ? 'black' : 'white', bgcolor: sortBy === 'date' ? 'white' : 'transparent' }}
                    >
                        Newest
                    </Button>
                    <Button 
                        variant={sortBy === 'title' ? "contained" : "outlined"} 
                        onClick={() => setSortBy('title')}
                        sx={{ borderColor: '#333', color: sortBy === 'title' ? 'black' : 'white', bgcolor: sortBy === 'title' ? 'white' : 'transparent' }}
                    >
                        Title
                    </Button>
                    <Button 
                        variant={sortBy === 'user' ? "contained" : "outlined"} 
                        onClick={() => setSortBy('user')}
                        sx={{ borderColor: '#333', color: sortBy === 'user' ? 'black' : 'white', bgcolor: sortBy === 'user' ? 'white' : 'transparent' }}
                    >
                        User
                    </Button>
                </Box>

                {/* Post List */}
                <Stack spacing={2}>
                    {loading ? (
                        // Skeleton Loading
                        [1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rectangular" height={120} sx={{ bgcolor: '#121212', borderRadius: 2 }} />
                        ))
                    ) : (
                        // List Data
                        processedPosts.map((post, index) => (
                            <Paper 
                                // PERBAIKAN KEY: Cek id, _id, atau pakai index sebagai fallback terakhir
                                key={post.id || post._id || index} 
                                elevation={0}
                                sx={{ 
                                    p: 3, 
                                    bgcolor: '#121212', 
                                    border: '1px solid #333', 
                                    borderRadius: 3,
                                    '&:hover': { borderColor: '#666' } 
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#333' }}>
                                        {(post.author?.name || "A")[0].toUpperCase()}
                                    </Avatar>
                                    <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 'bold' }}>
                                        @{post.author?.name || "Unknown"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#555' }}>
                                        • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
                                    </Typography>
                                </Box>

                                {/* INI YANG DIUBAH JADI PUTIH */}
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                                    {post.title}
                                </Typography>
                                
                                <Typography variant="body2" sx={{ color: '#bbb' }}>
                                    {post.content}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Stack>

            </Container>
        </Box>
    );
}