import React, { useEffect, useState } from "react";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../services/blogApiService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Card,
    CardContent,
    CardHeader,
    Typography,
    IconButton,
    Avatar,
    Box,
    Container,
    LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const BlogPage = () => {
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        setLoading(true);
        getBlogs()
            .then((res) => {
                setBlogs(res.data);
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    function handleFormOpen(blog) {

        if (blog) {
            setIsEditMode(true);
            setFormData({
                title: blog.title,
                content: blog.content,
                author: blog.author,
                _id: blog._id,
            });
        }

        setOpenDialog(true);
    };

    const handleFormSubmit = () => {
        setLoading(true);

        if (isEditMode) {

            updateBlog(formData._id, formData)
                .then(() => {
                    setOpenDialog(false);
                    fetchBlogs();
                    resetForm()
                })
                .catch((err) => console.error("Error updating blog:", err))
                .finally(() => setLoading(false));

        } else {
            createBlog(formData)
                .then(() => {
                    setOpenDialog(false);
                    fetchBlogs();
                    resetForm()
                })
                .catch((err) => console.error("Error creating blog:", err))
                .finally(() => setLoading(false));
        }
    };

    function resetForm() {
        setFormData({
            title: "",
            content: "",
            author: "",
        });
        setIsEditMode(false)
    }

    function handleDelete(blog) {
        setLoading(true);

        deleteBlog(blog._id)
            .then(() => {
                fetchBlogs();
            })
            .catch((err) => console.error("Error deleting blog:", err))
            .finally(() => setLoading(false));
    };



    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}
            >
                Welcome to the Blog Dashboard
            </Typography>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                >
                    Manage your blog posts effortlessly and create engaging content.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: 3
                    }}
                    onClick={() => {
                        handleFormOpen();
                    }}
                >
                    Create New Post
                </Button>
            </Box>

            {loading && (
                <LinearProgress />
            )}

            <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={"auto"}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                navigation
                pagination={{ clickable: true }}
                style={{ padding: "10px 5px 50px 5px" }}
            >
                {blogs.map((blog) => (
                    <SwiperSlide key={blog._id}>
                        <Card
                            sx={{
                                height: { xs: "auto", sm: "calc(100vh - 280px)" }, // Adaptive height
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: 3,
                                maxWidth: "100%", // Ensures it fits within the container
                                margin: "auto",
                            }}
                        >
                            <CardHeader
                                avatar={<Avatar alt={blog.author} src="" />}
                                title={blog.title}
                                subheader={`By ${blog.author}`}
                                titleTypographyProps={{
                                    fontWeight: "bold",
                                    noWrap: false,
                                }}
                                subheaderTypographyProps={{ color: "text.secondary" }}
                            />
                            <CardContent
                                sx={{
                                    flexGrow: 1, // Makes it take available space
                                    overflow: "hidden", // Prevents overflow
                                    display: "flex", // Ensures content stretches
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 5,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        flexGrow: 1,
                                    }}
                                >
                                    {blog.content}
                                </Typography>
                            </CardContent>

                            <Box
                                sx={{
                                    p: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1,
                                }}
                            >
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        handleFormOpen(blog);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => {
                                        handleDelete(blog);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>

                    </SwiperSlide>
                ))}
            </Swiper>

            <Dialog open={openDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {isEditMode ? "Edit Blog Post" : "Create Blog Post"}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <TextField
                        label="Content"
                        fullWidth
                        margin="dense"
                        name="content"
                        multiline
                        rows={4}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                    />
                    <TextField
                        label="Author"
                        fullWidth
                        margin="dense"
                        name="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                    />

                </DialogContent>
                <DialogActions>
                    <Button

                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setOpenDialog(false)
                            resetForm()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default BlogPage;
